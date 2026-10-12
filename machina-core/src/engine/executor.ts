import {
  FlowDefinition,
  FlowNode,
  NodeExecutionState,
  MachineTriggerNodeData,
  ConditionCheckNodeData,
  MachineActionNodeData,
  DelayNodeData,
  ModbusRegisterType
} from '@machina/shared';
import { DagEngine } from './dag';
import { ConditionEvaluator } from './evaluator';
import { SafetyGuard } from './safetyGuard';
import { ProtocolFactory } from '../protocols/protocolFactory';
import { TelemetryServer } from '../websocket/telemetryServer';
import { config } from '../config/env';

export class WorkflowExecutor {
  private activeRuns: Map<string, boolean> = new Map();

  async executeFlow(flow: FlowDefinition): Promise<{ success: boolean; error?: string }> {
    const validation = DagEngine.validate(flow);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    if (!SafetyGuard.isSafeToExecute()) {
      return { success: false, error: 'Execução bloqueada por parada de emergência!' };
    }

    this.activeRuns.set(flow.flowId, true);
    const context: Record<string, unknown> = {};

    try {
      const rootNodes = DagEngine.getRootNodes(flow);
      for (const root of rootNodes) {
        await this.executeNodeChain(flow, root, context);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      this.activeRuns.delete(flow.flowId);
    }
  }

  stopFlow(flowId: string): void {
    this.activeRuns.set(flowId, false);
  }

  private async executeNodeChain(
    flow: FlowDefinition,
    node: FlowNode,
    context: Record<string, unknown>
  ): Promise<void> {
    if (!this.activeRuns.get(flow.flowId)) {
      console.log(`[Executor] Execução do fluxo ${flow.flowId} interrompida.`);
      return;
    }

    const startTime = Date.now();
    TelemetryServer.broadcastNodeStatus({
      flowId: flow.flowId,
      nodeId: node.id,
      status: NodeExecutionState.RUNNING,
      timestamp: new Date().toISOString()
    });

    try {
      let proceed = true;

      switch (node.type) {
        case 'machineTrigger':
        case 'safetyBlock':
        case 'safety': {
          const data = node.data as any;
          const port = data.port || config.defaultModbusPort;
          const driver = ProtocolFactory.getDriver(data.protocol || 'Modbus TCP', data.machineIp || '127.0.0.1', port);
          await driver.connect(data.machineIp || '127.0.0.1', port, data.unitId || 1);
          const regAddress = data.registerAddress ?? data.register ?? 100;
          const regType = data.registerType || ModbusRegisterType.HOLDING_REGISTER;
          const res = await driver.read(regType, regAddress);
          context['temperatura'] = res.value; // Generic mapping for MVP
          context[`node_${node.id}_value`] = res.value;
          break;
        }

        case 'conditionCheck':
        case 'logicBlock':
        case 'logic': {
          const data = node.data as any;
          if (data.operator === 'AND' || data.operator === 'UND') {
            proceed = true;
          } else {
            proceed = ConditionEvaluator.evaluate(data, context);
          }
          break;
        }

        case 'machineAction':
        case 'action': {
          const data = node.data as any;
          const port = data.port || config.defaultModbusPort;
          await SafetyGuard.assertRateLimit(`${data.machineIp || '127.0.0.1'}:${port}`);
          const driver = ProtocolFactory.getDriver(data.protocol || 'Modbus TCP', data.machineIp || '127.0.0.1', port);
          await driver.connect(data.machineIp || '127.0.0.1', port, data.unitId || 1);

          const isCoil = data.action === 'writeCoil' || data.actionType === 'Coil Write' || data.actionType === 'Safety Cut-Off' || data.actionType === 'Safety Output';
          if (isCoil) {
            await driver.writeCoil(data.address ?? 10, Boolean(data.value));
          } else {
            await driver.writeHoldingRegister(data.address ?? 100, Number(data.value));
          }
          break;
        }

        case 'delayNode':
        case 'timerBlock': {
          const data = node.data as any;
          const delay = data.presetTimeMs || data.delayMs || 1000;
          await new Promise((r) => setTimeout(r, delay));
          break;
        }
      }

      TelemetryServer.broadcastNodeStatus({
        flowId: flow.flowId,
        nodeId: node.id,
        status: proceed ? NodeExecutionState.SUCCESS : NodeExecutionState.SKIPPED,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime
      });

      if (proceed) {
        const nextNodes = DagEngine.getNextNodes(flow, node.id);
        for (const next of nextNodes) {
          await this.executeNodeChain(flow, next, context);
        }
      }
    } catch (err: any) {
      TelemetryServer.broadcastNodeStatus({
        flowId: flow.flowId,
        nodeId: node.id,
        status: NodeExecutionState.FAILED,
        timestamp: new Date().toISOString(),
        error: err.message
      });
      throw err;
    }
  }
}

