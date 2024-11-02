import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // Certifique-se de estilizar conforme necessário
import { FaPlus } from 'react-icons/fa'; // Ícone de adicionar

const Home: React.FC = () => {
  return (
    <div className="container mt-4">
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Últimas Mídias</h2>
          <button className="btn btn-success d-flex align-items-center">
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
    </div>
  );
};

export default Home;
