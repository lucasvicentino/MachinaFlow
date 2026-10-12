import { AnyNodeData, NodeType } from './node.types';
import { FlowStatus } from '../constants/protocols';

export interface NodePosition {
  x: number;
  y: number;
}

export interface FlowNode<T = AnyNodeData> {
  id: string;
  type: NodeType;
  data: T;
  position: NodePosition;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  animated?: boolean;
  label?: string;
}

export interface FlowDefinition {
  flowId: string;
  name: string;
  description?: string;
  version?: number;
  status?: FlowStatus;
  createdAt?: string;
  updatedAt?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

