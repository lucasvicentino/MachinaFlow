import { MachineNode } from './MachineNode/MachineNode';
import { ActionNode } from './ActionNode/ActionNode';
import { ConditionNode } from './ConditionNode/ConditionNode';
import { SafetyNode } from './SafetyNode/SafetyNode';
import { LogicNode } from './LogicNode/LogicNode';
import { TimerNode } from './TimerNode/TimerNode';
import { MachineResourceNode } from './MachineResourceNode/MachineResourceNode';

export const nodeTypes = {
  machineTrigger: MachineNode,
  machine: MachineNode,
  conditionCheck: ConditionNode,
  machineAction: ActionNode,
  action: ActionNode,
  safetyBlock: SafetyNode,
  safety: SafetyNode,
  logicBlock: LogicNode,
  logic: LogicNode,
  timerBlock: TimerNode,
  delayNode: TimerNode,
  machineResource: MachineResourceNode,
};

export {
  MachineNode,
  ActionNode,
  ConditionNode,
  SafetyNode,
  LogicNode,
  TimerNode,
  MachineResourceNode
};
