import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ShieldAlert, DoorClosed, ScanEye, Hand, AlertTriangle } from 'lucide-react';

export interface SafetyNodeProps {
  data: {
    label: string;
    subType?: 'notHalt' | 'schutztuer' | 'lichtschranke' | 'zweihand' | 'muting';
    details?: string;
    safetyCategory?: string;
    channelA?: boolean;
    channelB?: boolean;
    status?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  };
}

export const SafetyNode: React.FC<SafetyNodeProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.subType) {
      case 'schutztuer':
        return <DoorClosed className="w-3.5 h-3.5 text-amber-300" />;
      case 'lichtschranke':
        return <ScanEye className="w-3.5 h-3.5 text-amber-300" />;
      case 'zweihand':
        return <Hand className="w-3.5 h-3.5 text-amber-300" />;
      case 'muting':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />;
      case 'notHalt':
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />;
    }
  };

  const getStatusBorder = () => {
    switch (data.status) {
      case 'RUNNING':
        return 'border-amber-400 ring-2 ring-amber-400 animate-pulse';
      case 'SUCCESS':
        return 'border-emerald-500 shadow-emerald-950/60 shadow-lg';
      case 'FAILED':
        return 'border-rose-500 shadow-rose-950/60 shadow-lg';
      default:
        return 'border-amber-500/80 shadow-amber-950/40 shadow-md';
    }
  };

  return (
    <div
      className={`bg-slate-900 border-2 ${getStatusBorder()} text-white rounded-lg p-3 shadow-lg w-60 text-xs transition-all relative overflow-hidden`}
    >
      {/* TIA Portal Safety Yellow Warning Header Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

      <div className="font-bold text-amber-400 mb-1.5 flex items-center justify-between pt-0.5">
        <span className="flex items-center gap-1.5">
          {getIcon()}
          <span className="truncate">{data.label}</span>
        </span>
        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-500/30">
          {data.safetyCategory || 'Cat.4 / PLe'}
        </span>
      </div>

      <div className="text-slate-300 text-[11px] mb-2 font-mono flex items-center justify-between">
        <span className="text-slate-400">{data.details || 'Duplo Canal Supervisionado'}</span>
      </div>

      {/* Industrial Channel Diagnostics Status */}
      <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono bg-slate-950/70 p-1.5 rounded border border-slate-800">
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-500">Canal A:</span>
          <span className="text-emerald-400 font-bold">1 (OK)</span>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-slate-500">Canal B:</span>
          <span className="text-emerald-400 font-bold">1 (OK)</span>
        </div>
      </div>

      {/* n8n Machine Resource Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="machine-resource-in"
        className="w-3.5 h-3.5 bg-purple-500 border-2 border-white rounded-full hover:scale-125 transition"
        title="Conexão de Recurso de Máquina (n8n Style)"
      />

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-amber-400 border border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-amber-400 border border-slate-900"
      />
    </div>
  );
};

