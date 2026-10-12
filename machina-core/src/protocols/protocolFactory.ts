import { ProtocolType } from '@machina/shared';
import { IIndustrialDriver } from './driver.interface';
import { ModbusTcpDriver } from './modbus/modbusDriver';

export class ProtocolFactory {
  private static drivers: Map<string, IIndustrialDriver> = new Map();

  static getDriver(protocol: ProtocolType, host: string, port: number): IIndustrialDriver {
    const key = `${protocol}_${host}_${port}`;
    let driver = this.drivers.get(key);

    if (!driver) {
      switch (protocol) {
        case ProtocolType.MODBUS_TCP:
        case ProtocolType.SIMULATOR:
        default:
          driver = new ModbusTcpDriver();
          break;
      }
      this.drivers.set(key, driver);
    }

    return driver;
  }
}

