import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { FaPlus } from 'react-icons/fa'; // Ícone de adicionar

const Home: React.FC = () => {
  const [showMediaModal, setShowMediaModal] = useState(false);

  const handleShowMediaModal = () => setShowMediaModal(true);
  const handleCloseMediaModal = () => setShowMediaModal(false);

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
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div className="col-md-3 mb-4" key={num}>
              <div className="card midia-card">
                <img src="link-da-imagem" className="card-img-top" alt={`Mídia ${num}`} />
                <div className="card-body">
                  <h5 className="card-title">Título da Mídia {num}</h5>
                  <p className="card-text">Tipo: IPTV / Torrent / Google Drive</p>
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
        <div className="row">
          {[1, 2, 3, 4, 5].map((num) => (
            <div className="col-md-3 mb-4" key={num}>
            <div className="card canal-card">
              <div className="card-body">
                <h5 className="card-title">Canal {num}</h5>
                <button className="btn btn-secondary">Entrar</button>
              </div>
            </div>
          </div>          
          ))}
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
                    <input type="text" className="form-control" id="mediaTitle" placeholder="Digite o título da mídia" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaType" className="form-label">Canal</label>
                    <select className="form-select" id="mediaType">
                      <option value="IPTV">Nenhum</option>
                      <option value="Torrent">Canal 1</option>
                      <option value="Google Drive">Canal 2</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaType" className="form-label">Tipo</label>
                    <select className="form-select" id="mediaType">
                      <option value="IPTV">IPTV</option>
                      <option value="Torrent">Torrent</option>
                      <option value="Google Drive">Google Drive</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mediaLink" className="form-label">Link</label>
                    <input type="text" className="form-control" id="mediaLink" placeholder="Digite o link da mídia" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseMediaModal}>Cancelar</button>
                <button type="button" className="btn btn-primary">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
