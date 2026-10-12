# CONSTITUTION INDUSTRIAL (REGRAS INEGOCIÁVEIS)
## MachinaFlow / FlowForge Operational Constitution

> **Status:** Ativo e Obrigatório  
> **Escopo:** Aplicável a todos os agentes de IA, subagentes e desenvolvedores humanos em todos os repositórios (`machina-web`, `machina-core`, `machina-infra`).

---

### Princípio 0: Primazia da Integridade Física e Humana

O software MachineFlow interage com maquinário pesado, motores, aquecedores, esteiras e atuadores pneumáticos/hidráulicos. Erros de código podem causar acidentes físicos no chão de fábrica, queima de equipamentos ou parada de linha de produção.

---

### Artigo 1: Segurança Física em Primeiro Lugar (NR-12 / Fail-Safe)

1.1. **Intertravamento Físico Soberano:** Nenhuma linha de software ou rota de controle pode, sob qualquer pretexto, tentar contornar, desabilitar ou sobrepor circuitos físicos de Parada de Emergência (E-Stop / Chaves de Segurança NR-12).
1.2. **Comportamento Fail-Safe Neutro:** Caso o backend, o serviço WebSocket, a rede Ethernet ou o driver de campo percam comunicação por mais tempo que o timeout configurado (padrão: 1000 ms), o sistema DEVE assumir imediatamente o estado neutro/seguro:
   - Desenergizar saídas de atuação crítica;
   - Notificar IHM e operadores visuais;
   - Registrar log de falha de comunicação com timestamp de alta precisão.
1.3. **Travamento Seguro no Hardware:** A lógica de parada de emergência prioritária DEVE residir no firmware/ladder do CLP local físico, e o software orquestrador atua estritamente como supervisor e coordenador de receitas.

---

### Artigo 2: Isolamento de Redes Zero-Trust (Segregação OT/IT)

2.1. **Proibição de Exposição Pública:** O agente NUNCA deve configurar portas de protocolos industriais em interfaces públicas ou voltadas para a internet:
   - Modbus TCP: Porta `502`
   - OPC UA: Porta `4840`
   - Siemens S7comm: Porta `102`
   - EtherNet/IP: Portas `44818` / `2222`
2.2. **Dual-Homed Network / VLANs:** O ambiente operacional deve utilizar arquitetura de duas placas de rede ou VLANs segregadas:
   - **VLAN Corporativa / IHM (IT):** Apenas tráfego HTTPS/TLS e WSS para a interface do operador (`machina-web`).
   - **VLAN Industrial de Campo (OT):** Comunicação Modbus/OPC UA direta entre `machina-core` e os CLPs/sensores, isolada de roteamento com a internet externa.

---

### Artigo 3: Escrita Idempotente e Handshake Obrigatório

3.1. **Read-After-Write Verification:** Nenhuma escrita em bobinas (*coils*) ou registradores de retenção (*holding registers*) é considerada concluída sem verificação de leitura subsequente (*handshake* com a máquina).
3.2. **Anti-Flooding Rate Limiting:** O driver de comunicação deve impor uma taxa mínima de intervalo entre comandos para um mesmo endereço IP (mínimo de 50 ms por requisição) para impedir saturação da pilha TCP/IP do CLP.
3.3. **Buffer Confinado:** Comandos sequenciais nunca devem ser disparados em rajadas cegas; cada transição de nó do DAG requer confirmação de estado da etapa anterior.

---

### Artigo 4: Controle de Contexto Estrito (~500 Linhas por Ticket)

4.1. **Micro-Tarefas Atômicas:** Nenhum agente deve tentar refatorar ou implementar alterações que excedam aproximadamente 500 linhas de código por ticket/PR.
4.2. **Confinamento Modular:** Um agente alocado em `machina-web` não deve modificar arquivos em `machina-core` no mesmo passo de execução, prevenindo quebra de contratos e regressões silenciosas.
4.3. **Mitigação de Alucinação:** Prompts e tarefas devem conter esquemas de registradores explícitos e contratos de tipos definidos antes da codificação.

---

### Artigo 5: Documentação Viva em Repositório

5.1. **Sem Código Sem Spec:** Nenhum commit é mesclado sem que a respectiva especificação exista em `docs/Plan/todo/` ou tenha sido promovida para `docs/Plan/executed/`.
5.2. **Rastreabilidade Obrigatória de Commits:** Commits que implementam fluxos de máquina devem referenciar a spec:
   ```text
   feat(core): add thermocouple read driver [Spec: docs/Plan/executed/MCH_001_FORNO.md]
   ```
5.3. **Atualização Atômica de Contratos:** Qualquer alteração no payload de um nó no core obriga a atualização imediata em `docs/architecture/node_catalog.md` e nos tipos do `@machina/shared`.

---

### Artigo 6: Gate Humano Obrigatório para Risco de Campo

6.1. Quando uma rotina envolver gravação física em atuadores mecânicos, esteiras, dosadores de produtos químicos ou fontes térmicas, o agente DEVE pausar e exigir confirmação explícita de um Engenheiro de Automação / Desenvolvedor Humano antes de executar a rotina em hardware de produção.

