# Backend Agent Rules: machina-core

> **Repositório Alvo:** `machina-core/`  
> **Stack:** Node.js (TypeScript), Express, ModbusRTU (`modbus-serial`), WebSocket (`ws`), Jest.

---

### 1. Princípios do Motor de Execução (DAG Engine)

1. **Validação Estrita de Grafos Acíclicos:**
   - Antes de qualquer deploy ou execução, o `DagEngine` deve rodar o algoritmo de detecção de ciclos baseado em DFS/busca em profundidade. Se houver dependência circular, a requisição DEVE ser rejeitada com código HTTP 400.
   - Nós órfãos ou desconexos devem emitir alertas nos logs de validação.

2. **Isolamento de Conectividade Industrial:**
   - Toda comunicação com hardware de campo deve passar estritamente pela abstração `IIndustrialDriver`.
   - O orquestrador nunca deve instanciar diretamente sockets brutos ou bibliotecas de protocolo dentro dos controladores da API REST.
   - Conexões com máquinas devem ser mantidas em pool gerenciado pela `ProtocolFactory`, com reconexão automática e timeouts configuráveis.

3. **Tratamento de Exceções de Socket e Timeout:**
   - Redes de chão de fábrica apresentam ruído eletromagnético e perda de pacotes periódica.
   - O código deve encapsular chamadas de leitura/escrita em blocos com retry exponencial controlado (máximo de 3 tentativas por nó).
   - Se um CLP parar de responder (*timeout* de 3000 ms), a execução daquele nó falha graciosamente, emitindo evento WebSocket de erro e suspendendo nós dependentes.

4. **SafetyGuard e Intertravamento (NR-12):**
   - Antes de disparar qualquer escrita em atuador, invocar `SafetyGuard.assertRateLimit()` e verificar se a parada de emergência do sistema não está acionada.
   - Em caso de parada de emergência, todo o fluxo é abortado e todos os nós entram no estado `SKIPPED` ou `FAILED`.

5. **Telemetria WebSocket em Tempo Real:**
   - O servidor deve emitir eventos a cada mudança de estado de nó (`RUNNING`, `SUCCESS`, `FAILED`, `SKIPPED`).
   - O payload do evento deve conter `flowId`, `nodeId`, `status`, `durationMs` e dados gerados.

