import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GreenScoreProvider } from './context/GreenScoreContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

// Lazily load pages to reduce bundle size on the initial route.
const HomePage    = lazy(() => import('./pages/HomePage'));
const InputPage   = lazy(() => import('./pages/InputPage'));
const LoadingPage = lazy(() => import('./pages/LoadingPage'));
const ScorePage   = lazy(() => import('./pages/ScorePage'));

const App: React.FC = () => {
  return (
    <GreenScoreProvider>
    <Analytics />
    <SpeedInsights />
      {/* Suspense fallback ensures a blank screen while chunks load; adjust fallback as needed */}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </GreenScoreProvider>
  );
};

export default App;