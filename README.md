# MachineFlow

Para unir a orquestração de rotinas e receitas de máquinas com uma interface visual em estilo nó/fluxo (como o n8n), a arquitetura precisa separar com clareza o **frontend visual (canvas de nós)**, o **backend orquestrador (API REST/WebSocket)** e a **camada de campo (conectores industriais de máquina)**.

<br>

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (React Flow / Canvas n8n)             │
│   [ Trigger: Início ] ──> [ Condição: Temp > 80°C ] ──> ... │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON de Configuração (DAG)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND ORQUESTRADOR (Node.js)              │
│       API REST (CRUD de Fluxos) + Engine de Execução        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Protocolos Industriais
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               MÁQUINAS / CAMADA DE HARDWARE                 │
│      Modbus TCP (Porta 502) / OPC UA / MQTT / Siemens S7    │
└─────────────────────────────────────────────────────────────┘
```

### 1. Stack Tecnológica Recomendada para o MVP

- **Frontend:** React + **React Flow** (`@xyflow/react`) + Tailwind CSS.

  <br>

  - O React Flow entrega o comportamento nativo de arrastar e soltar nós, conexões dinâmicas com snap e painel minimapa, exatamente como o canvas visual do n8n.

    <br>
- **Backend:** Node.js (TypeScript) ou Python (FastAPI).

  <br>

  - Expondo endpoints REST para salvar/carregar fluxos e WebSockets para telemetria em tempo real.

    <br>
- **Camada de Comunicação com Máquinas:**

  <br>

  - Para o MVP, utilize **Modbus TCP** (biblioteca `jsmodbus` ou `modbus-serial` no Node.js; `pymodbus` no Python). É o protocolo mais aberto e universal da indústria.

    <br>
- **Banco de Dados:** SQLite ou PostgreSQL para salvar receitas, topologia de nós e logs de ciclo.

  <br>

### 2. Especificação do Modelo de Dados (JSON do Fluxo)

Assim como o n8n gera internamente um grafo acíclico dirigido (DAG), sua interface visual manipula nós (*nodes*) e conexões (*edges*):

<br>

JSON

```
{
  "flowId": "receita-envase-01",
  "name": "Ciclo de Esterilização e Envase",
  "nodes": [
    {
      "id": "1",
      "type": "machineTrigger",
      "data": { "machineIp": "192.168.1.50", "register": 100, "triggerValue": 1 },
      "position": { "x": 100, "y": 200 }
    },
    {
      "id": "2",
      "type": "conditionCheck",
      "data": { "field": "temperatura", "operator": ">=", "value": 85 },
      "position": { "x": 350, "y": 200 }
    },
    {
      "id": "3",
      "type": "machineAction",
      "data": { "machineIp": "192.168.1.60", "action": "writeCoil", "address": 10, "value": true },
      "position": { "x": 600, "y": 200 }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e2-3", "source": "2", "target": "3" }
  ]
}
```

### 3. Código do MVP: Canvas Visual em React Flow

Este componente React reproduz a experiência visual do n8n, permitindo adicionar nós de máquina, conectá-los e disparar a execução via API:

<br>

TypeScript

```
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Nó Customizado: Leitura de CLP/Máquina
const MachineNode = ({ data }: any) => (
  <div className="bg-slate-900 border-2 border-indigo-500 text-white rounded-lg p-3 shadow-lg w-52 text-xs">
    <div className="font-bold text-indigo-400 mb-1 flex items-center justify-between">
      <span>⚙️ {data.label}</span>
      <span className="text-[10px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">{data.protocol}</span>
    </div>
    <div className="text-slate-300 text-[11px] mb-2">{data.details}</div>
    <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-indigo-400" />
    <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-indigo-400" />
  </div>
);

// Nó Customizado: Ação / Escrita
const ActionNode = ({ data }: any) => (
  <div className="bg-slate-900 border-2 border-emerald-500 text-white rounded-lg p-3 shadow-lg w-52 text-xs">
    <div className="font-bold text-emerald-400 mb-1 flex items-center justify-between">
      <span>⚡ {data.label}</span>
      <span className="text-[10px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">{data.actionType}</span>
    </div>
    <div className="text-slate-300 text-[11px] mb-2">{data.details}</div>
    <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-emerald-400" />
    <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-emerald-400" />
  </div>
);

const nodeTypes = {
  machine: MachineNode,
  action: ActionNode
};

const initialNodes = [
  {
    id: '1',
    type: 'machine',
    position: { x: 80, y: 150 },
    data: { label: 'Leitura Forno 01', protocol: 'Modbus TCP', details: 'Holding Reg 40001 (Temp)' }
  },
  {
    id: '2',
    type: 'action',
    position: { x: 380, y: 150 },
    data: { label: 'Válvula Esteira', actionType: 'Coil Write', details: 'Ativar Bobina Q0.1' }
  }
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export default function MachineOrchestratorCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [status, setStatus] = useState<string>('Pronto para envio');

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  const handleDeployFlow = async () => {
    setStatus('Gravando rotina no servidor...');
    try {
      const payload = { flowId: 'fluxo-linha-01', nodes, edges };
      const res = await fetch('http://localhost:3001/api/flows/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) setStatus('Fluxo sincronizado com o orquestrador!');
      else setStatus('Falha ao sincronizar.');
    } catch {
      setStatus('Simulação local: fluxo compilado em JSON.');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 font-sans">
      <header className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center text-white">
        <div>
          <h1 className="text-base font-bold text-slate-100">Machine Flow Builder</h1>
          <p className="text-xs text-slate-400">Orquestrador visual estilo nó para máquinas industriais</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{status}</span>
          <button
            onClick={handleDeployFlow}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow"
          >
            Publicar Rotina
          </button>
        </div>
      </header>

      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} className="bg-slate-900 border border-slate-800" />
        </ReactFlow>
      </div>
    </div>
  );
}
```

### 4. Backend Mínimo: Motor de Leitura/Escrita Modbus TCP

Serviço em Node.js com Express para receber o fluxo e executar a comunicação com as máquinas:

<br>

JavaScript

```
// server.js (Node.js + Express + Modbus-Serial)
const express = require('express');
const ModbusRTU = require('modbus-serial');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Rota para salvar e ativar a programação
app.post('/api/flows/deploy', (req, res) => {
  const { flowId, nodes, edges } = req.body;
  console.log(`[Flow Manager] Novo fluxo ativo recebido: ${flowId}`);
  // Aqui você armazena no SQLite/PostgreSQL e instancia o loop de execução
  res.json({ success: true, activeNodes: nodes.length, connections: edges.length });
});

// Endpoint de execução imediata de leitura na máquina (ex: via Modbus TCP)
app.get('/api/machine/read', async (req, res) => {
  const { ip, port = 502, address } = req.query;
  const client = new ModbusRTU();

  try {
    await client.connectTCP(ip, { port: Number(port) });
    client.setID(1);
    const data = await client.readHoldingRegisters(Number(address), 1);
    await client.close();
    res.json({ success: true, value: data.data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log('Orquestrador rodando na porta 3001'));
```

### 5. Boas Práticas para o Ambiente de Servidor

1. **Isolamento de Redes (VLAN):** O servidor deve ter duas interfaces de rede: uma voltada para a rede corporativa/web (onde a UI roda com TLS/HTTPS) e outra na rede industrial restrita (sem acesso à internet pública), impedindo invasões às portas Modbus (502) ou OPC UA (4840).

   <br>
2. **Buffer de Comandos e Heartbeat:** A API nunca deve enviar comandos sequenciais de forma "cega". Antes de disparar a ação do próximo nó, implemente leitura de confirmação (*handshake* com a máquina).

   <br>
3. **Travamento de Segurança:** Instruções críticas de emergência (NR-12) nunca devem depender exclusivamente da rota do software orquestrador; a lógica de parada segura permanece sempre cabeada e programada diretamente no CLP físico de campo.