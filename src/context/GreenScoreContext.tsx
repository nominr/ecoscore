import React, { useContext } from 'react';
import type { GreenScoreResponse } from '../types';

/**
 * View model state for the green score flow. Keeping state in a
 * React context decouples pages from one another and avoids prop
 * drilling. Each page can subscribe to relevant fields via the hook
 * provided below.
 */
export interface GreenScoreState {
  zip: string;
  setZip: (zip: string) => void;
  result: GreenScoreResponse | null;
  setResult: (result: GreenScoreResponse | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const GreenScoreContext = React.createContext<GreenScoreState | undefined>(undefined);

export const GreenScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zip, setZip] = React.useState('');
  const [result, setResult] = React.useState<GreenScoreResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const value: GreenScoreState = {
    zip,
    setZip,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
  };
  return <GreenScoreContext.Provider value={value}>{children}</GreenScoreContext.Provider>;
};

export const useGreenScore = (): GreenScoreState => {
  const ctx = useContext(GreenScoreContext);
  if (!ctx) {
    throw new Error('useGreenScore must be used within a GreenScoreProvider');
  }
  return ctx;
};