export interface Media {
    _id?: string; // O ID pode ser opcional para criar novas mídias
    title: string;
    type: string;
    channel: string;
    link: string;
  }
  
  const BASE_URL = 'http://localhost:3000/api/media';
  
  export const mediaClient = {
    // Busca todas as mídias
    async list(): Promise<Media[]> {
      const response = await fetch(`${BASE_URL}/list`);
      if (!response.ok) {
        throw new Error('Erro ao buscar mídias');
      }
      return response.json();
    },
  
    // Cria uma nova mídia
    async create(media: Media): Promise<Media> {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro do servidor ao criar mídia:', errorData);
        throw new Error('Erro ao criar mídia');
      }
  
      return response.json();
    },
  
    // Exclui uma mídia
    async delete(mediaId: string): Promise<void> {
      const response = await fetch(`${BASE_URL}/del/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro do servidor ao excluir mídia:', errorData);
        throw new Error('Erro ao excluir mídia');
      }
    },
  };
  