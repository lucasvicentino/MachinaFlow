import { NodeExecutionState } from '../constants/protocols';

export interface NodeStatusUpdate {
  flowId: string;
  nodeId: string;
  status: NodeExecutionState;
  timestamp: string;
  durationMs?: number;
  output?: Record<string, unknown>;
  error?: string;
}

export interface MachineTelemetryReading {
  machineIp: string;
  port: number;
  address: number;
  registerType: string;
  value: number | boolean;
  timestamp: string;
}

export interface ExecutionLogEntry {
  id: string;
  flowId: string;
  cycleId: string;
  nodeId?: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type SocketEventType =
  | 'telemetry:reading'
  | 'flow:node_status'
  | 'flow:started'
  | 'flow:stopped'
  | 'flow:error'
  | 'log:entry';

