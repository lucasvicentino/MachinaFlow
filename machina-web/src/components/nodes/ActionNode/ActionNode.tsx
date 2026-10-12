import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Factory } from 'lucide-react';

export interface ActionNodeProps {
  data: {
    label: string;
    actionType?: string;
    details?: string;
    machineIp?: string;
    address?: number;
    value?: number | boolean;
    status?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
    connectedMachineName?: string;
    connectedTagName?: string;
  };
}

export const ActionNode: React.FC<ActionNodeProps> = ({ data }) => {
  const getStatusBorder = () => {
    switch (data.status) {
      case 'RUNNING': return 'border-amber-400 ring-2 ring-amber-400 animate-pulse';
      case 'SUCCESS': return 'border-emerald-500 shadow-emerald-950';
      case 'FAILED': return 'border-rose-500 shadow-rose-950';
      default: return 'border-emerald-500 shadow-emerald-950';
    }
  };

  return (
    <div className={`bg-slate-900 border-2 ${getStatusBorder()} text-white rounded-lg p-3 shadow-lg w-60 text-xs transition-all relative`}>
      {/* n8n Machine Resource Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="machine-resource-in"
        className="w-3.5 h-3.5 bg-purple-500 border-2 border-white rounded-full hover:scale-125 transition"
        title="Conexão de Recurso de Máquina (n8n Style)"
      />

      {data.connectedMachineName && (
        <div className="mb-1.5 flex items-center gap-1 text-[9px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-mono">
          <Factory className="w-2.5 h-2.5 text-purple-400" />
          <span className="truncate">Recurso: {data.connectedMachineName}</span>
        </div>
      )}

      <div className="font-bold text-emerald-400 mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">⚡ {data.label}</span>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
          {data.actionType || 'Write'}
        </span>
      </div>

      <div className="text-slate-300 text-[11px] mb-1 font-mono">
        {data.connectedTagName ? (
          <span className="text-purple-300 font-bold">{data.connectedTagName}</span>
        ) : data.machineIp ? (
          `${data.machineIp} : Addr ${data.address}`
        ) : (
          data.details
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-emerald-400 border-none" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-emerald-400 border-none" />
    </div>
  );
};
