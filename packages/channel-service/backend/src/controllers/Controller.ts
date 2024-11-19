import { Request, Response } from 'express';
import Channel from '../models/model.js';
import axios from 'axios';
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3000/api/media/';

export const createChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentChannel } = req.body;

    // Verifica se o canal pai existe, se foi passado
    if (parentChannel) {
      const parent = await Channel.findById(parentChannel);
      if (!parent) {
        res.status(404).json({ message: 'Canal pai não encontrado.' });
        return;
      }
    }

    // Cria o canal (com ou sem canal pai)
    const newChannel = await Channel.create({
      name,
      description,
      parentChannel: parentChannel || null, // Define null se não tiver pai
    });

    res.status(201).json({ message: 'Canal criado com sucesso!', channel: newChannel });
  } catch (error) {
    console.error('Erro ao criar canal:', error);
    res.status(500).json({ message: 'Erro ao criar canal.', error });
  }
};

export const getChannels = async (req: Request, res: Response): Promise<void> => {
  try {
    const channels = await Channel.find()
      .populate('parentChannel', 'name description') // Popula dados básicos do canal pai
      .populate('medias', 'title type link'); // Popula informações das mídias associadas
    res.status(200).json(channels); // Retorna os canais como JSON
  } catch (error) {
    console.error('Erro ao buscar canais:', error);
    res.status(500).json({ error: 'Erro ao buscar canais.' });
  }
};


export const getMediaById = async (mediaId: string) => {
  try {
    const response = await axios.get(`${MEDIA_SERVICE_URL}/mediaId/${mediaId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao obter mídia do media-service (ID: ${mediaId}):`, error.message);
    } else {
      console.error('Falha ao obter mídia do media-service.', error);
    }
  }
};


export const getChannelWithMedia = async (req: Request, res: Response): Promise<void> => {
  const { channelId, mediaId } = req.params;

  try {
    // Busca o canal no banco de dados do channel-service
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ error: 'Canal não encontrado.' });
      return;
    }

    // Chama o media-service para obter os dados da mídia
    const media = await getMediaById(mediaId);

    res.status(200).json({ channel, media });
  } catch (error) {
    console.error('Erro ao buscar canal ou mídia:', error);
    res.status(500).json({ error: 'Erro ao buscar canal ou mídia.' });
  }
};
