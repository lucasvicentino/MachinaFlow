# SPEC TÉCNICA: MCH_001_ANALOG_THRESHOLD

> **Status:** AGUARDANDO_APROVACAO  
> **Data de Criação:** 2026-10-11  
> **Autor/Agente:** Agente de Especificação MachineFlow  
> **Gate Humano de Aprovação:** [ ] Pendente de assinatura do Engenheiro de Automação

---

## 1. Concepção e Objetivo do Negócio
Implementar o bloco visual de **Leitura e Limiar Analógico** para monitorar continuamente sensores de temperatura e pressão industrial, disparando alarmes ou transições no DAG caso a variável de processo ultrapasse faixas críticas de segurança.

---

## 2. Limites de Hardware e Mapeamento de Tags

| Tag Lógica | Tipo Modbus | Endereço Físico | Tipo de Dado | Faixa de Operação | Máquina / CLP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `temp_forno_01` | Holding Register | 40100 (Offset 100) | Int16 (0.1 °C) | 0 a 1200 °C | Forno de Tratamento Térmico |
| `valvula_resfriamento` | Coil | 00010 (Offset 10) | Boolean | true / false | Válvula Solenoide Q0.1 |

---

## 3. Subseção Obrigatória de Ameaça Industrial (Industrial Threat Model)

1. **Timeout e Queda de Conexão:**  
   - Se o CLP não responder em até 1000 ms após 3 tentativas de leitura, o nó transiciona para o estado `FAILED`.
   - O orquestrador entra em modo de falha segura (*fail-safe*), congelando o avanço para a etapa de envase e disparando log de alerta sonoro na IHM web.

2. **Leituras Anômalas e Valores Fora de Faixa (Out-of-Range):**  
   - Se o registrador retornar valores negativos (< 0°C) ou estouro de escala (> 1500°C), o nó trata como sensor desconectado/aberto (PT100 partido).
   - O fluxo é abortado preventivamente antes de acionar a válvula.

3. **Colisão de Comandos e Rate Limiting:**  
   - O acionamento da válvula é protegido pelo `SafetyGuard.assertRateLimit()`, impedindo pulsos repetidos com intervalo menor que 200 ms, prevenindo martelamento pneumático da bobina.

4. **Circuito de Segurança Físico (NR-12):**  
   - A linha de gás e a resistência elétrica do forno possuem contator trifásico cabeado em série com botão de emergência tipo cogumelo e relé de segurança NR-12 Cat 4. O software atua apenas na modulação de controle térmico.

---

## 4. Decomposição de Tarefas por Repositório

### Ticket-01 [machina-core]
- **Arquivos:** `machina-core/src/engine/evaluator.ts`, `machina-core/src/protocols/modbus/modbusDriver.ts`
- **Responsabilidade:** Validação de faixas de threshold analógico (`in_range`, `>`, `<`) e testes unitários via TDD.
- **Definition of Done:** 100% de cobertura nos testes de conversão de temperatura.

### Ticket-02 [machina-web]
- **Arquivos:** `machina-web/src/components/nodes/ConditionNode/ConditionNode.tsx`
- **Responsabilidade:** Exibição do valor ao vivo com indicador colorido (verde dentro da faixa, vermelho fora).
- **Definition of Done:** Atualização em tempo real via evento de WebSocket.

### Ticket-03 [machina-infra]
- **Arquivos:** `machina-infra/simulator/src/modbusServer.ts`
- **Responsabilidade:** Emulação da subida de temperatura no registrador 100 com resfriamento térmico quando coil 10 = true.
- **Definition of Done:** Simulação física realista rodando no container.

