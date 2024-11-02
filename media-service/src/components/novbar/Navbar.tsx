import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Ícone de perfil
import { BsList } from 'react-icons/bs'; // Ícone de menu "sanduíche"
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // CSS personalizado

const Navbar: React.FC = () => {
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
      <a className="navbar-brand" href="#">
        NOME DO PROJETO
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Minhas Mídias</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Meus Canais</a>
          </li>
        </ul>
      </div>
      <FaUserCircle size={30} className="profile-icon ml-3" />
    </nav>
  );
};

export default Navbar;
