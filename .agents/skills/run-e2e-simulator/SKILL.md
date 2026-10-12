---
name: run-e2e-simulator
description: Execução de testes ponta a ponta (E2E) integrando navegador (Playwright), motor DAG e simulador Modbus Docker.
---

# Skill: run-e2e-simulator

## Objetivo
Validar o ciclo completo do ecossistema MachineFlow em ambiente simulado: a alteração de um registrador físico/emulado no container Modbus deve propagar via driver -> orquestrador DAG -> WebSocket -> renderização e mudança visual do nó no canvas do React Flow.

## Quando Utilizar
- Fase 5 do SDLC Agêntico (Garantia de Qualidade e Simulação).
- Gate de validação final antes de aprovar uma release.

## Passos Operacionais do Agente

1. **Subir os Três Serviços em Containers:**
   - Garantir a inicialização via `docker compose`:
     - `machina-infra/simulator`: Servidor Modbus TCP (porta 5020).
     - `machina-core`: API REST e WebSocket de telemetria (porta 3001).
     - `machina-web`: Interface visual com React Flow (porta 5173).

2. **Cenário de Teste E2E (Playwright Test Scenario):**
   - Abrir o navegador em `http://localhost:5173`.
   - Carregar o fluxo de teste com um nó de leitura (`machineTrigger` monitorando Holding Register 100) e um nó de atuação (`machineAction` controlando Bobina 10).
   - Injetar no simulador uma alteração forçada de temperatura (ex.: escrever `88` no registrador 100).
   - **Critério de Validação Visual:**
     - O nó do sensor no canvas DEVE mudar de estado de `IDLE` para `RUNNING` (borda amarela pulsante) e depois `SUCCESS` (borda verde).
     - A aresta animada entre os nós deve pulsar indicando propagação do sinal.
     - A bobina 10 do atuador no simulador deve ser acionada para `true`.

3. **Validação de Falha Injetada:**
   - Interromper temporariamente o container do simulador.
   - Disparar o ciclo de execução.
   - O nó DEVE exibir borda vermelha (`FAILED`) e a mensagem de erro de timeout no log de telemetria, sem congelar a interface web.

## Entregável
Relatório de execução de testes E2E com evidências visuais (screenshots/logs) confirmando funcionamento em cadeia.

