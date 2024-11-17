import { Router } from 'express';
import { getMedias, createMedia, deleteMediaById } from '../controllers/mediaController.js';


const router = Router();

router.get('/list', getMedias);
router.post('/create', createMedia);
router.delete('/del/:id', deleteMediaById);
 
  
export default router;
