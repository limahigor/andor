import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaPlayer from './MediaPlayer';

const VideoPlayer: React.FC = () => {
  const { link, type } = useParams<{ link: string; type: string }>();
  const navigate = useNavigate();

  if (!link || !type) {
    return (
      <div className="container mt-4">
        <h2>Erro</h2>
        <p>Link ou tipo de mídia não encontrados.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Voltar para a Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Reproduzindo Mídia</h2>
      <MediaPlayer type={type} link={decodeURIComponent(link)} />
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>
        Voltar para a Home
      </button>
    </div>
  );
};

export default VideoPlayer;
