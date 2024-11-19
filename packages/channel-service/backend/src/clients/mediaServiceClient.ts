import axios from 'axios';

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3000/api/media';

export const deleteMediasByChannelId = async (channelId: string): Promise<void> => {
    try {
      const response = await axios.delete(`${MEDIA_SERVICE_URL}/mediaId/${channelId}`);
      console.log(`Mídias associadas ao canal ${channelId} foram excluídas.`, response.data);
    } catch (error) {
      console.error('Erro ao excluir mídias associadas no media-service:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Erro do servidor: ${error.response.status} - ${error.response.data}`);
      }
      throw new Error('Falha ao excluir mídias associadas no media-service.');
    }
  };
  