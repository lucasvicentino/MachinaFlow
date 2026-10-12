import ModbusRTU, { ServerTCP } from 'modbus-serial';

export class MockPlcServer {
  private port: number;
  private server: any;
  private holdingRegisters: number[] = new Array(1000).fill(0);
  private coils: boolean[] = new Array(1000).fill(false);
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(port: number = 7002) {
    this.port = port;
    // Initial state: Oven temperature at 75°C
    this.holdingRegisters[100] = 75;
  }

  start(): void {
    const vector = {
      getHoldingRegister: (addr: number) => {
        return this.holdingRegisters[addr] || 0;
      },
      setRegister: (addr: number, val: number) => {
        console.log(`[SIMULATOR] Escrita em Holding Register [${addr}] = ${val}`);
        this.holdingRegisters[addr] = val;
      },
      getCoil: (addr: number) => {
        return this.coils[addr] || false;
      },
      setCoil: (addr: number, val: boolean) => {
        console.log(`[SIMULATOR] Escrita em Bobina/Coil [${addr}] = ${val}`);
        this.coils[addr] = val;
      }
    };

    const ServerClass = ServerTCP || (ModbusRTU as any).ServerTCP;
    this.server = new ServerClass(vector, {
      host: '0.0.0.0',
      port: this.port,
      debug: false,
      unitID: 1
    });

    console.log(`[SIMULATOR] Servidor Modbus TCP Simulador ativo na porta ${this.port}`);

    // Realistic physical dynamics:
    // If cooling valve (coil 10) is OPEN, temperature decreases.
    // If cooling valve is CLOSED, heater increases temperature.
    this.simulationInterval = setInterval(() => {
      const coolingValve = this.coils[10];
      let currentTemp = this.holdingRegisters[100];

      if (coolingValve) {
        currentTemp = Math.max(65, currentTemp - 2);
      } else {
        currentTemp = Math.min(95, currentTemp + 1);
      }

      this.holdingRegisters[100] = currentTemp;
    }, 1500);
  }

  stop(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.server) this.server.close();
  }
}

