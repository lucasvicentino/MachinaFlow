import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';

export interface TimerNodeProps {
  data: {
    label: string;
    timerType?: 'TON' | 'TOF' | 'TP';
    presetTimeMs?: number;
    details?: string;
    status?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  };
}

export const TimerNode: React.FC<TimerNodeProps> = ({ data }) => {
  const getStatusBorder = () => {
    switch (data.status) {
      case 'RUNNING':
        return 'border-cyan-400 ring-2 ring-cyan-400 animate-pulse';
      case 'SUCCESS':
        return 'border-cyan-500 shadow-cyan-950/60 shadow-lg';
      case 'FAILED':
        return 'border-rose-500 shadow-rose-950/60 shadow-lg';
      default:
        return 'border-cyan-500/60 shadow-cyan-950/40 shadow-md';
    }
  };

  const timerType = data.timerType || 'TON';
  const pt = data.presetTimeMs || 3000;

  return (
    <div
      className={`bg-slate-900 border-2 ${getStatusBorder()} text-white rounded-lg p-3 shadow-lg w-52 text-xs transition-all relative overflow-hidden`}
    >
      <div className="font-bold text-cyan-400 mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{data.label || `Temporizador ${timerType}`}</span>
        </span>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono border border-cyan-500/30 font-bold">
          {timerType}
        </span>
      </div>

      <div className="text-slate-400 text-[10px] font-mono mb-2">
        {data.details || 'Zeitfunktion (IEC 61131-3)'}
      </div>

      {/* Preset & Elapsed time */}
      <div className="grid grid-cols-2 gap-1 text-[9px] font-mono bg-slate-950/70 p-1.5 rounded border border-slate-800">
        <div>
          <span className="text-slate-500">PT:</span>{' '}
          <span className="text-cyan-300 font-bold">{pt}ms</span>
        </div>
        <div>
          <span className="text-slate-500">ET:</span>{' '}
          <span className="text-slate-400 font-bold">0ms</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-cyan-400 border border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-cyan-400 border border-slate-900"
      />
    </div>
  );
};

