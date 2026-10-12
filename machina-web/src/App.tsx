import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bot } from 'lucide-react';
import { MachineProfile } from '@machina/shared';

import { nodeTypes } from './components/nodes';
import { FlowHeader } from './components/panels/FlowHeader';
import { NodePalette } from './components/panels/NodePalette';
import { TaskCardPanel } from './components/panels/TaskCardPanel';
import { NewMachineModal } from './components/panels/NewMachineModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:7001';

const FALLBACK_MACHINES: MachineProfile[] = [
  {
    id: 'mach-oven-01',
    name: 'Forno de Esterilização 01',
    code: 'OVEN-01',
    manufacturer: 'Siemens / Despatch',
    model: 'S7-1200 (CPU 1214C)',
    softwareName: 'TIA Portal V17 (Step 7)',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Forno industrial para esterilização contínua com queimador e válvula de purga.',
    tags: [
      {
        id: 'tag-1',
        name: 'Temperatura Forno',
        address: 100,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: '°C',
        description: 'Sensor PT100 câmara interna',
        access: 'RO'
      },
      {
        id: 'tag-2',
        name: 'Setpoint Temperatura',
        address: 101,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: '°C',
        description: 'Limiar configurado no PID',
        access: 'RW'
      },
      {
        id: 'tag-3',
        name: 'Válvula Resfriamento / Purga',
        address: 10,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Válvula solenoide Q0.1',
        access: 'RW'
      },
      {
        id: 'tag-4',
        name: 'Chave Queimador',
        address: 15,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Ignitor elétrico queimador a gás',
        access: 'RW'
      }
    ]
  },
  {
    id: 'mach-filler-01',
    name: 'Envasadora Rotativa Krones',
    code: 'FILL-01',
    manufacturer: 'Krones / Siemens',
    model: 'S7-1500 (CPU 1516F-3 PN/DP)',
    softwareName: 'TIA Portal V18 Safety',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Carrossel rotativo de 24 válvulas volumétricas para envase asséptico.',
    tags: [
      {
        id: 'tag-10',
        name: 'Nível Tanque Envasadora',
        address: 105,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'L',
        description: 'Sensor ultrassônico de nível de produto',
        access: 'RO'
      },
      {
        id: 'tag-11',
        name: 'Vazão Bico Principal',
        address: 106,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'ml/s',
        description: 'Caudalímetro mássico Coriolis',
        access: 'RO'
      },
      {
        id: 'tag-12',
        name: 'Válvula Injeção Bico Envase',
        address: 20,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Cilindro pneumático dosagem',
        access: 'RW'
      },
      {
        id: 'tag-13',
        name: 'Sensor Presença Frasco',
        address: 21,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Sensor óptico barreira de frasco',
        access: 'RO'
      }
    ]
  },
  {
    id: 'mach-conv-01',
    name: 'Esteira de Frascos & Transferência',
    code: 'CONV-01',
    manufacturer: 'Schneider Electric',
    model: 'Modicon M241 (TM241CE24T)',
    softwareName: 'EcoStruxure Machine Expert V2.0',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Esteira modular acionada por inversor de frequência Altivar 320.',
    tags: [
      {
        id: 'tag-20',
        name: 'Velocidade Inversor',
        address: 110,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'Hz',
        description: 'Frequência de acionamento do motor',
        access: 'RW'
      },
      {
        id: 'tag-21',
        name: 'Partida / Parada Esteira',
        address: 25,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Comando Run/Stop inversor',
        access: 'RW'
      },
      {
        id: 'tag-22',
        name: 'Sensor Acúmulo Frascos',
        address: 26,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Fotocélula de fila de saída cheia',
        access: 'RO'
      }
    ]
  },
  {
    id: 'mach-safety-01',
    name: 'Célula de Segurança & Robô Paletizador',
    code: 'SAFE-01',
    manufacturer: 'Siemens / KUKA',
    model: 'S7-1500F (Fail-Safe) + KRC4',
    softwareName: 'TIA Portal Safety Integrated V18',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Perímetro NR-12 com barreiras físicas, cortina de luz e relés de parada segura.',
    tags: [
      {
        id: 'tag-30',
        name: 'Canal Not-Halt Geral',
        address: 30,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Circuito duplo canal botão cogumelo',
        access: 'RO'
      },
      {
        id: 'tag-31',
        name: 'Cortina de Luz Lichtschranke',
        address: 31,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Barreira OSSD zona de risco robô',
        access: 'RO'
      },
      {
        id: 'tag-32',
        name: 'Trava Eletromagnética Porta',
        address: 32,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Schutztür com retenção mecânica',
        access: 'RW'
      },
      {
        id: 'tag-33',
        name: 'Desarme Geral Potência K1/K2',
        address: 0,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Contator principal de alimentação motores',
        access: 'RW'
      }
    ]
  }
];

const initialNodes: Node[] = [
  {
    id: 'res-oven-1',
    type: 'machineResource',
    position: { x: 80, y: 30 },
    data: {
      id: 'mach-oven-01',
      label: 'Forno de Esterilização 01',
      code: 'OVEN-01',
      manufacturer: 'Siemens / Despatch',
      softwareName: 'TIA Portal V17 (Step 7)',
      machineIp: '127.0.0.1',
      port: 7002,
      protocol: 'Modbus TCP',
      status: 'ONLINE',
      tags: FALLBACK_MACHINES[0].tags
    }
  },
  {
    id: '1',
    type: 'machineTrigger',
    position: { x: 80, y: 330 },
    data: {
      label: 'Leitura Forno 01',
      protocol: 'Modbus TCP',
      details: 'Holding Reg 100 (Temp)',
      machineIp: '127.0.0.1',
      port: 7002,
      registerAddress: 100,
      registerType: 'HOLDING_REGISTER',
      register: 100,
      connectedMachineName: 'Forno de Esterilização 01',
      connectedTagName: 'Temperatura Forno (HR 100)'
    }
  },
  {
    id: '2',
    type: 'conditionCheck',
    position: { x: 420, y: 330 },
    data: {
      label: 'Checagem Temperatura',
      field: 'temperatura',
      operator: '>=',
      value: 70
    }
  },
  {
    id: '3',
    type: 'machineAction',
    position: { x: 740, y: 330 },
    data: {
      label: 'Válvula Resfriamento',
      actionType: 'Coil Write',
      action: 'writeCoil',
      details: 'Ativar Bobina Q0.1',
      machineIp: '127.0.0.1',
      port: 7002,
      address: 10,
      value: true,
      connectedMachineName: 'Forno de Esterilização 01',
      connectedTagName: 'Válvula Resfriamento (Coil 10)'
    }
  }
];

const initialEdges: Edge[] = [
  // Resource connection from machine to trigger block (n8n style)
  {
    id: 'res-conn-1',
    source: 'res-oven-1',
    target: '1',
    sourceHandle: 'machine-resource-out',
    targetHandle: 'machine-resource-in',
    animated: true,
    style: { stroke: '#a855f7', strokeWidth: 2.5, strokeDasharray: '5 5' }
  },
  // Routine execution flow
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [status, setStatus] = useState<string>('Pronto para envio');

  // Integrated Machines state
  const [machines, setMachines] = useState<MachineProfile[]>(FALLBACK_MACHINES);
  const [isNewMachineModalOpen, setIsNewMachineModalOpen] = useState(false);

  // Right sidebar state (Task Card & AI Copilot)
  const [isTaskCardOpen, setIsTaskCardOpen] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Fetch machines from backend on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/machine/catalog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.machines?.length > 0) {
          setMachines(data.machines);
        }
      })
      .catch(() => {
        // use fallback machines
      });
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const isResourceConnection =
        params.sourceHandle === 'machine-resource-out' ||
        params.targetHandle === 'machine-resource-in';

      if (isResourceConnection && params.source && params.target) {
        // Find source machine node
        const sourceMachineNode = nodes.find((n) => n.id === params.source);
        if (sourceMachineNode && sourceMachineNode.data) {
          const machData = sourceMachineNode.data as Record<string, any>;
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === params.target) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    connectedMachineId: machData.id || sourceMachineNode.id,
                    connectedMachineName: machData.label || 'Máquina Conectada',
                    machineIp: machData.machineIp || '127.0.0.1',
                    port: machData.port || 7002,
                    protocol: machData.protocol || 'Modbus TCP'
                  }
                };
              }
              return n;
            })
          );
          setStatus(`Recurso "${machData.label}" vinculado ao nó de destino!`);
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: isResourceConnection
              ? { stroke: '#a855f7', strokeWidth: 2.5, strokeDasharray: '5 5' }
              : undefined
          },
          eds
        )
      );
    },
    [nodes, setEdges, setNodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleAddNode = (type: string, data?: Record<string, any>) => {
    const id = `${Date.now()}`;
    const x = 200 + Math.random() * 200;
    const y = 200 + Math.random() * 150;

    let newNode: Node;

    if (type === 'machineTrigger') {
      newNode = {
        id,
        type: 'machineTrigger',
        position: { x, y },
        data: {
          label: `Sensor CLP ${nodes.length + 1}`,
          protocol: 'Modbus TCP',
          machineIp: '127.0.0.1',
          port: 7002,
          registerType: 'HOLDING_REGISTER',
          registerAddress: 100 + nodes.length,
          register: 100 + nodes.length,
          ...data
        }
      };
    } else if (type === 'conditionCheck') {
      newNode = {
        id,
        type: 'conditionCheck',
        position: { x, y },
        data: {
          label: `Condição ${nodes.length + 1}`,
          field: 'temperatura',
          operator: '>',
          value: 80,
          ...data
        }
      };
    } else if (type === 'machineAction') {
      newNode = {
        id,
        type: 'machineAction',
        position: { x, y },
        data: {
          label: `Atuador ${nodes.length + 1}`,
          actionType: 'Coil Write',
          action: 'writeCoil',
          machineIp: '127.0.0.1',
          port: 7002,
          address: 20 + nodes.length,
          value: true,
          ...data
        }
      };
    } else {
      newNode = {
        id,
        type,
        position: { x, y },
        data: data || {
          label: `Bloco ${nodes.length + 1}`,
          details: 'Function Block'
        }
      };
    }

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
  };

  const handleAddBlock = (blockType: string, customData?: Record<string, any>) => {
    const id = `node-${Date.now()}`;
    const x = 250 + Math.random() * 250;
    const y = 180 + Math.random() * 180;

    const newNode: Node = {
      id,
      type: blockType,
      position: { x, y },
      data: customData || {
        label: `Bloco ${nodes.length + 1}`,
        details: 'Function Block'
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setStatus(`Bloco "${customData?.label || blockType}" adicionado ao canvas`);
  };

  const handleAddMachineResourceNode = (machine: MachineProfile) => {
    const id = `resource-${machine.id}-${Date.now().toString().slice(-4)}`;
    const x = 150 + Math.random() * 120;
    const y = 80 + Math.random() * 80;

    const newMachineNode: Node = {
      id,
      type: 'machineResource',
      position: { x, y },
      data: {
        id: machine.id,
        label: machine.name,
        code: machine.code,
        manufacturer: machine.manufacturer,
        model: machine.model,
        softwareName: machine.softwareName,
        protocol: machine.protocol,
        machineIp: machine.host,
        port: machine.port,
        unitId: machine.unitId,
        status: machine.status,
        tags: machine.tags
      }
    };

    setNodes((nds) => [newMachineNode, ...nds]);
    setSelectedNode(newMachineNode);
    setStatus(`Recurso "${machine.name}" inserido no canvas. Ligue-o aos blocos!`);
  };

  const handleSaveMachine = async (newMachine: MachineProfile) => {
    try {
      await fetch(`${API_BASE}/api/machine/catalog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMachine)
      });
    } catch {
      // offline fallback
    }

    setMachines((prev) => [...prev.filter((m) => m.id !== newMachine.id), newMachine]);
    setStatus(`Máquina "${newMachine.name}" integrada com sucesso!`);
  };

  const handleUpdateNodeData = (nodeId: string, newData: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const updated = { ...n, data: { ...n.data, ...newData } };
          setSelectedNode(updated);
          return updated;
        }
        return n;
      })
    );
  };

  const handleApplyAISuggestion = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
    setStatus(`Lógica IA aplicada com sucesso (+${newNodes.length} blocos)!`);
  };

  const handleDeployFlow = async () => {
    setStatus('Gravando rotina no servidor...');
    try {
      // Filter out pure resource nodes if backend only validates execution DAG
      const executionNodes = nodes.filter((n) => n.type !== 'machineResource');
      const executionNodeIds = new Set(executionNodes.map((n) => n.id));
      const executionEdges = edges.filter(
        (e) => executionNodeIds.has(e.source) && executionNodeIds.has(e.target)
      );

      const payload = {
        flowId: 'receita-envase-01',
        name: 'Ciclo de Esterilização e Envase',
        nodes: executionNodes,
        edges: executionEdges
      };
      const res = await fetch(`${API_BASE}/api/flows/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus('Fluxo sincronizado com o orquestrador!');
      } else {
        const data = await res.json();
        setStatus(`Falha: ${data.error || 'Erro de validação'}`);
      }
    } catch {
      setStatus('Simulação local: fluxo compilado em JSON.');
    }
  };

  const handleRunFlow = async () => {
    setStatus('Disparando ciclo de execução...');
    try {
      const res = await fetch(`${API_BASE}/api/flows/receita-envase-01/run`, {
        method: 'POST'
      });
      if (res.ok) {
        setStatus('Ciclo em execução no CLP!');
      } else {
        setStatus('Erro ao iniciar execução.');
      }
    } catch {
      setStatus('Modo offline / sem backend conectado.');
    }
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    setStatus('Fluxo resetado para modelo padrão');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 font-sans">
      <FlowHeader
        status={status}
        onDeploy={handleDeployFlow}
        onRun={handleRunFlow}
        onReset={handleReset}
        isTaskCardOpen={isTaskCardOpen}
        onToggleTaskCard={() => setIsTaskCardOpen((prev) => !prev)}
      />

      <div className="flex-1 w-full h-full flex overflow-hidden relative">
        {/* Left Side: Dual-Tab Palette (Blocos & Máquinas Integradas) */}
        <NodePalette
          onAddNode={handleAddNode}
          machines={machines}
          onOpenNewMachineModal={() => setIsNewMachineModalOpen(true)}
          onAddMachineResourceNode={handleAddMachineResourceNode}
        />

        {/* Center: React Flow Canvas */}
        <main className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#334155" gap={16} />
            <Controls className="bg-slate-900 border border-slate-800 text-white fill-white" />
            <MiniMap
              nodeStrokeWidth={3}
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
              maskColor="rgba(15, 23, 42, 0.7)"
            />
          </ReactFlow>

          {/* Floating trigger on the right edge when drawer is closed */}
          {!isTaskCardOpen && (
            <button
              onClick={() => setIsTaskCardOpen(true)}
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-slate-900/95 hover:bg-slate-800 text-indigo-400 border border-slate-700 hover:border-indigo-500 rounded-l-lg py-3 px-2 shadow-2xl flex flex-col items-center gap-2 transition z-10"
              title="Abrir Task Card (Function Blocks & IA Copilot)"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span
                className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-mono"
                style={{ writingMode: 'vertical-rl' }}
              >
                IA & Blocos
              </span>
            </button>
          )}
        </main>

        {/* Right Side: Siemens TIA Portal Style Task Card & AI Copilot Panel */}
        <TaskCardPanel
          isOpen={isTaskCardOpen}
          onClose={() => setIsTaskCardOpen(false)}
          onAddBlock={handleAddBlock}
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onApplyAISuggestion={handleApplyAISuggestion}
          machines={machines}
        />
      </div>

      {/* Modal para cadastrar nova máquina */}
      <NewMachineModal
        isOpen={isNewMachineModalOpen}
        onClose={() => setIsNewMachineModalOpen(false)}
        onSaveMachine={handleSaveMachine}
      />
    </div>
  );
}
