import { ModbusRegisterType } from '@machina/shared';

export interface ReadResult {
  address: number;
  value: number | boolean;
  timestamp: Date;
}

export interface IIndustrialDriver {
  connect(host: string, port: number, unitId?: number): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  read(registerType: ModbusRegisterType, address: number, length?: number): Promise<ReadResult>;
  writeCoil(address: number, state: boolean): Promise<boolean>;
  writeHoldingRegister(address: number, value: number): Promise<boolean>;
  ping(): Promise<boolean>;
}

