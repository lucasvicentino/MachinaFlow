---
name: spec-prd
description: Elaboração formal de especificações técnicas (PRD) com análise de ameaça industrial e portão de aprovação humana.
---

# Skill: spec-prd

## Objetivo
Transformar a concepção e a inspeção de registradores em um documento de especificação técnica formal (PRD), contendo obrigatoriamente a matriz de risco físico e aguardando aprovação explícita antes de qualquer linha de código ser gerada.

## Quando Utilizar
- Ao concluir a Fase 2 do SDLC Agêntico.
- Pré-requisito obrigatório para desbloquear a Fase 3 (Decomposição de Tickets).

## Passos Operacionais do Agente

1. **Criação do Arquivo de Spec:**
   - Criar o documento em `docs/Plan/todo/MCH_<CODIGO>_<NOME>.md` utilizando o template padrão em `docs/Plan/templates/SPEC_TEMPLATE.md`.

2. **Detalhamento de Módulos e Contratos:**
   - Descrever os nós adicionados ao React Flow (`machina-web`).
   - Definir os endpoints e classes do motor de orquestração (`machina-core`).
   - Especificar portas e containers envolvidos (`machina-infra`).

3. **Subseção Obrigatória: Análise de Ameaça Industrial (Industrial Threat Model):**
   - Se o fluxo realiza gravação ou acionamento em atuadores mecânicos, motores, válvulas ou aquecedores, o agente DEVE responder obrigatoriamente às 4 perguntas de segurança:
     1. *O que acontece se o cabo de rede Ethernet for desconectado durante a escrita?*
     2. *Como o sistema reage se a leitura do sensor analógico retornar zero ou valor fora da faixa (Out-of-Range)?*
     3. *Qual o mecanismo que impede a colisão de comandos rápidos (Race Conditions no CLP)?*
     4. *Onde reside a parada física de emergência (NR-12) em caso de travamento do software?*

4. **Portão de Aprovação Humana (Human-in-the-Loop Gate):**
   - O agente NÃO deve prosseguir para a geração de código.
   - Deve apresentar a spec ao Engenheiro de Automação / Desenvolvedor Humano e registrar a assinatura de aprovação:
     ```markdown
     > **Status de Aprovação:** Aprovado por [Nome do Engenheiro] em [Data/Hora]
     ```

## Entregável
Arquivo `docs/Plan/todo/MCH_<CODIGO>_<NOME>.md` completamente preenchido e formalmente aprovado.

