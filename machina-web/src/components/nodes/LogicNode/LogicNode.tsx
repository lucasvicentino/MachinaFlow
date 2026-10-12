import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitMerge } from 'lucide-react';

export interface LogicNodeProps {
  data: {
    label: string;
    operator?: 'AND' | 'OR' | 'XOR' | 'RS';
    details?: string;
    status?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  };
}

export const LogicNode: React.FC<LogicNodeProps> = ({ data }) => {
  const getStatusBorder = () => {
    switch (data.status) {
      case 'RUNNING':
        return 'border-amber-400 ring-2 ring-amber-400 animate-pulse';
      case 'SUCCESS':
        return 'border-indigo-400 shadow-indigo-950/60 shadow-lg';
      case 'FAILED':
        return 'border-rose-500 shadow-rose-950/60 shadow-lg';
      default:
        return 'border-indigo-500/60 shadow-indigo-950/40 shadow-md';
    }
  };

  const operator = data.operator || 'AND';

  return (
    <div
      className={`bg-slate-900 border-2 ${getStatusBorder()} text-white rounded-lg p-3 shadow-lg w-52 text-xs transition-all relative overflow-hidden`}
    >
      <div className="font-bold text-indigo-400 mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
          <span>{data.label || `Porta ${operator}`}</span>
        </span>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-indigo-500/30 font-bold">
          {operator}
        </span>
      </div>

      <div className="text-slate-400 text-[10px] font-mono mb-2">
        {data.details || 'Verknüpfungsfunktion (FBD)'}
      </div>

      {/* Inputs In1 / In2 */}
      <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800">
        <div className="flex justify-between items-center">
          <span>In 1 (A)</span>
          <span className="text-slate-500">→</span>
        </div>
        <div className="flex justify-between items-center">
          <span>In 2 (B)</span>
          <span className="text-slate-500">→</span>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="in1"
        style={{ top: '35%' }}
        className="w-2.5 h-2.5 bg-indigo-400 border border-slate-900"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in2"
        style={{ top: '70%' }}
        className="w-2.5 h-2.5 bg-indigo-400 border border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-2.5 h-2.5 bg-indigo-400 border border-slate-900"
      />
    </div>
  );
};

