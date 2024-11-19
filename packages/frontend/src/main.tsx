import { Buffer } from 'buffer/';


// Adiciona Buffer e global ao navegador
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Inicialização da aplicação React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
