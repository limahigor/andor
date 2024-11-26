import axios from "axios";

const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:3000/api/media";

export const deleteMediasByChannelId = async (
  channelId: string,
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${MEDIA_SERVICE_URL}/mediaId/${channelId}`,
    );
    console.log(
      `Mídias associadas ao canal ${channelId} foram excluídas.`,
      response.data,
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `Erro do servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      );
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
};
