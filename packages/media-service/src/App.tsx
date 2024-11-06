import React from 'react';
import Home from './components/home/home';
import Navbar from './components/novbar/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Home />
      {/* Outros componentes podem ser adicionados aqui */}
    </div>
  );
};

export default App;
