import type { Request, Response } from 'express';
import Media from '../models/media.js';
import WebTorrent from 'webtorrent';

// Define tipos para `req.body` e `req.query`
interface CreateMediaBody {
  title: string;
  type: string;
  link: string;
}

interface StreamMagnetQuery {
  magnetURI?: string;
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

export const streamMagnet = async (
  req: Request<unknown, unknown, unknown, StreamMagnetQuery>,
  res: Response
): Promise<void> => {
  // Use desestruturação para req.query
  const { magnetURI } = req.query;

  if (!magnetURI) {
    res.status(400).json({ error: 'Magnet URI inválido.' });
    return;
  }

  const client = new WebTorrent();

  client.add(magnetURI, (torrent) => {
    // Use desestruturação ao acessar arquivos do torrent
    const file = torrent.files.find(({ name }) => name.endsWith('.mp4'));

    if (!file) {
      res.status(404).json({ error: 'Nenhum arquivo de vídeo encontrado no torrent.' });
      client.destroy(); // Certifique-se de liberar recursos
      return;
    }

    try {
      // Configura o stream do vídeo
      res.setHeader('Content-Type', 'video/mp4');
      const stream = file.createReadStream();

      stream.on('error', (err) => {
        console.error('Erro ao criar o stream:', err);
        res.status(500).json({ error: 'Erro ao transmitir o vídeo.' });
        client.destroy();
      });

      stream.pipe(res);

      res.on('close', () => {
        console.log('Conexão fechada pelo cliente.');
        client.destroy(); // Cleanup ao fechar a conexão
      });
    } catch (error) {
      console.error('Erro no streaming:', error);
      res.status(500).json({ error: 'Erro no streaming do vídeo.' });
      client.destroy();
    }
  });
};
