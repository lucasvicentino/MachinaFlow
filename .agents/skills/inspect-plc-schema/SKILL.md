---
name: inspect-plc-schema
description: Inspeção técnica do mapa de registradores de CLPs e tabelas de memória industrial.
---

# Skill: inspect-plc-schema

## Objetivo
Analisar os mapas de registradores dos CLPs envolvidos na automação para garantir alinhamento exato de endereços, tipos de dados (Float32, Int16, Bit) e ordenação de bytes (endianness).

## Quando Utilizar
- Na Fase 2 do SDLC, após a concepção do escopo e antes da escrita do PRD/Spec.
- Sempre que for necessário conectar um novo CLP, inversor de frequência ou transmissor ao MachineFlow.

## Passos Operacionais do Agente

1. **Consulta aos Documentos de Hardware:**
   - Inspecionar os arquivos em `docs/hardware/` e `docs/architecture/memory-map.md`.
   - Verificar a tabela de registradores do fabricante do CLP:
     - **Coils (0x):** Saídas digitais de acionamento (1 bit).
     - **Discrete Inputs (1x):** Entradas digitais de sensores e chaves fim de curso (1 bit).
     - **Input Registers (3x):** Leituras analógicas de sensores de processo (16 bits).
     - **Holding Registers (4x):** Registradores de configuração, setpoints e valores numéricos (16 bits).

2. **Verificação de Formato de Dados e Endianness:**
   - Conferir se valores em ponto flutuante utilizam padrão IEEE 754 (32 bits / 2 registradores contíguos).
   - Identificar a ordem de palavras (*Big-Endian* vs *Little-Endian Word Swap*).

3. **Mapeamento de Tags Industriais:**
   - Criar a correspondência direta entre a variável do frontend (ex.: `temperatura_tanque_01`) e a coordenada física (ex.: `Holding Register 40001, IP 192.168.1.50:502, UnitId 1`).

## Entregável
Tabela de mapeamento de tags pronta para inclusão na especificação técnica formal em `spec-prd`.

