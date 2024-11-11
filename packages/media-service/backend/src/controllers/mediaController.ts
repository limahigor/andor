import type { Request, Response } from 'express';
import Media from '../models/media';

// Buscar todas as mídias
export const getMedias = async (req: Request, res: Response): Promise<void> => {
  try {
    const medias = await Media.find(); // Busca todas as mídias no banco
    res.json(medias); // Retorna como JSON
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    res.status(500).json({ error: 'Erro ao buscar mídias.' });
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
