---
name: decompose-tickets
description: Fatiamento atômico de especificações técnicas em micro-tarefas confinadas por repositório (máximo 500 linhas).
---

# Skill: decompose-tickets

## Objetivo
Decompor uma especificação técnica aprovada em tickets atômicos, auto-contidos e estritamente confinados a um único repositório, garantindo conformidade com a Constituição (~500 linhas por ticket) para evitar alucinações e conflitos de mesclagem.

## Quando Utilizar
- Fase 3 do SDLC Agêntico, após aprovação humana da spec.
- Antes do despacho para subagentes paralelos na Fase 4.

## Regras de Fatiamento Obrigatórias

1. **Confinamento por Repositório:** Cada ticket pertence a exatamente um repositório (`machina-core`, `machina-web` ou `machina-infra`).
2. **Limite de Tamanho:** Nenhuma tarefa deve planejar adicionar ou alterar mais de ~500 linhas de código (excluindo arquivos de lock).
3. **Ordem de Dependência Lógica:**
   - **Ticket 01 [Core]:** Driver de hardware, lógica de conversão, tipagem compartilhada e endpoints de leitura/escrita.
   - **Ticket 02 [Web]:** Componente visual do nó no React Flow, handles de conexão e integração com o painel de propriedades.
   - **Ticket 03 [Infra]:** Mapeamento de variáveis de ambiente, portas e configuração de simuladores no Docker Compose.

## Estrutura Padrão dos Tickets

Cada ticket gerado no plano deve conter:
- **Identificador:** `TICKET-<NUMERO>-[REPO]` (ex.: `TICKET-01-CORE`).
- **Repositório Alvo:** `machina-core/`, `machina-web/` ou `machina-infra/`.
- **Arquivos a Criar/Modificar:** Lista exata de caminhos de arquivos.
- **Critério de Aceite (Definition of Done):** Condição precisa para considerar o ticket finalizado (ex.: teste unitário passando, nó renderizando sem erro no console).

