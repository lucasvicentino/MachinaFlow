import { Router } from 'express';
import { FlowController } from '../controllers/flow.controller';

const router = Router();

router.get('/', FlowController.listFlows);
router.get('/:id', FlowController.getFlow);
router.post('/deploy', FlowController.deployFlow);
router.post('/:id/run', FlowController.runFlow);
router.post('/:id/stop', FlowController.stopFlow);

export default router;

