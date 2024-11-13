import { Router } from 'express';
import { getMedias, createMedia } from '../controllers/mediaController.js';


const router = Router();

router.get('/list', getMedias);
router.post('/create', createMedia);
// router.get('/stream', streamMagnet);
// router.get('/stream/clean', cleanUpTorrent);


export default router;
