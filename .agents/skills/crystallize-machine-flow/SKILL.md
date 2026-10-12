---
name: crystallize-machine-flow
description: Concepção de requisitos para novos blocos visuais, fluxos industriais e rotinas de máquinas.
---

# Skill: crystallize-machine-flow

## Objetivo
Capturar a intenção de automação solicitada pelo usuário e cristalizar o escopo exato dos requisitos de máquina, eliminando ambiguidades antes de inspecionar hardware ou gerar código.

## Quando Utilizar
- Ao planejar um novo tipo de nó visual no React Flow (ex.: nó de controle PID, leitura de balança industrial, acionamento pneumático).
- Ao desenhar uma nova receita ou rotina automatizada de chão de fábrica.
- Sempre que houver dúvidas sobre taxas de atualização, tipos de variáveis e tolerâncias de falha.

## Passos Operacionais do Agente

1. **Delimitação de Limites de Hardware:**
   - Identificar quais máquinas, CLPs, sensores ou atuadores físicos participam do fluxo.
   - Determinar se o fluxo é apenas de **Supervisão (Leitura)** ou de **Controle/Atuação (Escrita)**.

2. **Mapeamento de Blocos no React Flow:**
   - Quais nós já existem no catálogo (`docs/architecture/node_catalog.md`) que podem ser reutilizados?
   - Quais nós novos precisam ser criados? Definir cores, ícones e parâmetros de configuração.

3. **Definição de Requisitos Temporais e Amostragem:**
   - Estabelecer a taxa de amostragem admissível (ex.: 100 ms para monitoramento crítico, 1000 ms para dados lentos como temperatura de fornos).
   - Definir o limite máximo aceitável de latência entre a leitura do sensor e a reação do atuador.

4. **Critérios de Sucesso e Métricas:**
   - Zero estouro de buffer de requisições Modbus.
   - Comportamento de fail-safe claro se o CLP não responder dentro de 3 ciclos de amostragem.

## Entregável
Um resumo estruturado contendo:
- Nome da funcionalidade e tag identificadora (`MCH_XXX`).
- Lista de blocos visuais impactados.
- Especificação de portas e protocolos necessários.
- Encaminhamento direto para a skill `inspect-plc-schema`.

