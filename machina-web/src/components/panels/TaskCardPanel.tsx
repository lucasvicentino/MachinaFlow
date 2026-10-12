import React, { useState } from 'react';
import {
  ShieldAlert,
  Cpu,
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Clock,
  GitMerge,
  DoorClosed,
  ScanEye,
  Hand,
  AlertTriangle,
  Zap,
  Search,
  CheckCircle2,
  Sliders,
  Settings,
  Folder,
  FolderOpen,
  Factory
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { MachineProfile } from '@machina/shared';

export interface TaskCardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (blockType: string, customData?: Record<string, any>) => void;
  selectedNode: Node | null;
  onUpdateNodeData?: (nodeId: string, newData: Record<string, any>) => void;
  onApplyAISuggestion?: (newNodes: Node[], newEdges: Edge[]) => void;
  machines?: MachineProfile[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    nodes: Node[];
    edges: Edge[];
  };
}

export const TaskCardPanel: React.FC<TaskCardPanelProps> = ({
  isOpen,
  onClose,
  onAddBlock,
  selectedNode,
  onUpdateNodeData,
  onApplyAISuggestion,
  machines = []
}) => {
  const [activeTab, setActiveTab] = useState<'taskCard' | 'aiChat' | 'nodeInspector'>('taskCard');
  const [searchQuery, setSearchQuery] = useState('');

  // Tree expanded states (Siemens TIA Portal style)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    favorites: true,
    memoryStatus: true,
    monitoring: true,
    logic: true,
    timers: false,
    counters: false,
    outputs: true
  });

  // AI Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '👋 Olá! Sou o **Copilot de Automação Industrial & Segurança (Safety)**.\n\nPosso gerar rotinas completas com **Not-Halt (E-Stop)**, **Schutztür (Portas de Segurança)**, temporizadores **TON** e atuadores Modbus TCP com conformidade **NR-12** e **SIL 3 / PLe**.\n\nComo posso ajudar na programação do seu fluxo?',
      timestamp: 'Agora'
    }
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsTyping(true);

    // AI Response generation tailored to industrial automation
    setTimeout(() => {
      let replyText = '';
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes('not-halt') || lower.includes('emergencia') || lower.includes('emergência') || lower.includes('schutztür') || lower.includes('porta')) {
        replyText = `### 🛡️ Circuito de Segurança NR-12 Gerado

Implementei a arquitetura de **Duplo Canal com Supervisão de Discrepância**:

1. **Not-Halt [1] (Parada de Emergência):** Monitora botões tipo cogumelo em 24Vdc (Canal A e B).
2. **Schutztür [2] (Porta com Bloqueio):** Intertravamento óptico/mecânico de acesso à área envasadora.
3. **UND [3] (E Lógico de Segurança):** Exige que ambos os canais de segurança estejam saudáveis.
4. **Relé de Segurança K1/K2 [4]:** Desativa imediatamente a alimentação dos atuadores de potência se qualquer canal abrir.

**Classificação:** Categoria 4 / Performance Level e (ISO 13849-1), SIL 3 (IEC 62061).`;

        const timestamp = Date.now();
        suggestedAction = {
          label: 'Inserir Circuito de Segurança no Canvas (4 blocos)',
          nodes: [
            {
              id: `node-${timestamp}-1`,
              type: 'safetyBlock',
              position: { x: 80, y: 320 },
              data: {
                label: 'Not-Halt (E-Stop)',
                subType: 'notHalt',
                details: 'Duplo Canal 24Vdc',
                safetyCategory: 'Cat.4 / PLe',
                machineIp: '127.0.0.1',
                port: 7002,
                registerAddress: 10
              }
            },
            {
              id: `node-${timestamp}-2`,
              type: 'safetyBlock',
              position: { x: 80, y: 460 },
              data: {
                label: 'Schutztür (Porta Envasadora)',
                subType: 'schutztuer',
                details: 'Intertravamento Magnético',
                safetyCategory: 'Cat.4 / PLe',
                machineIp: '127.0.0.1',
                port: 7002,
                registerAddress: 11
              }
            },
            {
              id: `node-${timestamp}-3`,
              type: 'logicBlock',
              position: { x: 380, y: 390 },
              data: {
                label: 'Intertravamento UND',
                operator: 'AND',
                details: 'Verknüpfung de Segurança'
              }
            },
            {
              id: `node-${timestamp}-4`,
              type: 'machineAction',
              position: { x: 660, y: 390 },
              data: {
                label: 'Relé de Segurança K1/K2',
                actionType: 'Safety Cut-Off',
                action: 'writeCoil',
                details: 'Corta Tensão de Potência',
                machineIp: '127.0.0.1',
                port: 7002,
                address: 0,
                value: false
              }
            }
          ],
          edges: [
            { id: `e-${timestamp}-1`, source: `node-${timestamp}-1`, target: `node-${timestamp}-3`, animated: true },
            { id: `e-${timestamp}-2`, source: `node-${timestamp}-2`, target: `node-${timestamp}-3`, animated: true },
            { id: `e-${timestamp}-3`, source: `node-${timestamp}-3`, target: `node-${timestamp}-4`, animated: true }
          ]
        };
      } else if (lower.includes('ton') || lower.includes('timer') || lower.includes('temporizador') || lower.includes('purga')) {
        replyText = `### ⏱️ Temporizador TON (Einschaltverzögerung)

Configurei um bloco **TON (Timer On-Delay)** para estabilização de processo:
* **Preset Time (PT):** 3000 ms (3 segundos de purga).
* **Função:** Garante que a válvula de esterilização só feche após a temperatura atingir a faixa requerida por 3 segundos consecutivos.
* **Saída:** Transita para o próximo passo de envase.`;

        const timestamp = Date.now();
        suggestedAction = {
          label: 'Adicionar Temporizador TON ao Fluxo',
          nodes: [
            {
              id: `node-${timestamp}-ton`,
              type: 'timerBlock',
              position: { x: 500, y: 220 },
              data: {
                label: 'Purga Esterilização TON',
                timerType: 'TON',
                presetTimeMs: 3000,
                details: 'Atraso na Energização (PT=3s)'
              }
            }
          ],
          edges: []
        };
      } else if (lower.includes('auditar') || lower.includes('nr-12') || lower.includes('seguranca') || lower.includes('segurança')) {
        replyText = `### 📋 Relatório de Auditoria de Segurança Industrial (NR-12)

Analisando a configuração atual do fluxo:
1. **Canal de Parada Segura:** O fluxo possui comando de atuação Modbus TCP, mas requer confirmação por chave com supervisão de discrepância.
2. **Tempo de Varredura (Cycle Time):** Atualmente em **12ms** (margem de segurança excelente para laços de 50ms).
3. **Recomendação NR-12:** Adicionar bloco **Not-Halt (Botão Cogumelo)** com rearme manual supervisionado (**Reset Node**) antes do disparo de qualquer bobina de aquecimento ou motor.`;
      } else {
        replyText = `### ⚙️ Instrução Industrial Processada

Para a rotina informada (*"${textToSend}"*):
* **Camada de Campo:** Recomendo utilizar mapeamento direto em Holding Registers Modbus (endereços 100-200) com polling de 500ms.
* **Blocos recomendados:** 
  1. *Überwachung:* Sensor com validação de limite.
  2. *Verknüpfung:* Lógica AND/OR com condicional de segurança.
  3. *Schaltausgang:* Escrita em bobina protegida (Coil Write).

Deseja que eu monte este conjunto de blocos diretamente no seu canvas?`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleApplySuggestion = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    if (onApplyAISuggestion) {
      onApplyAISuggestion(action.nodes, action.edges);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col shrink-0 text-slate-200 h-full overflow-hidden shadow-2xl z-20">
      {/* Top Header estilo Siemens TIA Portal */}
      <div className="h-12 border-b border-slate-800 px-3 bg-slate-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Task Card: Function Blocks
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">
                TIA Style
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Safety & AI Engineering</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
          title="Fechar Painel Lateral"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Switcher: TIA Portal Task Card vs IA Copilot vs Inspetor */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900 text-xs shrink-0 font-medium">
        <button
          onClick={() => setActiveTab('taskCard')}
          className={`py-2 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'taskCard'
              ? 'border-indigo-500 text-indigo-400 bg-slate-800/60 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Blocos</span>
        </button>
        <button
          onClick={() => setActiveTab('aiChat')}
          className={`py-2 px-2 flex items-center justify-center gap-1.5 border-b-2 transition relative ${
            activeTab === 'aiChat'
              ? 'border-indigo-500 text-indigo-400 bg-slate-800/60 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>IA Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2.5 right-2.5" />
        </button>
        <button
          onClick={() => setActiveTab('nodeInspector')}
          className={`py-2 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'nodeInspector'
              ? 'border-indigo-500 text-indigo-400 bg-slate-800/60 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Parâmetros</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* ================= TAB 1: TIA PORTAL FUNCTION BLOCKS & SAFETY STATUS ================= */}
        {activeTab === 'taskCard' && (
          <div className="p-3 space-y-3">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar Function Blocks (ex: Not-Halt)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Safety Relay Memory Status (Similar à imagem do TIA Portal) */}
            <div className="border border-slate-800 rounded-lg bg-slate-950/70 p-2.5">
              <button
                onClick={() => toggleSection('memoryStatus')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 pb-1.5 border-b border-slate-800/60"
              >
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Safety Relay Memory Status
                </span>
                {expandedSections.memoryStatus ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {expandedSections.memoryStatus && (
                <div className="pt-2.5 space-y-2.5">
                  {/* Circular Gauges (Logic Memory & Internal Memory) */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex flex-col items-center">
                      {/* SVG Circular Gauge */}
                      <div className="relative w-12 h-12 flex items-center justify-center my-1">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="18"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-slate-800"
                            fill="transparent"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="18"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={113}
                            strokeDashoffset={113 - (113 * 18) / 100}
                            strokeLinecap="round"
                            className="text-emerald-500"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono font-bold text-emerald-400">
                          18%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Logic Memory</div>
                    </div>

                    <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex flex-col items-center">
                      {/* SVG Circular Gauge */}
                      <div className="relative w-12 h-12 flex items-center justify-center my-1">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="18"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-slate-800"
                            fill="transparent"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="18"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={113}
                            strokeDashoffset={113 - (113 * 24) / 100}
                            strokeLinecap="round"
                            className="text-indigo-500"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono font-bold text-indigo-400">
                          24%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Internal Memory</div>
                    </div>
                  </div>

                  {/* Horizontal Bar: Cycle Time / Tempo de Varredura */}
                  <div className="p-2 bg-slate-900 rounded border border-slate-800/80 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Cycle Time (Varredura)
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">12ms (37%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[37%] rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites (Atalhos rápidos) */}
            <div className="border border-slate-800 rounded-lg bg-slate-950/70 p-2.5">
              <button
                onClick={() => toggleSection('favorites')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 pb-1.5 border-b border-slate-800/60"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Favorites (Favoritos Rápidos)
                </span>
                {expandedSections.favorites ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {expandedSections.favorites && (
                <div className="pt-2 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() =>
                      onAddBlock('safetyBlock', {
                        label: 'Not-Halt (E-Stop)',
                        subType: 'notHalt',
                        safetyCategory: 'Cat.4 / PLe',
                        details: 'Duplo Canal 24Vdc'
                      })
                    }
                    className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-500 rounded text-left transition group text-[11px]"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition shrink-0" />
                    <span className="truncate group-hover:text-rose-300">Not-Halt</span>
                  </button>

                  <button
                    onClick={() =>
                      onAddBlock('safetyBlock', {
                        label: 'Schutztür (Porta)',
                        subType: 'schutztuer',
                        safetyCategory: 'Cat.4 / PLe',
                        details: 'Intertravamento Magnético'
                      })
                    }
                    className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 rounded text-left transition group text-[11px]"
                  >
                    <DoorClosed className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition shrink-0" />
                    <span className="truncate group-hover:text-amber-300">Schutztür</span>
                  </button>

                  <button
                    onClick={() =>
                      onAddBlock('timerBlock', {
                        label: 'TON Purga 3s',
                        timerType: 'TON',
                        presetTimeMs: 3000,
                        details: 'Temporizador On-Delay'
                      })
                    }
                    className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500 rounded text-left transition group text-[11px]"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                    <span className="truncate group-hover:text-cyan-300">TON (3s)</span>
                  </button>

                  <button
                    onClick={() =>
                      onAddBlock('logicBlock', {
                        label: 'Porta UND',
                        operator: 'AND',
                        details: 'Lógica E de Segurança'
                      })
                    }
                    className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 rounded text-left transition group text-[11px]"
                  >
                    <GitMerge className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition shrink-0" />
                    <span className="truncate group-hover:text-indigo-300">UND (AND)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tree View de Function Blocks (Idêntico ao TIA Portal da imagem) */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 py-0.5">
                Function Blocks Library (IEC 61131-3)
              </div>

              {/* 1. Überwachungsfunktionen (Funções de Monitoramento de Segurança) */}
              <div className="border border-slate-800/80 rounded bg-slate-950/40 overflow-hidden">
                <button
                  onClick={() => toggleSection('monitoring')}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-800/40 text-left font-medium text-slate-200"
                >
                  <span className="flex items-center gap-1.5 text-amber-300">
                    {expandedSections.monitoring ? (
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Überwachungsfunktionen (Segurança)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">5</span>
                </button>

                {expandedSections.monitoring && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-900/40 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center justify-between py-1 group">
                      <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-300">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        Not-Halt (Emergency Stop)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('safetyBlock', {
                            label: 'Not-Halt (E-Stop)',
                            subType: 'notHalt',
                            safetyCategory: 'Cat.4 / PLe',
                            details: 'Duplo Canal 24Vdc'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-300">
                        <DoorClosed className="w-3 h-3 text-amber-400" />
                        Schutztür (Safety Gate)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('safetyBlock', {
                            label: 'Schutztür (Porta)',
                            subType: 'schutztuer',
                            safetyCategory: 'Cat.4 / PLe',
                            details: 'Intertravamento Magnético'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-300">
                        <ScanEye className="w-3 h-3 text-amber-400" />
                        Lichtschranke (Light Curtain)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('safetyBlock', {
                            label: 'Lichtschranke (Cortina)',
                            subType: 'lichtschranke',
                            safetyCategory: 'Cat.4 / Tipo 4',
                            details: 'Detecção OSSD'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-300">
                        <Hand className="w-3 h-3 text-amber-400" />
                        Zweihandbedienung (Bimanual)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('safetyBlock', {
                            label: 'Zweihand (Bimanual)',
                            subType: 'zweihand',
                            safetyCategory: 'Tipo IIIC',
                            details: 'Sincronismo ≤500ms'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Muting (Bypass Seguro)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('safetyBlock', {
                            label: 'Muting Sensor',
                            subType: 'muting',
                            safetyCategory: 'SIL 2',
                            details: 'Passagem de Pallet'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Verknüpfungsfunktionen (Funções Lógicas) */}
              <div className="border border-slate-800/80 rounded bg-slate-950/40 overflow-hidden">
                <button
                  onClick={() => toggleSection('logic')}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-800/40 text-left font-medium text-slate-200"
                >
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    {expandedSections.logic ? (
                      <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>Verknüpfungsfunktionen (Lógica)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">4</span>
                </button>

                {expandedSections.logic && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-900/40 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-indigo-300 font-mono">
                        UND (E Lógico)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('logicBlock', {
                            label: 'Porta UND',
                            operator: 'AND',
                            details: 'Lógica E FBD'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-indigo-300 font-mono">
                        ODER (OU Lógico)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('logicBlock', {
                            label: 'Porta ODER',
                            operator: 'OR',
                            details: 'Lógica OU FBD'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-indigo-300 font-mono">
                        XODER (XOR)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('logicBlock', {
                            label: 'Porta XODER',
                            operator: 'XOR',
                            details: 'Ou Exclusivo'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-indigo-300 font-mono">
                        Flip-Flop (RS)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('logicBlock', {
                            label: 'Flip-Flop RS',
                            operator: 'RS',
                            details: 'Memória Bistável'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Zeitfunktionen (Temporizadores) */}
              <div className="border border-slate-800/80 rounded bg-slate-950/40 overflow-hidden">
                <button
                  onClick={() => toggleSection('timers')}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-800/40 text-left font-medium text-slate-200"
                >
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    {expandedSections.timers ? (
                      <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>Zeitfunktionen (Temporizadores)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">3</span>
                </button>

                {expandedSections.timers && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-900/40 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-cyan-300 font-mono">
                        TON (On-Delay)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('timerBlock', {
                            label: 'Timer TON',
                            timerType: 'TON',
                            presetTimeMs: 2500,
                            details: 'Atraso na Energização'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-cyan-300 font-mono">
                        TOF (Off-Delay)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('timerBlock', {
                            label: 'Timer TOF',
                            timerType: 'TOF',
                            presetTimeMs: 2000,
                            details: 'Atraso no Desligamento'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-cyan-300 font-mono">
                        TP (Impuls)
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('timerBlock', {
                            label: 'Timer TP',
                            timerType: 'TP',
                            presetTimeMs: 1000,
                            details: 'Gerador de Pulso Fixo'
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Schaltausgang (Saídas e Atuadores) */}
              <div className="border border-slate-800/80 rounded bg-slate-950/40 overflow-hidden">
                <button
                  onClick={() => toggleSection('outputs')}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-800/40 text-left font-medium text-slate-200"
                >
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    {expandedSections.outputs ? (
                      <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>Schaltausgang (Saídas / Atuadores)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">3</span>
                </button>

                {expandedSections.outputs && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-900/40 border-t border-slate-800/60 text-[11px]">
                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-emerald-300 font-mono">
                        Schaltausgang Q0.1
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('machineAction', {
                            label: 'Saída Q0.1 (OSSD)',
                            actionType: 'Safety Output',
                            action: 'writeCoil',
                            details: 'Atuador 24Vdc OSSD',
                            machineIp: '127.0.0.1',
                            port: 7002,
                            address: 10,
                            value: true
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 group">
                      <span className="text-slate-300 group-hover:text-emerald-300 font-mono">
                        Relé de Força K1/K2
                      </span>
                      <button
                        onClick={() =>
                          onAddBlock('machineAction', {
                            label: 'Contator K1/K2',
                            actionType: 'EDM Contactor',
                            action: 'writeCoil',
                            details: 'Desarme com Feedback',
                            machineIp: '127.0.0.1',
                            port: 7002,
                            address: 12,
                            value: true
                          })
                        }
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 rounded text-[10px] text-slate-300 hover:text-white transition flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: AI INDUSTRIAL COPILOT CHAT ================= */}
        {activeTab === 'aiChat' && (
          <div className="flex flex-col h-full p-3 space-y-3">
            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Comandos de Engenharia IA:
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() =>
                    handleSendMessage('Criar circuito de segurança com Not-Halt e Schutztür intertravados')
                  }
                  className="px-2 py-1 bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500 rounded text-[10px] text-slate-300 transition text-left"
                >
                  🛑 Not-Halt + Schutztür
                </button>
                <button
                  onClick={() =>
                    handleSendMessage('Adicionar temporizador TON de purga de 3 segundos antes do envase')
                  }
                  className="px-2 py-1 bg-slate-800 hover:bg-cyan-600/30 border border-slate-700 hover:border-cyan-500 rounded text-[10px] text-slate-300 transition text-left"
                >
                  ⏱️ TON Purga 3s
                </button>
                <button
                  onClick={() =>
                    handleSendMessage('Auditar conformidade NR-12 e redundância Cat. 4 do fluxo atual')
                  }
                  className="px-2 py-1 bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 rounded text-[10px] text-slate-300 transition text-left"
                >
                  🛡️ Auditoria NR-12
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                    {msg.sender === 'ai' ? (
                      <>
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold text-indigo-300">Safety Copilot IA</span>
                      </>
                    ) : (
                      <span className="font-semibold text-slate-300">Você</span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-lg max-w-[95%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                    {/* Interactive Action Button (Aplicar ao Canvas) */}
                    {msg.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5">
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Lógica FBD compilada pronta para injeção:
                        </div>
                        <button
                          onClick={() => handleApplySuggestion(msg.suggestedAction!)}
                          className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {msg.suggestedAction.label}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 w-fit">
                  <Bot className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Safety Copilot analisando lógica industrial...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="pt-2 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Pergunte à IA ou peça uma lógica de nós..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-md transition shadow"
                  title="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 3: NODE INSPECTOR ================= */}
        {activeTab === 'nodeInspector' && (
          <div className="p-3 space-y-3">
            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200">Nó #{selectedNode.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                      {selectedNode.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Posição: X={Math.round(selectedNode.position.x)}, Y={Math.round(selectedNode.position.y)}
                  </div>
                </div>

                {/* Form fields for the node */}
                {(() => {
                  const nodeData = (selectedNode.data || {}) as Record<string, any>;
                  return (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          Rótulo / Identificador (Tag):
                        </label>
                        <input
                          type="text"
                          value={String(nodeData.label || '')}
                          onChange={(e) =>
                            onUpdateNodeData &&
                            onUpdateNodeData(selectedNode.id, { label: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      {/* Machine Resource Connection (n8n Style) */}
                      <div className="p-2 rounded bg-purple-950/40 border border-purple-500/30 space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-purple-300 block mb-1 flex items-center gap-1 uppercase tracking-wider">
                            <Factory className="w-3 h-3 text-purple-400" />
                            Máquina Vinculada (Recurso n8n):
                          </label>
                          <select
                            value={nodeData.connectedMachineId || ''}
                            onChange={(e) => {
                              const selectedM = machines?.find((m) => m.id === e.target.value);
                              if (selectedM) {
                                onUpdateNodeData &&
                                  onUpdateNodeData(selectedNode.id, {
                                    connectedMachineId: selectedM.id,
                                    connectedMachineName: selectedM.name,
                                    machineIp: selectedM.host,
                                    port: selectedM.port,
                                    protocol: selectedM.protocol
                                  });
                              } else {
                                onUpdateNodeData &&
                                  onUpdateNodeData(selectedNode.id, {
                                    connectedMachineId: undefined,
                                    connectedMachineName: undefined
                                  });
                              }
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                          >
                            <option value="">Nenhuma máquina vinculada</option>
                            {machines?.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.softwareName})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Internal Tag Dropdown from Selected Machine */}
                        {(() => {
                          const connectedMachine = machines?.find(
                            (m) => m.id === nodeData.connectedMachineId
                          );
                          if (!connectedMachine || connectedMachine.tags.length === 0) return null;
                          return (
                            <div>
                              <label className="text-[10px] font-bold text-emerald-400 block mb-1">
                                Tag Interna do Software do CLP:
                              </label>
                              <select
                                onChange={(e) => {
                                  const tag = connectedMachine.tags.find(
                                    (t) => t.id === e.target.value
                                  );
                                  if (tag) {
                                    onUpdateNodeData &&
                                      onUpdateNodeData(selectedNode.id, {
                                        connectedTagName: `${tag.name} (${
                                          tag.type === 'COIL' ? 'Coil ' : 'HR '
                                        }${tag.address})`,
                                        address: tag.address,
                                        register: tag.address,
                                        registerAddress: tag.address,
                                        registerType: tag.type
                                      });
                                  }
                                }}
                                className="w-full bg-slate-900 border border-emerald-500/40 rounded px-2 py-1 text-[11px] text-emerald-300 font-mono focus:outline-none"
                              >
                                <option value="">Escolher da tabela da máquina...</option>
                                {connectedMachine.tags.map((tag) => (
                                  <option key={tag.id} value={tag.id}>
                                    {tag.name} • {tag.type === 'COIL' ? `Coil ${tag.address}` : `HR ${tag.address}`}{' '}
                                    {tag.unit ? `(${tag.unit})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })()}
                      </div>

                      {nodeData.machineIp !== undefined && (
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">
                            IP da Máquina / CLP:
                          </label>
                          <input
                            type="text"
                            value={String(nodeData.machineIp || '127.0.0.1')}
                            onChange={(e) =>
                              onUpdateNodeData &&
                              onUpdateNodeData(selectedNode.id, { machineIp: e.target.value })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {nodeData.port !== undefined && (
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">
                            Porta de Comunicação:
                          </label>
                          <input
                            type="number"
                            value={Number(nodeData.port || 7002)}
                            onChange={(e) =>
                              onUpdateNodeData &&
                              onUpdateNodeData(selectedNode.id, { port: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {nodeData.register !== undefined && (
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">
                            Holding Register (Modbus):
                          </label>
                          <input
                            type="number"
                            value={Number(nodeData.register || 100)}
                            onChange={(e) =>
                              onUpdateNodeData &&
                              onUpdateNodeData(selectedNode.id, { register: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {nodeData.address !== undefined && (
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">
                            Endereço da Bobina / Coil:
                          </label>
                          <input
                            type="number"
                            value={Number(nodeData.address || 10)}
                            onChange={(e) =>
                              onUpdateNodeData &&
                              onUpdateNodeData(selectedNode.id, { address: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {nodeData.value !== undefined && (
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">
                            Valor Limiar / Operação:
                          </label>
                          <input
                            type="text"
                            value={String(nodeData.value ?? '')}
                            onChange={(e) =>
                              onUpdateNodeData &&
                              onUpdateNodeData(selectedNode.id, {
                                value: isNaN(Number(e.target.value))
                                  ? e.target.value
                                  : Number(e.target.value)
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setActiveTab('aiChat');
                            handleSendMessage(
                              `Como otimizar e auditar a segurança do nó "${nodeData.label}" (${selectedNode.type})?`
                            );
                          }}
                          className="w-full py-2 px-3 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 rounded text-indigo-300 hover:text-white font-medium transition flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          Consultar IA sobre este Nó
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <Sliders className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-xs font-medium text-slate-400">Nenhum nó selecionado</div>
                <div className="text-[11px]">
                  Clique em qualquer bloco no canvas para inspecionar seus registradores e parâmetros.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
