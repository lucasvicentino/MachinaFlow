---
name: tdd-industrial
description: Metodologia estrita de TDD para decodificação de protocolos industriais e conversão binária de registradores.
---

# Skill: tdd-industrial

## Objetivo
Garantir que toda conversão binária, decodificação de registradores e lógica de acionamento industrial possua testes unitários automatizados escritos **antes** da implementação (Red-Green-Refactor).

## Por que é Crítico na Automação Industrial
Um erro de sinal (*signed* vs *unsigned*), um deslocamento de 1 bit (*endianness*) ou a troca de palavras alta e baixa de um registrador Float32 podem transformar uma leitura de temperatura real de 85.0°C em 18320.0°C ou NaN, provocando desarme indevido ou superaquecimento catastrófico de fornos e caldeiras.

## Passos Operacionais do Agente

1. **Fase Vermelha (Red - Teste Primeiro):**
   - Criar arquivo de teste em `machina-core/tests/` (ex.: `tests/protocols/float32Decoder.test.ts`).
   - Escrever casos de teste com vetores reais de registradores conhecidos:
     - Exemplo: dois registradores `[0x42A8, 0x0000]` devem decodificar com precisão para `84.0` (Float32 IEEE 754 Big-Endian).
     - Exemplo: tratamento de valores negativos (complemento de dois em Int16).
     - Exemplo: detecção de overflow e registradores inválidos.
   - Executar os testes e confirmar que falham (Red).

2. **Fase Verde (Green - Implementação Mínima):**
   - Implementar a função de decodificação ou driver em `machina-core/src/protocols/`.
   - Executar os testes novamente até que 100% passem com sucesso (Green).

3. **Fase de Refatoração (Refactor & Safety):**
   - Otimizar o código mantendo os testes passando.
   - Adicionar asserções de segurança (ex.: checagem de array vazio, verificação de tamanho de buffer).

## Entregável
Suíte de testes unitários passando com cobertura completa das rotinas de conversão de registradores.

