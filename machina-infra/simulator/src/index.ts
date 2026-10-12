import { MockPlcServer } from './modbusServer';

const port = parseInt(process.env.SIMULATOR_PORT || '7002', 10);
const simulator = new MockPlcServer(port);

simulator.start();

process.on('SIGINT', () => {
  console.log('\n[SIMULATOR] Encerrando simulador PLC...');
  simulator.stop();
  process.exit(0);
});

