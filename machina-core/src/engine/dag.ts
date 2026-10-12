import { FlowDefinition, FlowNode } from '@machina/shared';

export class DagEngine {
  /**
   * Validates if the flow is a Directed Acyclic Graph (DAG) without circular dependencies.
   */
  static validate(flow: FlowDefinition): { isValid: boolean; error?: string } {
    const adjList = new Map<string, string[]>();
    const nodeIds = new Set(flow.nodes.map((n) => n.id));

    flow.nodes.forEach((node) => adjList.set(node.id, []));

    for (const edge of flow.edges) {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        return { isValid: false, error: `Aresta inválida referenciando nó inexistente: ${edge.id}` };
      }
      adjList.get(edge.source)?.push(edge.target);
    }

    // Cycle detection via DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of flow.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          return { isValid: false, error: 'Ciclo detectado no fluxo! O grafo deve ser acíclico (DAG).' };
        }
      }
    }

    return { isValid: true };
  }

  /**
   * Finds initial trigger / root nodes (in-degree = 0)
   */
  static getRootNodes(flow: FlowDefinition): FlowNode[] {
    const targetNodes = new Set(flow.edges.map((e) => e.target));
    return flow.nodes.filter((node) => !targetNodes.has(node.id));
  }

  /**
   * Returns child nodes connected to a given node
   */
  static getNextNodes(flow: FlowDefinition, currentNodeId: string): FlowNode[] {
    const targetIds = flow.edges
      .filter((e) => e.source === currentNodeId)
      .map((e) => e.target);
    return flow.nodes.filter((n) => targetIds.includes(n.id));
  }
}

