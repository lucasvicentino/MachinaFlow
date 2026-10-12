---
name: prototype-modbus
description: Prototipagem e teste de estresse isolado de conexões Modbus TCP/RTU contra simuladores.
---

# Skill: prototype-modbus

## Objetivo
Criar e executar scripts de teste rápidos e isolados contra o simulador Modbus Docker para validar a latência, estabilidade de socket e comportamento de timeout antes de alterar o código principal do `machina-core`.

## Quando Utilizar
- Na Fase 3 do SDLC, quando a spec envolver um novo protocolo, CLP desconhecido ou ciclo de amostragem agressivo (<100 ms).
- Para aferir jitter e latência de rede entre o container do orquestrador e o simulador.

## Passos Operacionais do Agente

1. **Subir Ambiente de Simulação:**
   - Garantir que o container do simulador (`machina-infra/simulator`) está em execução na porta 5020 ou via rede interna do Docker.

2. **Criação de Script de Prova de Conceito (PoC):**
   - Criar um script temporário em `machina-infra/simulator/test-client.ts` ou scratchpad:
     - Conectar ao IP e porta do simulador.
     - Realizar 100 operações consecutivas de leitura e escrita.
     - Medir tempos médios, mínimos e máximos de resposta (RTT).
     - Testar injeção de falhas (ex.: tentar ler registrador inexistente e avaliar o erro Modbus Exception Code 02).

3. **Verificação de Métricas:**
   - Taxa de sucesso: deve ser de 100% em rede local.
   - Latência média esperada: < 15 ms por transação.

## Entregável
Relatório de latência e estabilidade registrado na spec técnica antes do fatiamento de tickets.

