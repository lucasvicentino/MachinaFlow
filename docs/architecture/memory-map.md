# Documentação Viva: Mapa de Memória e Registradores

Este documento centraliza a convenção de registradores industriais utilizados pelas receitas e pelo simulador padrão do MachineFlow.

---

## 1. Tabela Padrão do Simulador de Processo (Porta 5020)

| Tipo de Registrador | Endereço Modbus | Offset 0-based | Tag / Descrição | Tipo de Dado | Valores / Unidade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Holding Register** | 40101 | 100 | `TEMP_FORNO_01` | Int16 | 0 a 120 °C (Temperatura Atual) |
| **Holding Register** | 40102 | 101 | `SETPOINT_TEMP` | Int16 | 80 °C (Meta Térmica da Receita) |
| **Holding Register** | 40103 | 102 | `PRESSAO_LINHA` | Int16 | 0 a 60 bar (Pressão Hidráulica) |
| **Coil** | 00011 | 10 | `VALVULA_COOLING` | Boolean | `true` = Aberta, `false` = Fechada |
| **Coil** | 00012 | 11 | `ESTEIRA_PRINCIPAL` | Boolean | `true` = Ligada, `false` = Parada |
| **Discrete Input** | 10001 | 0 | `FIM_CURSO_ENVASE` | Boolean | `true` = Garrafa Posicionada |
| **Discrete Input** | 10002 | 1 | `STATUS_EMERGENCIA` | Boolean | `true` = Circuito Seguro OK |

---

## 2. Regras de Conversão e Endianness

- **Holding Registers de 16 bits:** Interpretados como inteiros com sinal (`Int16BE`).
- **Ponto Flutuante (Float32):** Ocupam dois registradores de 16 bits contíguos. O padrão industrial do MachineFlow adota **Big-Endian Word Order**:
  - Palavra Alta (MSW) no registrador de menor endereço (`N`).
  - Palavra Baixa (LSW) no registrador subsequente (`N+1`).

