import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { FaPlus } from 'react-icons/fa'; // Ícone de adicionar
import type { IMedia } from '../../../../backend/src/models/media';

const Home: React.FC = () => {
  // Estados para gerenciar os dados da mídia
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Youtube');
  const [channel, setChannel] = useState('Nenhum');
  const [link, setLink] = useState('');
  const [medias, setMedias] = useState<IMedia[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Exibe ou esconde o modal
  const handleShowMediaModal = () => setShowMediaModal(true);
  const handleCloseMediaModal = () => setShowMediaModal(false);
  
  // Função para validar o link com base no tipo de mídia
  const validateLink = (type: string, link: string): boolean => {
    if (type === 'Youtube') {
      return link.includes('youtube.com/watch?v=') || link.includes('youtu.be/');
    }
    if (type === 'Torrent') {
      return link.startsWith('magnet:?'); // Verifica se é um magnet link
    }
    if (type === 'Google Drive') {
      return link.includes('drive.google.com');
    }
    return false;
  };

  // Função para salvar mídia
  const handleSaveMedia = async () => {
    if (!title || !type || !link) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Valida o link antes de salvar
    if (!validateLink(type, link)) {
      alert('O link fornecido é inválido para o tipo selecionado.');
      return;
    }

    try {
      const response = await fetch('/api/media/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, channel, link }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro retornado pelo backend:', errorData);
        throw new Error('Erro ao salvar mídia');
      }

      const savedMedia = await response.json();
      alert('Mídia salva com sucesso!');
      handleCloseMediaModal();

      // Reseta os campos do formulário
      setTitle('');
      setType('Youtube');
      setChannel('Nenhum');
      setLink('');

      // Atualiza a lista de mídias
      fetchMedias();
    } catch (error) {
      console.error('Erro ao salvar mídia no frontend:', error);
      alert('Erro ao salvar a mídia, tente novamente.');
    }
  };

  // Função para buscar mídias do backend
  const fetchMedias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/media/list');
      if (!response.ok) {
        throw new Error('Erro ao buscar mídias.');
      }
      const data = await response.json();
      setMedias(data); // Salva os dados no estado
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
      setError('Erro ao carregar as mídias. Tente novamente mais tarde.');
    }
  };

  // Função para gerar a URL da thumbnail
  const getThumbnail = (link: string, type: string, title: string) => {
    if (type === 'Youtube') {
      const videoId = link.split('v=')[1]?.split('&')[0] || link.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    if (type === 'Torrent') {
      // Gerar uma imagem genérica baseada no título do torrent
      return `https://via.placeholder.com/150?text=${encodeURIComponent(title)}`;
    }
    if (type === 'Google Drive') {
      return 'https://via.placeholder.com/150?text=Google+Drive'; // Imagem padrão para Google Drive
    }
    return 'https://via.placeholder.com/150'; // Imagem padrão para outros tipos
  };

  // Busca as mídias ao montar o componente
  useEffect(() => {
    fetchMedias();
  }, []);

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Últimas Mídias</h2>
          <button className="open-modal-button" onClick={handleShowMediaModal}>
            <FaPlus className="mr-2" /> Adicionar Mídia
          </button>
        </div>
        <div className="row">
          {medias.map((media, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card midia-card">
                <img
                  src={getThumbnail(media.link, media.type, media.title)}
                  className="card-img-top"
                  alt={media.title || 'Imagem não disponível'}
                />
                <div className="card-body">
                  <h5 className="card-title">{media.title}</h5>
                  <p className="card-text">Tipo: {media.type}</p>
                  <a
                    href={media.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Assistir
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Canais</h2>
          <button className="btn btn-success d-flex align-items-center">
            <FaPlus className="mr-2" /> Adicionar Canal
          </button>
        </div>
      </section>

      {showMediaModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adicionar Nova Mídia</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseMediaModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="mediaTitle" className="form-label">
                      Título da Mídia
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mediaTitle"
                      placeholder="Digite o título da mídia"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaType" className="form-label">
                      Canal
                    </label>
                    <select
                      className="form-select"
                      id="mediaType"
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                    >
                      <option value="Nenhum">Nenhum</option>
                      <option value="canal1">Canal 1</option>
                      <option value="canal2">Canal 2</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaType" className="form-label">
                      Tipo
                    </label>
                    <select
                      className="form-select"
                      id="mediaType"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Youtube">Youtube</option>
                      <option value="Torrent">Torrent</option>
                      <option value="Google Drive">Google Drive</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaLink" className="form-label">
                      Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mediaLink"
                      placeholder="Digite o link da mídia"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseMediaModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveMedia}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Home;

     
