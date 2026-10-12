export type RegisterCategory = 'HOLDING_REGISTER' | 'COIL' | 'INPUT_REGISTER' | 'DISCRETE_INPUT';

export interface MachineTag {
  id: string;
  name: string;
  address: number;
  type: RegisterCategory;
  dataType?: 'INT16' | 'FLOAT32' | 'BOOL' | 'WORD';
  unit?: string;
  description?: string;
  access: 'RO' | 'RW' | 'WO';
}

export interface MachineProfile {
  id: string;
  name: string;
  code: string;
  manufacturer: string;
  model: string;
  softwareName: string;
  protocol: 'Modbus TCP' | 'OPC UA' | 'S7comm' | 'EtherNet/IP';
  host: string;
  port: number;
  unitId?: number;
  rack?: number;
  slot?: number;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  tags: MachineTag[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
