import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from '../components/Globe';
import { INPUT_GLOBE } from '../components/globePresets';
import HomeButton from '../components/HomeButton';
import { motion } from 'framer-motion';
import { useGreenScore } from '../context/GreenScoreContext';
import Stars from '../components/Stars';
import OrbitingShip from '../components/OrbitingShip';

const renderBouncyTitle = (text: string) => {
  const words = text.trim().split(/\s+/);
  let idx = 0;

  return words.flatMap((word, wi) => {
    const el = (
      <span key={`w-${wi}`} className="title-word">
        {Array.from(word).map((ch, ci) => {
          const delay = -(idx++ * 0.01);
          return (
            <span
              key={`w-${wi}-c-${ci}`}
              className="bounce-letter"
              style={{ animationDelay: `${delay}s` }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
    return wi < words.length - 1 ? [el, ' '] : [el];
  });
};


const ZIP_RE = /^\d{5}$/;

async function verifyZipExists(zip: string, timeoutMs = 3000): Promise<boolean> {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(tid);
  }
}

const Sizer: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setPx(Math.floor(Math.min(width, height)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
      {px > 0 && <OrbitingShip parentSize={px} />}
    </div>
  );
};

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const { setZip, setResult, setError } = useGreenScore();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [checkingZip, setCheckingZip] = useState(false);
  const [zipErr, setZipErr] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const zip = value.trim();

    if (!ZIP_RE.test(zip)) {
      setZipErr('Please enter a valid 5-digit U.S. ZIP code.');
      return;
    }

    setZipErr(null);
    setCheckingZip(true);

    const exists = await verifyZipExists(zip);

    setCheckingZip(false);

    if (!exists) {
      setZipErr('That ZIP code does not exist. Please try another.');
      return;
    }

    setZip(zip);
    setResult(null);
    setError(null);
    navigate('/loading');
  };

  const title = 'calculate an eco-score:';
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',             
        overflowY: 'auto',               
        overflowX: 'clip',
        background: '#000A23',
        color: '#fff'
      }}
    >

      {/* Animations + Button Styles */}
      <style>{`
        @keyframes letterBounce {
          0%, 100% { transform: translateY(0); }
          30%     { transform: translateY(-14px); }
        }
        .bounce-letter {
          display: inline-block;
          animation: letterBounce 1.25s ease-in-out infinite;
          will-change: transform;
        }

        .title-word {
          display: inline-flex;        
          flex-wrap: nowrap;
          white-space: nowrap;         
        }

        .title-head {
          line-height: 1.2;
          /* nicer line breaks for headings on modern browsers */
          text-wrap: balance;          
        }

        .glass-button {
          position: relative;
          padding: 1rem 2.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-radius: 14px;
          color: #fff;
          background: rgba(0, 40, 80, 0.18);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 0 12px rgba(0, 255, 255, 0.3),
                      inset 0 0 8px rgba(0, 200, 255, 0.2);
        }

        .glass-button::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0,255,255,0.25) 0%, transparent 60%);
          transform: rotate(25deg);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .glass-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.7),
                      inset 0 0 10px rgba(0, 200, 255, 0.3);
        }

        .glass-button:hover::before {
          opacity: 1;
        }

        .glass-button:active {
          transform: scale(0.95);
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.6),
                      inset 0 0 12px rgba(0, 200, 255, 0.4);
        }
      `}</style>
      
      {/* Subtle starfield behind everything */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Stars count={160} opacity={0.45} />
      </div>

      {/* Layout: left (globe) | right (form) */}
      <div className="input-grid" style={{
        position:'relative',
        zIndex:1,
        display:'grid',
        gridTemplateColumns:'1fr 1.5fr',
        minHeight: '100%',
        alignItems: 'center', 
        paddingBlock: 'clamp(8px, 2vh, 24px)',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
      }}>

        {/* LEFT: Globe lives in the left grid cell */}
        <div className="globe-col"
          style={{
            display: 'flex',
            justifyContent: 'center', 
            paddingLeft: 'clamp(12px, 4vw, 56px)', 
            overflow: 'visible',
          }}>

            <div
              className="globe-wrap"
              style={{
                position: 'relative',
                width: 'min(42vmin, calc(100svh - 200px))',
                aspectRatio: '1/1'
              }}
            >
              <div className="globe-frame" style={{ 
                width: 'min(42vmin, calc(100svh - 200px))', 
                aspectRatio: '1/1', 
                borderRadius: '50%', 
                overflow: 'hidden' }}>
                <Globe maxSize={2000} controls={INPUT_GLOBE} />
              </div>

              {/* Orbiting ship overlay (hidden on narrow phones) */}
              <div className="ship-layer" style={{ position: 'absolute', inset: 0 }}>
                {/* Use ResizeObserver to detect pixel size and render ship */}
                <Sizer />
              </div>
            </div>
          </div>

        {/* RIGHT: Inputs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: 'min(520px, 92%)',
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}
            >
              {renderBouncyTitle(title)}
            </motion.h2>

            <p style={{ margin: 0, opacity: 0.8, marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Enter any 5-digit U.S. ZIP code.
              <br />
              <small style={{ opacity: 0.7 }}>
                This tool calculates how 'green' your neighborhood is through consideration of the following factors: air quality, tree canopy cover, pavement percentage, flood risk, traffic conditions, number toxic sites, and green spaces. Of course, these aren't the only factors to consider, but these are a good starting point. You can read about the selection of these parameters and calculation of the score <b>here.</b>
                <br />
                <br />
                First-time lookups outside Greater Houston may take up to ~15 seconds.
              </small>
            </p>

            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{5}"
                placeholder="ZIP code (e.g., 77005)"
                maxLength={5}
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ''))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: 12,
                  border: focused ? '2px solid #00BFFF' : '2px solid rgba(255,255,255,0.18)',
                  background: 'rgba(0, 40, 80, 0.24)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: focused
                    ? '0 0 0 6px rgba(0,191,255,0.12), inset 0 0 12px rgba(0,191,255,0.12)'
                    : 'inset 0 0 8px rgba(255,255,255,0.06)',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
                  aria-invalid={!!zipErr}
                  aria-describedby="zip-help"   
              />
              {zipErr && (
                <div id="zip-help" style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                  {zipErr}
                </div>
              )}

              {/* Glass panel submit button to match Home style */}
              <motion.button
                type="submit"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  padding: '0.95rem 1.2rem',
                  borderRadius: 12,
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  background: 'rgba(0, 40, 80, 0.22)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: 'pointer',
                  boxShadow:
                    '0 0 14px rgba(0, 255, 255, 0.28), inset 0 0 10px rgba(0, 200, 255, 0.22)',
                  backdropFilter: 'blur(10px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                }}
                disabled={checkingZip}
              >
                {checkingZip ? 'CHECKING…' : 'CALCULATE'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Home button (top-left) */}
      <HomeButton />

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 900px) {
          .input-grid { grid-template-columns: 1fr; }
          .globe-col { justify-content: center; padding-left: 0; }
          .globe-frame { width: min(60vmin, calc(100svh - 220px)); }
        }
        @media (max-width: 520px) {
          .globe-col { display: none; } /* disappear on small phones */
        }
          
        @media (max-width: 900px) {
          .left-col { /* add class to the left <div> if you like */
            display: grid !important;
            place-items: center !important;
          }
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="border-right"] {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 1.25rem 0.75rem !important;
          }
          form {
            text-align: center;
          }
        }

        @media (max-width: 520px) {
          .ship-layer { display: none; }   /* no animation on tiny phones */
        }
        @media (prefers-reduced-motion: reduce) {
          .ship-layer { display: none; }
        }
      `}</style>
    </div>
  );
};

export default InputPage;