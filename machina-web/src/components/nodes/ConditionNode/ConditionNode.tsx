import React from 'react';
import { Handle, Position } from '@xyflow/react';

export interface ConditionNodeProps {
  data: {
    label?: string;
    field?: string;
    operator?: string;
    value?: number | string | boolean;
    status?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  };
}

export const ConditionNode: React.FC<ConditionNodeProps> = ({ data }) => {
  const getStatusBorder = () => {
    switch (data.status) {
      case 'RUNNING': return 'border-amber-400 ring-2 ring-amber-400 animate-pulse';
      case 'SUCCESS': return 'border-amber-500 shadow-amber-950';
      case 'FAILED': return 'border-rose-500 shadow-rose-950';
      default: return 'border-amber-500 shadow-amber-950';
    }
  };

  return (
    <div className={`bg-slate-900 border-2 ${getStatusBorder()} text-white rounded-lg p-3 shadow-lg w-56 text-xs transition-all`}>
      <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">🔀 {data.label || 'Condição'}</span>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">Lógica</span>
      </div>
      <div className="text-slate-300 text-[11px] mb-1 font-mono">
        {data.field} {data.operator} {String(data.value)}
      </div>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-amber-400 border-none" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-amber-400 border-none" />
    </div>
  );
};

