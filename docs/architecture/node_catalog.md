# Catálogo de Nós Visuais do MachineFlow

Documentação viva contendo a lista oficial de blocos disponíveis no canvas React Flow.

---

## 1. Nós Disponíveis no MVP

### ⚙️ Leitura de CLP (`machineTrigger`)
- **Propósito:** Lê variáveis analógicas ou digitais de um CLP via Modbus TCP ou simulador.
- **Cor / Borda:** Índigo / Roxo (`border-indigo-500`).
- **Handles:** 
  - `target` (Esquerda): Disparo condicional de entrada.
  - `source` (Direita): Sinal de valor lido com sucesso.
- **Campos de Configuração:**
  - `machineIp`: IP do equipamento (ex.: `127.0.0.1` ou `192.168.1.50`).
  - `port`: Porta do protocolo (padrão: `502` / `5020`).
  - `registerType`: `HOLDING_REGISTER`, `INPUT_REGISTER`, `COIL`, `DISCRETE_INPUT`.
  - `registerAddress`: Endereço numérico do registrador.

---

### 🔀 Condição Lógica (`conditionCheck`)
- **Propósito:** Compara o valor lido contra um limiar ou faixa de operação permitida.
- **Cor / Borda:** Âmbar / Amarelo (`border-amber-500`).
- **Handles:**
  - `target` (Esquerda): Entrada do dado vindo de uma leitura.
  - `source` (Direita): Saída do ramo condicional (Verdadeiro).
- **Campos de Configuração:**
  - `field`: Nome da tag monitorada (ex.: `temperatura`).
  - `operator`: `==`, `!=`, `>`, `>=`, `<`, `<=`, `in_range`.
  - `value`: Valor numérico de corte ou limiar.

---

### ⚡ Ação / Atuação na Máquina (`machineAction`)
- **Propósito:** Dispara escritas em bobinas de relé, contatores ou registradores de setpoint.
- **Cor / Borda:** Verde Esmeralda (`border-emerald-500`).
- **Handles:**
  - `target` (Esquerda): Gatilho de execução.
  - `source` (Direita): Confirmação pós-escrita (*handshake*).
- **Campos de Configuração:**
  - `action`: `writeCoil` (booleano) ou `writeRegister` (numérico).
  - `address`: Endereço da saída física no CLP.
  - `value`: Estado desejado (`true`/`false` ou valor numérico).
  - `handshakeConfirmation`: Booleano para forçar leitura de confirmação pós-escrita.

