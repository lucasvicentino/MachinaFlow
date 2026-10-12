# Frontend Agent Rules: machina-web

> **Repositório Alvo:** `machina-web/`  
> **Stack:** React 19 / 18, React Flow (`@xyflow/react`), Tailwind CSS, Lucide Icons, TypeScript.

---

### 1. Princípios de Arquitetura Visual e Canvas

1. **Separação Rígida de Camadas:**
   - `components/canvas/`: Apenas o container do React Flow, minimapa, viewport, controles de zoom e fundo com grade.
   - `components/nodes/`: Cada nó customizado deve possuir sua pasta própria contendo o componente React, tipos específicos de props e estilos visuais.
   - `components/panels/`: Barras laterais, paleta de nós arrastáveis (*NodePalette*), painel de propriedades (*Inspector*) e barra superior de ações (*FlowHeader*).
   - `store/`: Centralização do estado de nós e arestas utilizando hooks reativos e desacoplados.

2. **Regras de Nós do React Flow:**
   - **Handles com Posições Claras:** Entradas sempre à esquerda (`Position.Left`), saídas à direita (`Position.Right`) ou derivações condicionais (Verdadeiro no topo direito, Falso na base direita).
   - **Feedback Visual de Estado (Glow & Borders):**
     - `IDLE`: Borda temática padrão (índigo/azul para trigger, esmeralda para ação, âmbar para condição).
     - `RUNNING`: Borda amarela pulsante (`animate-pulse`) indicando que o registrador está sendo lido/escrito.
     - `SUCCESS`: Borda verde esmeralda com sombra de confirmação.
     - `FAILED`: Borda vermelha de alerta industrial com tooltip descritivo do erro.
   - **Prevenção de Re-render Excessivo:** Usar `React.memo` em nós customizados para manter 60 FPS mesmo em fluxos com centenas de blocos interconectados.

3. **Tipagem e Contratos:**
   - Importar todos os modelos de dados e nós de `@machina/shared`.
   - NUNCA usar `any` para o objeto `data` do nó; tipar explicitamente como `NodeProps<MachineTriggerNodeData>`, etc.

4. **Design Industrial e UX (Dark SCADA Theme):**
   - Paleta de cores escura de alto contraste (`slate-950`, `slate-900`, `slate-800`), simulando IHMs modernas de salas de controle.
   - Fontes monoespaçadas para endereços de registradores, IPs e valores numéricos brutos.
   - Todas as ações críticas (ex.: "Executar em CLP Real", "Desligar Todas as Saídas") exigem modal de confirmação com visual de alerta.

