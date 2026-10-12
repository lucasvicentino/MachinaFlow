import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Factory, Cpu, Network, Tag } from 'lucide-react';
import { MachineTag } from '@machina/shared';

export interface MachineResourceNodeProps {
  data: {
    label: string;
    code?: string;
    manufacturer?: string;
    model?: string;
    softwareName?: string;
    protocol?: string;
    machineIp?: string;
    port?: number;
    unitId?: number;
    status?: 'ONLINE' | 'OFFLINE' | 'BUSY';
    tags?: MachineTag[];
    connectedNodesCount?: number;
  };
}

export const MachineResourceNode: React.FC<MachineResourceNodeProps> = ({ data }) => {
  const isOnline = (data.status || 'ONLINE') === 'ONLINE';

  return (
    <div className="bg-slate-900 border-2 border-purple-500/80 rounded-xl p-3.5 shadow-2xl shadow-purple-950/50 w-72 text-xs transition-all relative overflow-hidden group hover:border-purple-400">
      {/* Top Industrial Purple Header Stripe (n8n Resource Style) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />

      {/* Machine Header */}
      <div className="flex items-start justify-between gap-2 pt-1 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
              <span>{data.label}</span>
            </div>
            <div className="text-[10px] text-purple-300 font-mono flex items-center gap-1 mt-0.5">
              <span>{data.code || 'M-DEVICE'}</span>
              <span>•</span>
              <span className="text-slate-400">{data.manufacturer || 'Industrial'}</span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-[9px] font-mono shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className={isOnline ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
            {data.status || 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Internal Software Details */}
      <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800/80 mb-2 space-y-1.5 font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1 text-slate-500">
            <Cpu className="w-3 h-3 text-purple-400" />
            Software:
          </span>
          <span className="text-slate-200 font-semibold truncate max-w-[150px]">
            {data.softwareName || 'Firmware Standard'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1 text-slate-500">
            <Network className="w-3 h-3 text-indigo-400" />
            Conexão:
          </span>
          <span className="text-indigo-300 font-bold">
            {data.machineIp || '127.0.0.1'}:{data.port || 7002}
          </span>
        </div>
      </div>

      {/* Internal Tag/Memory Catalog Preview */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
          <span className="flex items-center gap-1 font-semibold text-purple-300">
            <Tag className="w-3 h-3" />
            Mapa de Memória / Tags:
          </span>
          <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-300 font-mono">
            {data.tags?.length || 0} registradores
          </span>
        </div>

        <div className="max-h-20 overflow-y-auto space-y-1 pr-0.5">
          {data.tags && data.tags.length > 0 ? (
            data.tags.slice(0, 3).map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded text-[9px] font-mono border border-slate-800/50"
              >
                <span className="text-slate-300 truncate max-w-[120px]">{tag.name}</span>
                <span className="text-purple-400 font-semibold">
                  {tag.type === 'COIL' ? `Coil ${tag.address}` : `HR ${tag.address}`}
                  {tag.unit ? ` (${tag.unit})` : ''}
                </span>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-500 italic py-1 text-center font-mono">
              Nenhuma tag configurada
            </div>
          )}
        </div>
      </div>

      {/* Resource Port Connection Note */}
      <div className="mt-2.5 pt-1.5 border-t border-purple-500/20 flex items-center justify-between text-[9px] text-purple-300 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
          Recurso de Conexão n8n
        </span>
        <span className="text-slate-400">Arraste para os Blocos ↓</span>
      </div>

      {/* Resource Handle (Bottom output for linking as machine resource to action/trigger blocks) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="machine-resource-out"
        className="w-4 h-4 bg-purple-500 border-2 border-white rounded-full shadow-lg shadow-purple-500/70 hover:scale-125 transition"
      />
    </div>
  );
};
