import { Router } from 'express';
import { getMedias, createMedia } from '../controllers/mediaController';

const router = Router();

router.get('/list', getMedias);
router.post('/create', createMedia);

export default router;
