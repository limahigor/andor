import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { FaPlay, FaPlus } from 'react-icons/fa'; // Ícone de adicionar
import type { IMedia } from '../../../../backend/src/models/media';
import { useNavigate } from 'react-router-dom';



const Home: React.FC = () => {

  const navigate = useNavigate();
  const handleWatchMedia = (link: string, type: string) => {
    navigate(`/player/${encodeURIComponent(link)}/${type}`);
  };
  
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
    const trimmedLink = link.trim();
  
    if (type === 'Youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
      return youtubeRegex.test(trimmedLink);
    }
  
    if (type === 'Torrent') {
      const magnetRegex = /^magnet:\?xt=urn:[a-z0-9]+:[a-zA-Z0-9]{32,}/;
      return magnetRegex.test(trimmedLink);
    }
  
    if (type === 'Google Drive') {
      const googleDriveRegex = /^(https?:\/\/)?(www\.)?drive\.google\.com\/file\/d\/[-\w]{25,}/;
      return googleDriveRegex.test(trimmedLink);
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
      const response = await fetch('http://localhost:3000/api/media/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, channel, link }),
      });
      console.log('Resposta do backend:', response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro retornado pelo backend:', errorData);
        throw new Error('Erro ao salvar mídia');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  
  
  
  const getThumbnail = (link: string, type: string, title: string) => {
    if (type === 'Youtube') {
      try {
        // Remove espaços extras
        const trimmedLink = link.trim();
        
        // Extrai o ID do vídeo do link
        const videoId =
          new URL(trimmedLink).searchParams.get('v') || // Para URLs completas
          trimmedLink.split('/').pop(); // Para URLs encurtadas como youtu.be
  
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      } catch (error) {
        console.error('Erro ao extrair ID do vídeo do link:', error);
      }
      return 'https://via.placeholder.com/150?text=ID+Inválido'; // Retorno padrão em caso de erro
    }
  
    if (type === 'Torrent') {
      return `https://via.placeholder.com/150?text=${encodeURIComponent(title)}+Torrent`;
    }
  
    if (type === 'Google Drive') {
      return `https://via.placeholder.com/150?text=Google+Drive+${encodeURIComponent(title)}`;
    }
  
    return 'https://via.placeholder.com/150'; // Retorno padrão para outros tipos
  };

  const handleDeleteMedia = async (id: string) => {
    // Perguntar se o usuário quer realmente excluir
    const confirmation = window.confirm('Você tem certeza de que deseja excluir esta mídia?');
    if (!confirmation) {
      // Se o usuário cancelar, não faz nada
      return;
    }
  
    try {
      // Requisição para excluir a mídia
      const response = await fetch(`http://localhost:3000/api/media/del/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Resposta do backend:', response);
  
      if (!response.ok) {
        const errorData = await response.text(); // Leia a resposta
        console.error('Erro do servidor:', errorData);
        throw new Error(errorData || 'Erro ao excluir mídia');
      }
  
      // Aviso de sucesso
      alert('Mídia excluída com sucesso!');
  
      // Atualiza a página para refletir a exclusão
      window.location.reload();
    } catch (error) {
      console.error('Erro no frontend:', error);
      alert('Erro ao excluir mídia');
  
    }
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
            <div className="col-md-3" key={index}>
            <div className="card midia-card">
              <div className="thumbnail-container" onClick={() => handleWatchMedia(media.link, media.type)}>
                <img
                  src={getThumbnail(media.link, media.type, media.title)}
                  alt={media.title || "Imagem não disponível"}
                />
                <div className="play-icon">▶</div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{media.title}</h5>
                <p className="card-text">Tipo: {media.type}</p>
                <div>
                  <button className="btn btn-primary">Alterar</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteMedia(media._id)}>
                    Excluir
                  </button>
                </div>
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

     
