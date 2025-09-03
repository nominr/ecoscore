import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GreenScoreProvider } from './context/GreenScoreContext';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import LoadingPage from './pages/LoadingPage';
import ScorePage from './pages/ScorePage';

const App: React.FC = () => {
  return (
    <GreenScoreProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GreenScoreProvider>
  );
};

export default App;