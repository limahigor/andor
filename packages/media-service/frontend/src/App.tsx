
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/home';
import VideoPlayer from './components/video/VideoPlayer';


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/player/:link/:type" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
