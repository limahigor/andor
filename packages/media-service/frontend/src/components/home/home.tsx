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
  

  // Exibe ou esconde o modal
  const handleShowMediaModal = () => setShowMediaModal(true);
  const handleCloseMediaModal = () => setShowMediaModal(false);

  // Função para salvar mídia
  const handleSaveMedia = async () => {
    if (!title || !type || !link) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    try {
      console.log('Enviando dados para o backend:', { title, type, channel, link });
  
      const response = await fetch('/api/media/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, channel, link }),
      });
  
      console.log('Resposta do servidor (status):', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro retornado pelo backend:', errorData);
        throw new Error('Erro ao salvar mídia');
      }
  
      const savedMedia = await response.json();
      console.log('Mídia salva no backend:', savedMedia);
  
      alert('Mídia salva com sucesso!');
      handleCloseMediaModal();
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
      const data = await response.json();
      setMedias(data);
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
    }
  };

  // Busca as mídias ao montar o componente   
  useEffect(() => {
    fetchMedias();
  }, []);

  return (
    <div className="container mt-4">
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Últimas Mídias</h2>
          <button className="open-modal-button" onClick={handleShowMediaModal}>
            <FaPlus className="mr-2" /> Adicionar Mídia
          </button>
        </div>
        <div className="row">
          {medias.map((media: IMedia, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card midia-card">
                <img src="link-da-imagem" className="card-img-top" alt={`Mídia ${index + 1}`} />
                <div className="card-body">
                  <h5 className="card-title">{media.title}</h5>
                  <p className="card-text">Tipo: {media.type}</p>
                  <p className="card-text">Canal: {media.channel}</p>
                  <button className="btn btn-primary">Assistir</button>
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
                <button type="button" className="btn-close" onClick={handleCloseMediaModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="mediaTitle" className="form-label">Título da Mídia</label>
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
                    <label htmlFor="mediaType" className="form-label">Canal</label>
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
                    <label htmlFor="mediaType" className="form-label">Tipo</label>
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
                    <label htmlFor="mediaLink" className="form-label">Link</label>
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
                <button type="button" className="btn btn-secondary" onClick={handleCloseMediaModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveMedia}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
