import { Router } from 'express';
import { getMedias, createMedia, deleteMediaById, getMediasById } from '../controllers/mediaController.js';


const router = Router();

router.get('/list', getMedias);
router.post('/create', createMedia);
router.delete('/del/:id', deleteMediaById);
router.get('/mediaId/:id', getMediasById);
 
  
export default router;
