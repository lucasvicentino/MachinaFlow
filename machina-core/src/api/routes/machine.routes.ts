import { Router } from 'express';
import { MachineController } from '../controllers/machine.controller';

const router = Router();

// Machine Catalog CRUD
router.get('/catalog', MachineController.listMachines);
router.get('/catalog/:id', MachineController.getMachine);
router.post('/catalog', MachineController.saveMachine);
router.delete('/catalog/:id', MachineController.deleteMachine);

// Industrial Protocol Direct IO
router.get('/read', MachineController.readRegister);
router.post('/write', MachineController.writeRegister);

export default router;
