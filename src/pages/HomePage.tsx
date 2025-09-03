import React from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from '../components/Globe';
import { HOME_GLOBE } from '../components/globePresets';
import { motion } from 'framer-motion';
import Stars from '../components/Stars';

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const title = 'welcome to eco-score!';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',  
        overflow: 'hidden',
        background: '#000A23',
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
        .glass-button:hover::before { opacity: 1; }
        .glass-button:active {
          transform: scale(0.95);
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.6),
                      inset 0 0 12px rgba(0, 200, 255, 0.4);
        }

        .globe-frame canvas { display: block; background: transparent !important; }
        /* soft outer glow so the circle edge isn’t harsh */
        .globe-frame::after{
          content:'';
          position:absolute; inset:-8%;
          border-radius:50%;
          pointer-events:none;
          background: radial-gradient(circle, rgba(10,132,255,.25) 0%, rgba(10,132,255,0) 60%);
          mix-blend-mode: screen;
      `}</style>

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Stars count={250} opacity={0.55} />
      </div>

      {/* Globe (centered & large) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {/* Circular frame that clips the canvas */}
        <div
          className="globe-frame"
          style={{
            width: 'clamp(360px, min(95svh, 95vw), 1400px)',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            overflow: 'hidden',            // << clip the square
            position: 'relative'
          }}
        >
          <Globe maxSize={2400} controls={HOME_GLOBE} />
        </div>
      </div>


      {/* vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 40%), radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          width: '100%',
          textAlign: 'center',
          color: '#ffffff',
          padding: '0 1rem',
          zIndex: 3,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontSize: '2.5rem', fontWeight: 700 }}
        >
          {renderBouncyTitle(title)}
        </motion.h1>
      </div>

      {/* Glass Start Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          width: '100%',
          textAlign: 'center',
          zIndex: 3,
        }}
      >
        <motion.button
          className="glass-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          onClick={() => navigate('/input')}
        >
          START
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;