import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <BsList className="navbar-toggler-icon" />
      </button>
      <a
        className="navbar-brand"
        onClick={() => navigate('/home')}
        style={{ cursor: 'pointer' }}
      >
        NOME DO PROJETO
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/minhas-midias">
              Minhas Mídias
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/meus-canais">
              Meus Canais
            </a>
          </li>
        </ul>
      </div>
      <FaUserCircle size={30} className="profile-icon ml-3" />
    </nav>
  );
};

export default Navbar;
