import fs from 'fs';
import path from 'path';
import { MachineProfile } from '@machina/shared';

const DEFAULT_MACHINES: MachineProfile[] = [
  {
    id: 'mach-oven-01',
    name: 'Forno de Esterilização 01',
    code: 'OVEN-01',
    manufacturer: 'Siemens / Despatch',
    model: 'S7-1200 (CPU 1214C)',
    softwareName: 'TIA Portal V17 (Step 7)',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Forno industrial para esterilização contínua com queimador e válvula de purga.',
    tags: [
      {
        id: 'tag-1',
        name: 'Temperatura Forno',
        address: 100,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: '°C',
        description: 'Sensor PT100 câmara interna',
        access: 'RO'
      },
      {
        id: 'tag-2',
        name: 'Setpoint Temperatura',
        address: 101,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: '°C',
        description: 'Limiar configurado no PID',
        access: 'RW'
      },
      {
        id: 'tag-3',
        name: 'Válvula Resfriamento / Purga',
        address: 10,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Válvula solenoide Q0.1',
        access: 'RW'
      },
      {
        id: 'tag-4',
        name: 'Chave Queimador',
        address: 15,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Ignitor elétrico queimador a gás',
        access: 'RW'
      }
    ]
  },
  {
    id: 'mach-filler-01',
    name: 'Envasadora Rotativa Krones',
    code: 'FILL-01',
    manufacturer: 'Krones / Siemens',
    model: 'S7-1500 (CPU 1516F-3 PN/DP)',
    softwareName: 'TIA Portal V18 Safety',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Carrossel rotativo de 24 válvulas volumétricas para envase asséptico.',
    tags: [
      {
        id: 'tag-10',
        name: 'Nível Tanque Envasadora',
        address: 105,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'L',
        description: 'Sensor ultrassônico de nível de produto',
        access: 'RO'
      },
      {
        id: 'tag-11',
        name: 'Vazão Bico Principal',
        address: 106,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'ml/s',
        description: 'Caudalímetro mássico Coriolis',
        access: 'RO'
      },
      {
        id: 'tag-12',
        name: 'Válvula Injeção Bico Envase',
        address: 20,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Cilindro pneumático dosagem',
        access: 'RW'
      },
      {
        id: 'tag-13',
        name: 'Sensor Presença Frasco',
        address: 21,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Sensor óptico barreira de frasco',
        access: 'RO'
      }
    ]
  },
  {
    id: 'mach-conv-01',
    name: 'Esteira de Frascos & Transferência',
    code: 'CONV-01',
    manufacturer: 'Schneider Electric',
    model: 'Modicon M241 (TM241CE24T)',
    softwareName: 'EcoStruxure Machine Expert V2.0',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Esteira modular acionada por inversor de frequência Altivar 320.',
    tags: [
      {
        id: 'tag-20',
        name: 'Velocidade Inversor',
        address: 110,
        type: 'HOLDING_REGISTER',
        dataType: 'INT16',
        unit: 'Hz',
        description: 'Frequência de acionamento do motor',
        access: 'RW'
      },
      {
        id: 'tag-21',
        name: 'Partida / Parada Esteira',
        address: 25,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Comando Run/Stop inversor',
        access: 'RW'
      },
      {
        id: 'tag-22',
        name: 'Sensor Acúmulo Frascos',
        address: 26,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Fotocélula de fila de saída cheia',
        access: 'RO'
      }
    ]
  },
  {
    id: 'mach-safety-01',
    name: 'Célula de Segurança & Robô Paletizador',
    code: 'SAFE-01',
    manufacturer: 'Siemens / KUKA',
    model: 'S7-1500F (Fail-Safe) + KRC4',
    softwareName: 'TIA Portal Safety Integrated V18',
    protocol: 'Modbus TCP',
    host: '127.0.0.1',
    port: 7002,
    unitId: 1,
    status: 'ONLINE',
    notes: 'Perímetro NR-12 com barreiras físicas, cortina de luz e relés de parada segura.',
    tags: [
      {
        id: 'tag-30',
        name: 'Canal Not-Halt Geral',
        address: 30,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Circuito duplo canal botão cogumelo',
        access: 'RO'
      },
      {
        id: 'tag-31',
        name: 'Cortina de Luz Lichtschranke',
        address: 31,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Barreira OSSD zona de risco robô',
        access: 'RO'
      },
      {
        id: 'tag-32',
        name: 'Trava Eletromagnética Porta',
        address: 32,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Schutztür com retenção mecânica',
        access: 'RW'
      },
      {
        id: 'tag-33',
        name: 'Desarme Geral Potência K1/K2',
        address: 0,
        type: 'COIL',
        dataType: 'BOOL',
        description: 'Contator principal de alimentação motores',
        access: 'RW'
      }
    ]
  }
];

export class MachineRepository {
  private static storageDir = path.resolve(process.cwd(), 'data');
  private static machinesFile = path.resolve(MachineRepository.storageDir, 'machines.json');
  private static machines: Map<string, MachineProfile> = new Map();

  static initialize(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }

    if (fs.existsSync(this.machinesFile)) {
      try {
        const raw = fs.readFileSync(this.machinesFile, 'utf-8');
        const list: MachineProfile[] = JSON.parse(raw);
        list.forEach((m) => this.machines.set(m.id, m));
      } catch (err) {
        console.error('Falha ao carregar banco de dados de máquinas:', err);
      }
    }

    if (this.machines.size === 0) {
      DEFAULT_MACHINES.forEach((m) => this.machines.set(m.id, m));
      this.persist();
    }
  }

  static findAll(): MachineProfile[] {
    return Array.from(this.machines.values());
  }

  static findById(id: string): MachineProfile | undefined {
    return this.machines.get(id);
  }

  static save(machine: MachineProfile): MachineProfile {
    machine.updatedAt = new Date().toISOString();
    if (!machine.createdAt) machine.createdAt = machine.updatedAt;
    this.machines.set(machine.id, machine);
    this.persist();
    return machine;
  }

  static delete(id: string): boolean {
    const deleted = this.machines.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  private static persist(): void {
    try {
      const data = JSON.stringify(Array.from(this.machines.values()), null, 2);
      fs.writeFileSync(this.machinesFile, data, 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar arquivo de máquinas:', err);
    }
  }
}
