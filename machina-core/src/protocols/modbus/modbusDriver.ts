import ModbusRTU from 'modbus-serial';
import { IIndustrialDriver, ReadResult } from '../driver.interface';
import { ModbusRegisterType } from '@machina/shared';

export class ModbusTcpDriver implements IIndustrialDriver {
  private client: ModbusRTU;
  private connected: boolean = false;
  private currentHost: string = '';
  private currentPort: number = 502;
  private unitId: number = 1;

  constructor(timeoutMs: number = 3000) {
    this.client = new ModbusRTU();
    this.client.setTimeout(timeoutMs);
  }

  async connect(host: string, port: number = 502, unitId: number = 1): Promise<void> {
    if (this.connected && this.currentHost === host && this.currentPort === port) {
      return;
    }

    if (this.connected) {
      await this.disconnect();
    }

    this.currentHost = host;
    this.currentPort = port;
    this.unitId = unitId;

    await this.client.connectTCP(host, { port });
    this.client.setID(unitId);
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.close(() => {});
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected && this.client.isOpen;
  }

  async read(registerType: ModbusRegisterType, address: number): Promise<ReadResult> {
    if (!this.isConnected()) {
      throw new Error(`Modbus client not connected to ${this.currentHost}:${this.currentPort}`);
    }

    let value: number | boolean = 0;

    switch (registerType) {
      case ModbusRegisterType.COIL: {
        const res = await this.client.readCoils(address, 1);
        value = res.data[0];
        break;
      }
      case ModbusRegisterType.DISCRETE_INPUT: {
        const res = await this.client.readDiscreteInputs(address, 1);
        value = res.data[0];
        break;
      }
      case ModbusRegisterType.INPUT_REGISTER: {
        const res = await this.client.readInputRegisters(address, 1);
        value = res.data[0];
        break;
      }
      case ModbusRegisterType.HOLDING_REGISTER:
      default: {
        const res = await this.client.readHoldingRegisters(address, 1);
        value = res.data[0];
        break;
      }
    }

    return {
      address,
      value,
      timestamp: new Date()
    };
  }

  async writeCoil(address: number, state: boolean): Promise<boolean> {
    if (!this.isConnected()) {
      throw new Error(`Modbus client not connected to ${this.currentHost}:${this.currentPort}`);
    }
    await this.client.writeCoil(address, state);
    return true;
  }

  async writeHoldingRegister(address: number, value: number): Promise<boolean> {
    if (!this.isConnected()) {
      throw new Error(`Modbus client not connected to ${this.currentHost}:${this.currentPort}`);
    }
    await this.client.writeRegister(address, value);
    return true;
  }

  async ping(): Promise<boolean> {
    try {
      if (!this.isConnected()) return false;
      await this.client.readHoldingRegisters(0, 1);
      return true;
    } catch {
      return false;
    }
  }
}

