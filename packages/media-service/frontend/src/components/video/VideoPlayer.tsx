import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const VideoPlayer: React.FC = () => {
  const { link } = useParams<{ link: string }>(); // Pega o link do vídeo pela URL
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!link) return;

    const fetchStreamUrl = async () => {
      try {
        // Backend gera um stream baseado no magnetURI
        const response = await fetch(`http://localhost:3000/api/media/stream?magnetURI=${encodeURIComponent(link)}`);
        if (!response.ok) throw new Error('Erro ao iniciar o streaming.');
        setStreamUrl(`http://localhost:3000/api/media/stream?magnetURI=${encodeURIComponent(link)}`);
      } catch (error) {
        console.error('Erro ao buscar o stream:', error);
        alert('Não foi possível reproduzir o vídeo.');
        navigate('/');
      }
    };

    fetchStreamUrl();
  }, [link, navigate]);

  if (!link) {
    return (
      <div className="container mt-4">
        <h2>Erro</h2>
        <p>Link do vídeo não encontrado.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Voltar para a Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Reproduzindo Vídeo</h2>
      {streamUrl ? (
        <ReactPlayer
          url={streamUrl}
          controls={true}
          width="100%"
          height="480px"
        />
      ) : (
        <p>Carregando stream...</p>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>
        Voltar para a Home
      </button>
    </div>
  );
};

export default VideoPlayer;
