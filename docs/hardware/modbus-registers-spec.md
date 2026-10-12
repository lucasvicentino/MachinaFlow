# Especificação Técnica de Registradores Modbus

Guia de referência para engenheiros de automação e desenvolvedores que configuram nós do MachineFlow.

---

## 1. Mapeamento de Funções Modbus

| Código de Função | Nome da Função | Área de Memória | Leitura/Escrita | Descrição Típica |
| :--- | :--- | :--- | :--- | :--- |
| `01 (0x01)` | Read Coils | 00001 - 09999 | Leitura | Estado de saídas digitais / relés |
| `02 (0x02)` | Read Discrete Inputs | 10001 - 19999 | Leitura | Entradas digitais de chaves / sensores |
| `03 (0x03)` | Read Holding Registers | 40001 - 49999 | Leitura | Setpoints, parâmetros e medições |
| `04 (0x04)` | Read Input Registers | 30001 - 39999 | Leitura | Sinais analógicos somente-leitura |
| `05 (0x05)` | Write Single Coil | 00001 - 09999 | Escrita | Forçar bobina digital (True/False) |
| `06 (0x06)` | Write Single Register | 40001 - 49999 | Escrita | Gravar 1 palavra de 16 bits |
| `16 (0x10)` | Write Multiple Registers | 40001 - 49999 | Escrita | Gravar blocos ou variáveis Float32 |

---

## 2. Diferença entre Endereço Lógico e Offset Físico

- **Endereçamento 1-Based (Notação de Fabricante):** Registrador `40001`.
- **Endereçamento 0-Based (PDU no Cabo Ethernet):** Endereço transmitido no frame Modbus é `0` (`0x0000`).
- **Conversão Automática no MachineFlow:** O driver `ModbusTcpDriver` aceita o offset 0-based ou a notação canônica, abstraindo o cálculo do desenvolvedor.

