import fs from 'fs';
import path from 'path';
import { FlowDefinition } from '@machina/shared';

export class FlowRepository {
  private static storageDir = path.resolve(process.cwd(), 'data');
  private static flowsFile = path.resolve(FlowRepository.storageDir, 'flows.json');
  private static flows: Map<string, FlowDefinition> = new Map();

  static initialize(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }

    if (fs.existsSync(this.flowsFile)) {
      try {
        const raw = fs.readFileSync(this.flowsFile, 'utf-8');
        const list: FlowDefinition[] = JSON.parse(raw);
        list.forEach((f) => this.flows.set(f.flowId, f));
      } catch (err) {
        console.error('Falha ao carregar banco de dados de fluxos:', err);
      }
    }
  }

  static save(flow: FlowDefinition): void {
    flow.updatedAt = new Date().toISOString();
    if (!flow.createdAt) flow.createdAt = flow.updatedAt;
    this.flows.set(flow.flowId, flow);
    this.persist();
  }

  static findById(flowId: string): FlowDefinition | undefined {
    return this.flows.get(flowId);
  }

  static findAll(): FlowDefinition[] {
    return Array.from(this.flows.values());
  }

  static delete(flowId: string): boolean {
    const deleted = this.flows.delete(flowId);
    if (deleted) this.persist();
    return deleted;
  }

  private static persist(): void {
    try {
      const data = JSON.stringify(Array.from(this.flows.values()), null, 2);
      fs.writeFileSync(this.flowsFile, data, 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar arquivo de fluxos:', err);
    }
  }
}

