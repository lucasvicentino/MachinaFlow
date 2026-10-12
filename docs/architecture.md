# Arquitetura do MachineFlow

O **MachineFlow** é um orquestrador de receitas e rotinas industriais que une uma interface visual estilo canvas (React Flow) com um motor de execução de grafo acíclico dirigido (DAG) e conectividade direta com máquinas via protocolos industriais (Modbus TCP, OPC UA, MQTT).

---

## 1. Visão Geral da Topologia de Pastas

A estrutura adota um modelo **Monorepo com npm workspaces**, garantindo tipagem compartilhada entre frontend e backend sem duplicação de contratos:

```
MachinaFlow/
├── backend/                       # API REST, Engine de Grafo, WebSockets & Drivers Industriais
│   ├── src/
│   │   ├── api/                   # Controladores, validações e rotas HTTP (CRUD, Deploy, Testes)
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   └── routes/
│   │   ├── config/                # Variáveis de ambiente e constantes operacionais
│   │   ├── database/              # Camada de persistência (Fluxos, Histórico de Ciclos)
│   │   │   └── repositories/
│   │   ├── engine/                # Núcleo Orquestrador (DAG, Avaliador Lógico, SafetyGuard)
│   │   │   ├── dag.ts             # Validação topológica e prevenção de ciclos
│   │   │   ├── evaluator.ts       # Avaliação de condições (>, <, ==, faixas)
│   │   │   ├── executor.ts        # Motor de execução sequencial/paralela
│   │   │   └── safetyGuard.ts     # Intertravamentos de segurança e rate limit (NR-12)
│   │   ├── protocols/             # Camada de Conectores Industriais
│   │   │   ├── driver.interface.ts # Interface universal para drivers de campo
│   │   │   ├── modbus/            # Driver Modbus TCP (Holding Registers, Coils, etc.)
│   │   │   ├── opcua/             # Adapter preparado para OPC UA
│   │   │   ├── mqtt/              # Adapter preparado para MQTT Sparkplug
│   │   │   └── protocolFactory.ts # Pool e fábrica de conexões com máquinas
│   │   ├── websocket/             # Servidor WebSocket para telemetria em tempo real
│   │   └── index.ts               # Ponto de entrada do servidor HTTP + WS
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Interface Web Visual (React Flow + Tailwind CSS)
│   ├── src/
│   │   ├── assets/                # Ícones, vetores industriais e estáticos
│   │   ├── components/
│   │   │   ├── canvas/            # Envolucro do React Flow, grid, minimap e controles
│   │   │   ├── nodes/             # Componentes de Nós customizados
│   │   │   │   ├── MachineNode/   # Nó de leitura de CLP (Modbus)
│   │   │   │   ├── ActionNode/    # Nó de ação/escrita em bobina/atuador
│   │   │   │   └── ConditionNode/ # Nó de tomada de decisão lógica
│   │   │   ├── panels/            # Paleta lateral de blocos, header de publicação
│   │   │   └── ui/                # Botões, modais e componentes visuais genéricos
│   │   ├── hooks/                 # Hooks de estado de fluxo e WebSocket
│   │   ├── services/              # Cliente HTTP e WebSocket
│   │   ├── store/                 # Gerenciamento de estado global do canvas
│   │   ├── styles/                # CSS global e diretivas Tailwind
│   │   ├── App.tsx                # Tela principal do estúdio de fluxos
│   │   └── main.tsx               # Ponto de entrada React
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── shared/                        # Contratos de Dados, Tipos TypeScript e Esquemas
│   ├── src/
│   │   ├── constants/             # Enums de protocolos, tipos de registro e estados
│   │   ├── types/                 # Interfaces de Fluxo, Nós, Telemetria e Comandos
│   │   └── index.ts               # Exportação unificada dos tipos
│   ├── package.json
│   └── tsconfig.json
│
├── simulator/                     # Simulador de CLP Modbus TCP para testes sem hardware
│   ├── src/
│   │   ├── modbusServer.ts        # Servidor Modbus TCP com dinâmica térmica simulada
│   │   └── index.ts               # Inicializador do simulador local (porta 5020)
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                        # Orquestração de Containers para Deploy e Demonstração
│   ├── docker-compose.yml         # Sobe Frontend + Backend + Simulador com um comando
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── simulator.Dockerfile
│
├── docs/                          # Documentação e especificações de engenharia
│   └── architecture.md
│
├── .env.example                   # Template de variáveis de ambiente
├── .gitignore                     # Configuração de arquivos ignorados no Git
└── package.json                   # Raiz do projeto com workspaces configurados
```

---

## 2. Fluxo de Dados e Comunicação

```
┌─────────────────────────────────┐
│       Frontend (Porta 5173)     │
│   • Canvas React Flow           │
│   • Paleta de Nós Industriais   │
│   • Visualização de Telemetria  │
└───────┬─────────────────▲───────┘
        │                 │
        │ HTTP Deploy     │ WebSocket (ws/telemetry)
        │ (POST /deploy)  │ Status dos Nós & Leituras
        ▼                 │
┌─────────────────────────┴───────┐
│       Backend (Porta 3001)      │
│   • DagEngine (Validação DAG)   │
│   • WorkflowExecutor (Ciclo)    │
│   • SafetyGuard (NR-12)         │
└───────┬─────────────────────────┘
        │
        │ Modbus TCP (Porta 502 / 5020)
        │ Leitura: Holding Registers / Coils
        │ Escrita: Atuadores / Válvulas
        ▼
┌─────────────────────────────────┐
│     Camada Industrial / CLP     │
│   • Máquina Física (Porta 502)  │
│   • Simulador Mock (Porta 5020) │
└─────────────────────────────────┘
```

---

## 3. Principais Decisões Arquiteturais

1. **Separação por Workspaces (@machineflow/\*):** Permite importar `@machina/shared` tanto no backend quanto no frontend, evitando divergência de contratos JSON.
2. **Camada de Driver Abstrata (`IIndustrialDriver`):** Desacopla o motor de execução do protocolo específico. Novos protocolos (OPC UA, MQTT Sparkplug B, Siemens S7) podem ser adicionados implementando a mesma interface.
3. **Simulador de CLP Integrado:** Resolve o maior desafio de projetos industriais: permitir que recrutadores, desenvolvedores e testes automatizados executem e testem a solução inteira sem necessitar de um CLP físico conectado.
4. **SafetyGuard Integrado:** Garante aderência a normas de segurança industrial (buffer de comandos, taxa máxima de chaveamento e botão de emergência com prioridade de bloqueio).

