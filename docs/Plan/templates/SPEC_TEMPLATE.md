# SPEC TÉCNICA: MCH_[CODIGO]_[NOME_DA_FUNCIONALIDADE]

> **Status:** [TODO / AGUARDANDO_APROVACAO / EM_EXECUCAO / EXECUTADO]  
> **Data de Criação:** AAAA-MM-DD  
> **Autor/Agente:** [Nome do Agente ou Engenheiro]  
> **Gate Humano de Aprovação:** [ ] Aprovado por [Nome do Engenheiro] em [Data/Hora]

---

## 1. Concepção e Objetivo do Negócio
Breve descrição da necessidade de chão de fábrica e valor operacional gerado.

---

## 2. Limites de Hardware e Mapeamento de Tags

| Tag Lógica | Tipo Modbus | Endereço Físico | Tipo de Dado | Faixa de Operação | Máquina / CLP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sensor_pressao` | Holding Register | 40001 (0x0000) | Float32 (2 words) | 0.0 a 10.0 bar | CLP Linha 01 |
| `valvula_alivio` | Coil | 00010 (0x0009) | Boolean | true / false | CLP Linha 01 |

---

## 3. Subseção Obrigatória de Ameaça Industrial (Industrial Threat Model)

> ⚠️ **ATENÇÃO:** O preenchimento desta subseção é obrigatório pela Constituição Industrial. Nenhuma implementação pode começar sem estas respostas validadas.

1. **Timeout e Queda de Conexão:**  
   *Como o sistema se comporta caso a conexão de rede caia durante uma leitura ou escrita?*  
   [Resposta detalhada aqui]

2. **Leituras Anômalas e Valores Fora de Faixa (Out-of-Range):**  
   *Qual é a ação segura se o sensor indicar valor negativo, zero repentino ou NaN?*  
   [Resposta detalhada aqui]

3. **Colisão de Comandos e Rate Limiting:**  
   *Existe proteção contra múltiplos disparos rápidos (menos de 50 ms) no mesmo registrador?*  
   [Resposta detalhada aqui]

4. **Circuito de Segurança Físico (NR-12):**  
   *Em caso de colapso total do software ou travamento do servidor, qual hardware garante o desligamento seguro?*  
   [Resposta detalhada aqui]

---

## 4. Decomposição de Tarefas por Repositório

### Ticket-01 [machina-core]
- **Arquivos:** `machina-core/src/...`
- **Responsabilidade:** Driver, conversão de registradores e validação no DAG.
- **Definition of Done:** Testes unitários com TDD passando.

### Ticket-02 [machina-web]
- **Arquivos:** `machina-web/src/...`
- **Responsabilidade:** Nó customizado no React Flow, handles de conexão e inspeção.
- **Definition of Done:** Renderização visual e animação de status funcional.

### Ticket-03 [machina-infra]
- **Arquivos:** `machina-infra/...`
- **Responsabilidade:** Configurações de porta no Docker Compose e emulação no simulador.
- **Definition of Done:** E2E passando com alteração refletida na UI.

---

## 5. Critérios de Homologação e Testes E2E
Passos exatos para o teste no navegador com o simulador Docker ativo.

