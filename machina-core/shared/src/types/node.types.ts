import { ModbusRegisterType, ProtocolType } from '../constants/protocols';

export type NodeType =
  | 'machineTrigger'
  | 'conditionCheck'
  | 'machineAction'
  | 'action'
  | 'delayNode'
  | 'notificationNode'
  | 'safetyBlock'
  | 'safety'
  | 'logicBlock'
  | 'logic'
  | 'timerBlock'
  | 'machineResource';

export interface BaseNodeData {
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface MachineTriggerNodeData extends BaseNodeData {
  protocol: ProtocolType;
  machineIp: string;
  port: number;
  unitId?: number;
  registerType: ModbusRegisterType;
  registerAddress: number;
  triggerCondition?: 'on_change' | 'equals' | 'greater_than' | 'less_than';
  triggerValue?: number | boolean;
  pollIntervalMs?: number;
}

export type ConditionOperator = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in_range';

export interface ConditionCheckNodeData extends BaseNodeData {
  field: string;
  operator: ConditionOperator;
  value: number | string | boolean;
  secondValue?: number; // For in_range comparisons
}

export interface MachineActionNodeData extends BaseNodeData {
  protocol: ProtocolType;
  machineIp: string;
  port: number;
  unitId?: number;
  action: 'writeCoil' | 'writeRegister';
  address: number;
  value: boolean | number;
  handshakeConfirmation?: boolean;
  verifyAddress?: number;
  expectedVerifyValue?: number | boolean;
}

export interface DelayNodeData extends BaseNodeData {
  delayMs: number;
}

export interface NotificationNodeData extends BaseNodeData {
  channel: 'log' | 'webhook' | 'email';
  message: string;
  webhookUrl?: string;
}

export type AnyNodeData =
  | MachineTriggerNodeData
  | ConditionCheckNodeData
  | MachineActionNodeData
  | DelayNodeData
  | NotificationNodeData;

