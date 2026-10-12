---
name: multi-repo-release
description: Checklist de promoção sincronizada entre os três repositórios, convergência de specs e documentação viva.
---

# Skill: multi-repo-release

## Objetivo
Executar a entrega final e sincronizada de uma funcionalidade entre os repositórios `machina-core`, `machina-web` e `machina-infra`, garantindo compatibilidade semântica (SemVer), validação de portas e transição de documentação viva para o estado convergido.

## Quando Utilizar
- Fase 6 (Deploy Sincronizado) e Fase 7 (Fase Converge) do SDLC Agêntico.
- Pré-requisito para mesclagem de PRs e tags de release.

## Checklist de Promoção Obrigatório

1. **Alinhamento de Versionamento Semântico (SemVer):**
   - Verificar se as versões do `@machina/shared`, `@machina/core` e `@machina/web` estão estritamente compatíveis.
   - Nenhuma propriedade obrigatória de nó pode ser adicionada sem atualização prévia no esquema de validação do core.

2. **Auditoria de Portas e Variáveis de Ambiente:**
   - Confirmar que portas industriais (`502`, `4840`) continuam não expostas externamente no `docker-compose.yml` de produção.
   - Verificar se variáveis `SIMULATOR_HOST`, `SIMULATOR_PORT` e `CORS_ORIGIN` estão parametrizadas sem valores hardcoded.

3. **Fase Converge (Transição de Spec):**
   - Mover a especificação técnica:
     ```bash
     mv docs/Plan/todo/MCH_<NOME>.md docs/Plan/executed/MCH_<NOME>.md
     ```
   - Atualizar o cabeçalho da spec para: `Status: Executado / Em Produção`.

4. **Atualização da Documentação Viva:**
   - Adicionar o novo nó com print/schema em `docs/architecture/node_catalog.md`.
   - Registrar novos endpoints ou eventos de WebSocket em `docs/architecture/api_contracts.md`.

5. **Formatação de Commit com Rastreabilidade:**
   - Commits de release devem seguir a convenção rastreável:
     ```text
     feat(release): deploy v1.1.0 [Spec: docs/Plan/executed/MCH_<NOME>.md]
     ```

