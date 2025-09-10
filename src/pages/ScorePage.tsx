import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HomeButton from '../components/HomeButton';
import { useGreenScore } from '../context/GreenScoreContext';

// Lazy-load heavy components so initial paint is fast
const MapViewLazy = React.lazy(() => import('../components/MapView'));
const ScoreDetailsLazy = React.lazy(() => import('../components/ScoreDetails'));

const ScorePage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { zip, result, error, loading, setZip, setResult, setError, setLoading } = useGreenScore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Support deep-linking: /score?zip=77005
  useEffect(() => {
    const urlZip = params.get('zip');
    if (!urlZip) return;
    if (result && zip === urlZip) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/green-score?zip=${encodeURIComponent(urlZip)}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        if (json?.error) {
          setError('No data found for this zipcode.');
          setResult(null);
        } else {
          setZip(urlZip);
          setResult(json);
          setError(null);
        }
      } catch (e) {
        setError('Failed to load score. Please try again.');
        setResult(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleAnother = () => {
    setZip('');
    setResult(null);
    setError(null);
    navigate('/input');
  };

  if (loading) {
    return (
      <div style={{
        display:'flex',justifyContent:'center',alignItems:'center',
        height:'100svh',background:'#000A23',color:'#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      className="score-root"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        width: '100%',
        height: '100svh',
        background: '#000A23',
        color: '#fff'
      }}
    >
      {/* Home */}
      <HomeButton />

      {/* LEFT: Map */}
      <div style={{ position:'relative', minHeight: isMobile ? '40vh' : '100%' }}>
        {result ? (
          <Suspense fallback={<div style={{ padding:'2rem' }}>Loading map…</div>}>
            <MapViewLazy center={result.coordinates} highlightRadiusM={6000} />
          </Suspense>
        ) : (
          <div style={{ padding:'2rem' }}>No location data available.</div>
        )}
      </div>

      {/* RIGHT: Stats panel */}
      <div
        className="stats-panel"
        style={{
          position:'relative',
          display:'grid',
          gridTemplateRows:'auto 1fr auto',
          minHeight: 0,
          background:'rgba(0, 0, 50, 0.58)',
          backdropFilter:'blur(6px)',
          WebkitBackdropFilter:'blur(6px)',
          borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
          borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {/* Header */}
        <div style={{ padding:'1.1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ margin:0, fontSize:'1.25rem', fontWeight:700 }}>
            {zip ? `ECO-SCORE FOR ${zip}` : 'ECO-SCORE'}
          </h2>
          {!!error && <div style={{ color:'#ff6b6b', marginTop:'0.5rem' }}>No data found for this zipcode.</div>}
        </div>

        {/* Scrollable stats */}
        <div
          className="stats-scroll"
          style={{
            minHeight: 0,
            overflowY: 'auto',
            padding: '1rem 1.25rem'
          }}
        >
          {result ? (
            <Suspense fallback={<div style={{ color:'#ccc' }}>Loading details…</div>}>
              <ScoreDetailsLazy result={result} />
            </Suspense>
          ) : (
            <div style={{ color:'#ccc' }}>No result to display.</div>
          )}
        </div>

        {/* Actions row */}
        <div
          style={{
            position:'sticky',
            bottom:0,
            padding:'0.9rem 1.25rem 1.1rem',
            borderTop:'1px solid rgba(255,255,255,0.08)',
            background:'linear-gradient(to bottom, rgba(0,0,40,0.42), rgba(0,0,40,0.78))',
            display:'flex',
            gap:'0.75rem',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}
        >
          <button
            onClick={handleAnother}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: 14,
              border: '1px solid rgba(0, 255, 200, 0.6)',
              background: 'linear-gradient(135deg, rgba(0,191,255,0.25), rgba(0,255,200,0.25))',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              cursor: 'pointer',
              boxShadow:
                '0 0 20px rgba(0, 255, 200, 0.45), 0 0 40px rgba(0, 191, 255, 0.25)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
              transition: 'all 0.25s ease'
            }}
          >
            calculate another score
          </button>
        </div>
      </div>

      {/* Grid CSS for ScoreDetails root */}
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.25rem;
          align-content: start;
        }
        .stats-grid > * { min-width: 0; }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .score-root * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ScorePage;
