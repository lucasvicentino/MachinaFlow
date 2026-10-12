export enum ProtocolType {
  MODBUS_TCP = 'MODBUS_TCP',
  OPC_UA = 'OPC_UA',
  MQTT = 'MQTT',
  SIMULATOR = 'SIMULATOR'
}

export enum ModbusRegisterType {
  COIL = 'COIL',                           // 0x (Read/Write 1 bit)
  DISCRETE_INPUT = 'DISCRETE_INPUT',       // 1x (Read-only 1 bit)
  INPUT_REGISTER = 'INPUT_REGISTER',       // 3x (Read-only 16-bit word)
  HOLDING_REGISTER = 'HOLDING_REGISTER'    // 4x (Read/Write 16-bit word)
}

export enum NodeExecutionState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR'
}

