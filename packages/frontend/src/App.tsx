import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/home';
import VideoPlayer from './components/video/VideoPlayer';
import Signup from './pages/Signup/Signup';
import LoginForm from './pages/Login/LoginForm';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [loading, setLoading] = useState(true); // Estado de carregamento para validação

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token não encontrado.');
        setIsAuthenticated(false);
        setLoading(false); // Finaliza carregamento mesmo sem token
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5050/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
  
        if (response.ok) {
          console.log('Token válido.');
          setIsAuthenticated(true);
        } else {
          console.log('Token inválido.');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro na validação do token:', error);
        setIsAuthenticated(false); // Considera inválido em caso de erro
      } finally {
        setLoading(false); // Sempre finaliza o estado de carregamento
      }
    };
  
    validateToken();
  }, []); // Executa apenas na montagem

  if (loading) {
    return <div>Carregando...</div>; // Indicador de carregamento
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:link/:type"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <VideoPlayer />
            </ProtectedRoute>
          }
        />
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
