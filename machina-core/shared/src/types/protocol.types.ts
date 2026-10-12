import { ProtocolType, ModbusRegisterType } from '../constants/protocols';

export interface ModbusConnectionConfig {
  host: string;
  port: number;
  unitId?: number;
  timeoutMs?: number;
}

export interface ModbusReadCommand {
  registerType: ModbusRegisterType;
  address: number;
  length?: number;
}

export interface ModbusWriteCommand {
  registerType: ModbusRegisterType.COIL | ModbusRegisterType.HOLDING_REGISTER;
  address: number;
  value: boolean | number;
}

export interface OpcUaConnectionConfig {
  endpointUrl: string;
  securityMode?: string;
  securityPolicy?: string;
  nodeId?: string;
}

export interface MqttConnectionConfig {
  brokerUrl: string;
  topic: string;
  qos?: 0 | 1 | 2;
}

