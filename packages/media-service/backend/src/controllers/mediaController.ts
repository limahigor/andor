import type { Request, Response } from 'express';
import Media from '../models/media';

// Buscar todas as mídias
export const getMedias = async (req: Request, res: Response): Promise<void> => {
  try {
    const medias = await Media.find();
    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mídias', error });
  }
};

export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Dados recebidos:', req.body); // Log dos dados recebidos
    const media = new Media(req.body);
    await media.save();
    console.log('Mídia salva com sucesso:', media); // Log da mídia salva
    res.status(201).json(media);
  } catch (error) {
    console.error('Erro ao salvar mídia no banco:', error); // Log detalhado do erro
    res.status(500).json({ message: 'Erro ao salvar mídia', error });
  }
};
