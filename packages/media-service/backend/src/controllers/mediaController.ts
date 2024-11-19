import type { Request, Response } from 'express';
import Media from '../models/media.js';

// Define tipos para `req.body` e `req.query`
interface CreateMediaBody {
  title: string;
  type: string;
  link: string;
}


export const getMedias = async (req: Request, res: Response): Promise<void> => {
  try {
    const medias = await Media.find(); // Busca todas as mídias no banco
    res.status(200).json(medias); // Retorna como JSON
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    res.status(500).json({ error: 'Erro ao buscar mídias.' });
  }
};

export const createMedia = async (
  req: Request<Record<string, unknown>, unknown, CreateMediaBody>,
  res: Response
): Promise<void> => {
  try {
    // Use desestruturação para req.body
    const { title, type, link } = req.body;

    if (!title || !type || !link) {
      res.status(400).json({ error: 'Os campos title, type e link são obrigatórios.' });
      return;
    }

    // Evite passar req.body diretamente
    const media = new Media({ title, type, link });
    await media.save();

    console.log('Mídia salva com sucesso:', media);
    res.status(201).json(media);
  } catch (error) {
    console.error('Erro ao salvar mídia no banco:', error);
    res.status(500).json({ message: 'Erro ao salvar mídia', error });
  }
};

export const deleteMediaById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; 
  console.log('ID recebido:', id); // Loga o ID recebido

  if (!id) {
    res.status(400).json({ error: 'ID é obrigatório.' });
    return;
  }

  try {
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      console.log('Mídia não encontrada para o ID:', id);
      res.status(404).json({ error: 'Mídia não encontrada.' });
      return;
    }

    console.log('Mídia excluída:', media);
    res.status(200).json({ message: 'Mídia excluída com sucesso.', media });
  } catch (error) {
    console.error('Erro ao excluir mídia:', error);
    res.status(500).json({ error: 'Erro ao excluir mídia.' });
  }
};


export const getMediasById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const media = await Media.findById(id);
    if (!media) {
      res.status(404).json({ error: 'Mídia não encontrada.' });
      return;
    }

    res.status(200).json(media);
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    res.status(500).json({ error: 'Erro ao buscar mídia.' });
  }
};

export const deleteMediasByChannel = async (req: Request, res: Response): Promise<void> => {
  const { channelId } = req.params;

  try {
    await Media.deleteMany({ channel: channelId }); // Supondo que `channel` é um campo na coleção Media
    res.status(200).json({ message: 'Mídias associadas excluídas com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir mídias:', error);
    res.status(500).json({ error: 'Erro ao excluir mídias associadas.' });
  }
};
