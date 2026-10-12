import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '7001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:7000',
  defaultModbusPort: parseInt(process.env.DEFAULT_MODBUS_PORT || '7002', 10),
  modbusTimeoutMs: parseInt(process.env.MODBUS_TIMEOUT_MS || '3000', 10),
  simulatorHost: process.env.SIMULATOR_HOST || '127.0.0.1',
  simulatorPort: parseInt(process.env.SIMULATOR_PORT || '7002', 10),
};

