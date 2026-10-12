# Contratos de API REST e Eventos WebSocket

Documentação viva dos endpoints disponibilizados pelo `machina-core` (porta `3001`).

---

## 1. Endpoints REST

### `POST /api/flows/deploy`
Salva, valida topologia DAG e ativa a programação de uma receita.
- **Request Body:**
  ```json
  {
    "flowId": "receita-envase-01",
    "name": "Ciclo de Esterilização e Envase",
    "nodes": [ /* Array de nós React Flow */ ],
    "edges": [ /* Array de conexões */ ]
  }
  ```
- **Responses:**
  - `200 OK`: `{ "success": true, "message": "Fluxo publicado com sucesso", "nodesCount": 3 }`
  - `400 Bad Request`: `{ "success": false, "error": "Ciclo detectado no fluxo!" }`

### `POST /api/flows/:id/run`
Dispara a execução sequencial assíncrona do grafo a partir dos nós raízes.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Execução do fluxo disparada" }`

### `POST /api/flows/:id/stop`
Envia comando de interrupção imediata da rotina.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Comando de parada enviado" }`

### `GET /api/machine/read`
Endpoint de diagnóstico e teste direto de leitura em máquina de campo.
- **Query Params:** `ip`, `port`, `address`, `type` (`HOLDING_REGISTER` / `COIL`), `unitId`.

### `POST /api/machine/write`
Endpoint de diagnóstico e teste direto de escrita em registrador ou bobina.

---

## 2. Eventos WebSocket (`/ws/telemetry`)

### `flow:node_status`
Emitido pelo orquestrador a cada mudança de estado de um nó do grafo.
```json
{
  "type": "flow:node_status",
  "data": {
    "flowId": "receita-envase-01",
    "nodeId": "1",
    "status": "RUNNING",
    "timestamp": "2026-10-11T21:40:00.000Z",
    "durationMs": 42
  }
}
```

### `telemetry:reading`
Emitido quando há leitura periódica de variáveis analógicas de processo.
```json
{
  "type": "telemetry:reading",
  "data": {
    "machineIp": "127.0.0.1",
    "port": 5020,
    "address": 100,
    "registerType": "HOLDING_REGISTER",
    "value": 85.4,
    "timestamp": "2026-10-11T21:40:01.000Z"
  }
}
```

