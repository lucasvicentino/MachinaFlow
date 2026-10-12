import React, { useState } from 'react';
import {
  Boxes,
  Factory,
  Plus,
  Cpu,
  ShieldAlert,
  Clock,
  GitMerge,
  Search,
  Network
} from 'lucide-react';
import { MachineProfile } from '@machina/shared';

interface NodePaletteProps {
  onAddNode: (type: string, data?: Record<string, any>) => void;
  machines: MachineProfile[];
  onOpenNewMachineModal: () => void;
  onAddMachineResourceNode: (machine: MachineProfile) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  onAddNode,
  machines,
  onOpenNewMachineModal,
  onAddMachineResourceNode
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'machines'>('machines');
  const [searchMachine, setSearchMachine] = useState('');

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMachine.toLowerCase()) ||
      m.softwareName.toLowerCase().includes(searchMachine.toLowerCase()) ||
      m.code.toLowerCase().includes(searchMachine.toLowerCase())
  );

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/95 flex flex-col shrink-0 text-slate-200 z-10 shadow-lg">
      {/* Tab Switcher: Blocos vs Máquinas */}
      <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950 text-xs shrink-0 font-medium">
        <button
          onClick={() => setActiveTab('machines')}
          className={`py-2.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'machines'
              ? 'border-purple-500 text-purple-400 bg-slate-900 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Factory className="w-3.5 h-3.5 text-purple-400" />
          <span>Máquinas ({machines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`py-2.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'blocks'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-indigo-400" />
          <span>Blocos</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ================= ABA 1: PARQUE DE MÁQUINAS (RECURSOS n8n) ================= */}
        {activeTab === 'machines' && (
          <div className="space-y-3">
            {/* Header com botão de cadastrar máquina */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Parque de Máquinas
              </span>
              <button
                onClick={onOpenNewMachineModal}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold shadow transition flex items-center gap-1"
                title="Cadastrar nova máquina e configurar tags internas"
              >
                <Plus className="w-3 h-3" /> Nova Máquina
              </button>
            </div>

            {/* Busca rápida */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar máquinas..."
                value={searchMachine}
                onChange={(e) => setSearchMachine(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Lista de Máquinas Cadastradas */}
            <div className="space-y-2">
              {filteredMachines.map((mach) => (
                <div
                  key={mach.id}
                  className="bg-slate-950/80 border border-slate-800/90 hover:border-purple-500/60 rounded-lg p-2.5 transition group flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs shrink-0">
                        <Factory className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white group-hover:text-purple-300 leading-tight truncate max-w-[130px]">
                          {mach.name}
                        </div>
                        <div className="text-[9px] text-purple-400 font-mono">
                          {mach.code} • {mach.manufacturer}
                        </div>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      ● ONLINE
                    </span>
                  </div>

                  {/* Detalhes de Software e Endereçamento */}
                  <div className="bg-slate-900/90 rounded p-1.5 text-[9px] font-mono text-slate-400 space-y-0.5 border border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-purple-400" />
                        Software:
                      </span>
                      <span className="text-slate-200 font-bold truncate max-w-[110px]">
                        {mach.softwareName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Network className="w-2.5 h-2.5 text-indigo-400" />
                        Endereço:
                      </span>
                      <span className="text-indigo-300">
                        {mach.host}:{mach.port}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5 border-t border-slate-800/60">
                      <span className="text-slate-500">Tags / Registradores:</span>
                      <span className="text-emerald-400 font-bold">{mach.tags.length} configurados</span>
                    </div>
                  </div>

                  {/* Ação de Inserção no Canvas */}
                  <button
                    onClick={() => onAddMachineResourceNode(mach)}
                    className="w-full py-1.5 px-2 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 hover:border-purple-500 text-purple-300 hover:text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus className="w-3 h-3" /> Inserir Recurso no Canvas
                  </button>
                </div>
              ))}

              {filteredMachines.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs">
                  Nenhuma máquina encontrada.
                </div>
              )}
            </div>

            {/* Dica Conexão estilo n8n */}
            <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-[10px] text-purple-300 font-mono space-y-1">
              <div className="font-bold uppercase text-[9px] text-purple-400 flex items-center gap-1">
                <span>⚡ Conexão de Recurso n8n</span>
              </div>
              <div>1. Insira a máquina no canvas.</div>
              <div>2. Ligue o ponto inferior da máquina no topo de qualquer bloco.</div>
              <div>3. O bloco herdará o IP e a tabela de tags do software do CLP!</div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: PALETA DE BLOCOS ================= */}
        {activeTab === 'blocks' && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Blocos de Controle
            </div>

            <button
              onClick={() => onAddNode('machineTrigger')}
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 rounded-lg text-left transition group"
            >
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 text-xs">⚙️</span>
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300">
                  Leitura CLP
                </div>
                <div className="text-[10px] text-slate-400">Modbus TCP Register</div>
              </div>
            </button>

            <button
              onClick={() => onAddNode('conditionCheck')}
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 rounded-lg text-left transition group"
            >
              <span className="p-1 rounded bg-amber-500/20 text-amber-400 text-xs">🔀</span>
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-amber-300">
                  Condição Lógica
                </div>
                <div className="text-[10px] text-slate-400">Compara limiar / valor</div>
              </div>
            </button>

            <button
              onClick={() => onAddNode('machineAction')}
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500 rounded-lg text-left transition group"
            >
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">⚡</span>
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-emerald-300">
                  Ação / Escrita
                </div>
                <div className="text-[10px] text-slate-400">Aciona Bobina / Válvula</div>
              </div>
            </button>

            <button
              onClick={() =>
                onAddNode('safetyBlock', {
                  label: 'Not-Halt (E-Stop)',
                  subType: 'notHalt',
                  safetyCategory: 'Cat.4 / PLe',
                  details: 'Duplo Canal 24Vdc'
                })
              }
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-500 rounded-lg text-left transition group"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-rose-300">
                  Not-Halt (Segurança)
                </div>
                <div className="text-[10px] text-slate-400">Parada de Emergência NR-12</div>
              </div>
            </button>

            <button
              onClick={() =>
                onAddNode('timerBlock', {
                  label: 'Temporizador TON',
                  timerType: 'TON',
                  presetTimeMs: 3000,
                  details: 'Atraso na Energização'
                })
              }
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500 rounded-lg text-left transition group"
            >
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300">
                  Temporizador TON
                </div>
                <div className="text-[10px] text-slate-400">On-Delay (PT=3s)</div>
              </div>
            </button>

            <button
              onClick={() =>
                onAddNode('logicBlock', {
                  label: 'Porta UND',
                  operator: 'AND',
                  details: 'Verknüpfungsfunktion'
                })
              }
              className="w-full flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 rounded-lg text-left transition group"
            >
              <GitMerge className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300">
                  Lógica UND (AND)
                </div>
                <div className="text-[10px] text-slate-400">E Lógico FBD</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
