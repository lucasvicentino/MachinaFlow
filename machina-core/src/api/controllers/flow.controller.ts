import { Request, Response } from 'express';
import { FlowRepository } from '../../database/repositories/flow.repository';
import { DagEngine } from '../../engine/dag';
import { WorkflowExecutor } from '../../engine/executor';
import { FlowDefinition } from '@machina/shared';

const executor = new WorkflowExecutor();

export class FlowController {
  static listFlows(req: Request, res: Response): void {
    const flows = FlowRepository.findAll();
    res.json({ success: true, flows });
  }

  static getFlow(req: Request, res: Response): void {
    const flow = FlowRepository.findById(req.params.id);
    if (!flow) {
      res.status(404).json({ success: false, error: 'Fluxo não encontrado' });
      return;
    }
    res.json({ success: true, flow });
  }

  static deployFlow(req: Request, res: Response): void {
    const flow: FlowDefinition = req.body;

    if (!flow.flowId || !flow.nodes) {
      res.status(400).json({ success: false, error: 'Estrutura de fluxo inválida' });
      return;
    }

    const validation = DagEngine.validate(flow);
    if (!validation.isValid) {
      res.status(400).json({ success: false, error: validation.error });
      return;
    }

    FlowRepository.save(flow);
    console.log(`[Flow Controller] Fluxo ${flow.flowId} implantado com sucesso (${flow.nodes.length} nós)`);

    res.json({
      success: true,
      message: 'Fluxo publicado e ativado com sucesso',
      flowId: flow.flowId,
      nodesCount: flow.nodes.length,
      edgesCount: flow.edges.length
    });
  }

  static async runFlow(req: Request, res: Response): Promise<void> {
    const flow = FlowRepository.findById(req.params.id);
    if (!flow) {
      res.status(404).json({ success: false, error: 'Fluxo não encontrado' });
      return;
    }

    // Trigger async execution
    executor.executeFlow(flow).catch((err) => {
      console.error(`[Flow Runner] Erro ao executar fluxo ${flow.flowId}:`, err);
    });

    res.json({ success: true, message: `Execução do fluxo ${flow.flowId} disparada` });
  }

  static stopFlow(req: Request, res: Response): void {
    executor.stopFlow(req.params.id);
    res.json({ success: true, message: `Comando de parada enviado para ${req.params.id}` });
  }
}

