import { Request, Response } from 'express';
import { ProtocolFactory } from '../../protocols/protocolFactory';
import { ProtocolType, ModbusRegisterType, MachineProfile } from '@machina/shared';
import { MachineRepository } from '../../database/repositories/machine.repository';

export class MachineController {
  static listMachines(req: Request, res: Response): void {
    const machines = MachineRepository.findAll();
    res.json({ success: true, count: machines.length, machines });
  }

  static getMachine(req: Request, res: Response): void {
    const machine = MachineRepository.findById(req.params.id);
    if (!machine) {
      res.status(404).json({ success: false, error: 'Máquina não encontrada' });
      return;
    }
    res.json({ success: true, machine });
  }

  static saveMachine(req: Request, res: Response): void {
    const machine: MachineProfile = req.body;
    if (!machine.id || !machine.name) {
      res.status(400).json({ success: false, error: 'Campos "id" e "name" são obrigatórios' });
      return;
    }
    const saved = MachineRepository.save(machine);
    res.json({ success: true, message: 'Máquina salva com sucesso', machine: saved });
  }

  static deleteMachine(req: Request, res: Response): void {
    const deleted = MachineRepository.delete(req.params.id);
    res.json({ success: deleted, message: deleted ? 'Máquina removida' : 'Máquina não encontrada' });
  }

  static async readRegister(req: Request, res: Response): Promise<void> {
    const { ip, port = 502, address, type = 'HOLDING_REGISTER', unitId = 1 } = req.query;

    if (!ip || address === undefined) {
      res.status(400).json({ success: false, error: 'Parâmetros "ip" e "address" são obrigatórios' });
      return;
    }

    try {
      const driver = ProtocolFactory.getDriver(ProtocolType.MODBUS_TCP, String(ip), Number(port));
      await driver.connect(String(ip), Number(port), Number(unitId));
      const result = await driver.read(type as ModbusRegisterType, Number(address));

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async writeRegister(req: Request, res: Response): Promise<void> {
    const { ip, port = 502, address, value, type = 'writeCoil', unitId = 1 } = req.body;

    if (!ip || address === undefined || value === undefined) {
      res.status(400).json({ success: false, error: 'Parâmetros "ip", "address" e "value" são obrigatórios' });
      return;
    }

    try {
      const driver = ProtocolFactory.getDriver(ProtocolType.MODBUS_TCP, String(ip), Number(port));
      await driver.connect(String(ip), Number(port), Number(unitId));

      let result: boolean;
      if (type === 'writeCoil') {
        result = await driver.writeCoil(Number(address), Boolean(value));
      } else {
        result = await driver.writeHoldingRegister(Number(address), Number(value));
      }

      res.json({ success: true, written: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
