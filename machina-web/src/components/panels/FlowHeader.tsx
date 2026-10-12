import React from 'react';
import { Bot, Sliders } from 'lucide-react';

interface FlowHeaderProps {
  status: string;
  onDeploy: () => void;
  onRun: () => void;
  onReset: () => void;
  isTaskCardOpen: boolean;
  onToggleTaskCard: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({
  status,
  onDeploy,
  onRun,
  onReset,
  isTaskCardOpen,
  onToggleTaskCard
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex justify-between items-center text-white shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-md">
          MF
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            MachineFlow Orchestrator
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
              v1.0 Industrial
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Orquestrador visual estilo fluxo com TIA Portal & Copilot IA</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          {status}
        </span>

        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
        >
          Limpar
        </button>

        <button
          onClick={onDeploy}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow transition"
        >
          Publicar Rotina
        </button>

        <button
          onClick={onRun}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow transition"
        >
          Executar Ciclo
        </button>

        {/* Botão de Toggle do Painel Lateral / TIA Task Card & IA */}
        <button
          onClick={onToggleTaskCard}
          className={`px-3 py-1.5 rounded text-xs font-semibold shadow transition flex items-center gap-1.5 border ${
            isTaskCardOpen
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-indigo-900/40'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title="Alternar Painel de Function Blocks e Chat IA"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Task Card & IA</span>
        </button>
      </div>
    </header>
  );
};
