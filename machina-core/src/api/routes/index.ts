import { Router } from 'express';
import flowRoutes from './flow.routes';
import machineRoutes from './machine.routes';

const router = Router();

router.use('/flows', flowRoutes);
router.use('/machine', machineRoutes);

export default router;

