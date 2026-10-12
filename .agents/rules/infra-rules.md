# Infrastructure Agent Rules: machina-infra

> **Repositório Alvo:** `machina-infra/`  
> **Stack:** Docker, Docker Compose, Linux VLANs/iptables, Simuladores Modbus (`modbus-serial` / `diagslave` / `pymodbus`), Edge Gateways.

---

### 1. Diretrizes de Segurança de Redes e Containers

1. **Topologia de Redes em Docker Compose:**
   - Devem existir no mínimo duas redes virtuais configuradas no Docker:
     - `machina-corp-net`: Rede interna para comunicação entre `machina-web` (Nginx) e `machina-core` (API REST/WebSocket).
     - `machina-field-net`: Rede isolada sem gateway para internet externa para comunicação entre `machina-core` e os CLPs/simuladores industriais.
   - O container do `machina-web` NUNCA pode ter acesso direto à `machina-field-net`.

2. **Gerenciamento de Portas:**
   - Em ambiente de produção e edge, as portas `502` (Modbus TCP) e `4840` (OPC UA) NUNCA devem ter mapeamento público (`0.0.0.0:502`). Elas devem ser restritas à sub-rede industrial ou à interface loopback (`127.0.0.1:5020`).
   - Apenas a porta HTTPS da IHM Web e a porta da API reversa devem ser expostas externamente.

3. **Simuladores de CLP para Ambientes de Teste e CI:**
   - O repositório `machina-infra` deve fornecer contêineres de simulação capazes de rodar em pipelines de CI (GitHub Actions) sem necessidade de equipamento físico.
   - O simulador padrão deve emular física de processo realista (ex.: variação térmica, atuadores biestáveis com resposta de sensor fim de curso).

4. **Diretrizes para Edge Gateways (Raspberry Pi / IPC Industrial):**
   - Imagens de container devem ser leves baseadas em Alpine Linux (`node:20-alpine`).
   - Todos os logs em contêineres no edge devem ter rotação ativada (`max-size: 10m`, `max-file: 3`) para evitar desgaste de cartões SD ou memórias eMMC.

