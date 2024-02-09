import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';
import AlbumPage from './pages/AlbumPage/AlbumPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
      </Routes>
    </Router>
  );
}

export default App;
