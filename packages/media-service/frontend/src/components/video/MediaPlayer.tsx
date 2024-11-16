import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

interface MediaPlayerProps {
  type: string;
  link: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ type, link }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type === 'Torrent' && link.startsWith('magnet:?')) {
      // Verifica se `WebTorrent` está disponível no objeto `window`
      if (!window.WebTorrent) {
        console.error('WebTorrent não está disponível no window.');
        return;
      }

      const client = new window.WebTorrent();

      client.add(link, (torrent) => {
        console.log('Torrent carregado:', torrent);

        const file = torrent.files.find((file) => file.name.endsWith('.mp4'));

        if (file && videoRef.current) {
          console.log('Reproduzindo arquivo:', file.name);

          // Renderiza o vídeo diretamente no elemento <video>
          file.renderTo(videoRef.current, (err) => {
            if (err) {
              console.error('Erro ao renderizar o vídeo:', err);
            } else {
              console.log('Vídeo carregado com sucesso!');
            }
          });
        } else {
          console.error('Nenhum arquivo MP4 encontrado no torrent.');
        }
      });

      return () => client.destroy(); // Cleanup ao desmontar o componente
    }
  }, [type, link]);

  if (type === 'Youtube') {
    return <ReactPlayer url={link} controls width="100%" height="480px" />;
  }

  if (type === 'Torrent') {
    return <video ref={videoRef} controls width="100%" height="480px" />;
  }

  return <p>Tipo de mídia não suportado.</p>;
};

export default MediaPlayer;
