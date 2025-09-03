import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeButton from '../components/HomeButton';
import Stars from '../components/Stars';
import { useGreenScore } from '../context/GreenScoreContext';
import GreenScoreService from '../services/GreenScoreService';
import spaceShip from '../components/space-ship.png';

// Generate keyframes along a quadratic Bezier curve (start S, control C, end E)
function bezierPoints(S: [number, number], C: [number, number], E: [number, number], steps = 80) {
  const xs: number[] = [];
  const ys: number[] = [];
  const rots: number[] = [];
  let prevX = 0, prevY = 0;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * S[0] + 2 * mt * t * C[0] + t * t * E[0];
    const y = mt * mt * S[1] + 2 * mt * t * C[1] + t * t * E[1];

    // derivative for orientation
    const dx = 2 * mt * (C[0] - S[0]) + 2 * t * (E[0] - C[0]);
    const dy = 2 * mt * (C[1] - S[1]) + 2 * t * (E[1] - C[1]);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    xs.push(x);
    ys.push(y);
    rots.push(angleDeg + 90); // +90 so the sprite "points" along path (tweak if needed)
    prevX = x; prevY = y;
  }
  return { xs, ys, rots };
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { zip, setResult, setLoading, setError } = useGreenScore();

  // Kick off fetch on mount (unchanged)
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      if (!zip) { navigate('/input'); return; }
      setLoading(true);
      try {
        const data = await GreenScoreService.fetchGreenScore(zip, 30000);
        if (!isCancelled) {
          setResult(data);
          setError(null);
          setLoading(false);
          navigate('/score');
        }
      } catch (err: any) {
        if (!isCancelled) {
          const isAbort = err && (err.name === 'AbortError' || err.message?.includes('The user aborted'));
          const message = isAbort ? 'Request timed out. Please try again.' : (err?.message || 'An unexpected error occurred');
          setError(message);
          setLoading(false);
          navigate('/score');
        }
      }
    };
    fetchData();
    return () => { isCancelled = true; };
  }, [zip, navigate, setResult, setError, setLoading]);

  // Build the path keyframes based on current viewport
  const { xs, ys, rots } = useMemo(() => {
    const vw = Math.max(window.innerWidth, 360);
    const vh = Math.max(window.innerHeight, 480);

    // Start near bottom-left, apex near top-center, end near bottom-right
    const S: [number, number] = [0.08 * vw, 0.88 * vh];
    const C: [number, number] = [0.50 * vw, 0.16 * vh]; // raise/lower the arc by changing 0.16
    const E: [number, number] = [0.92 * vw, 0.88 * vh];

    return bezierPoints(S, C, E, 90);
  }, []);

  // Shared animation config: ping-pong forever
  const anim = {
    x: xs,
    y: ys,
    rotate: rots,
    transition: {
      duration: 3.8,
      ease: 'easeInOut',
      repeat: 100000000 as const,
      repeatType: 'reverse' as const // go back down the curve
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        background: '#000A23',
        color: '#fff'
      }}
    >
      
      {/* stars */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Stars count={160} opacity={0.45} />
      </div>

      {/* title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontSize: '1.2rem',
          zIndex: 2
        }}
      >
        CALCULATING YOUR ECO-SCORE...
      </motion.h2>

      {/* Ship + neon trail (two ghost copies with delays) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        {/* Ghost 2 (farthest / faintest) */}
        <motion.img
          src={spaceShip}
          alt=""
          style={{
            position: 'absolute',
            width: 60,
            filter: 'blur(2px) drop-shadow(0 0 8px rgba(0,255,255,0.45))',
            opacity: 0.18
          }}
          animate={anim}
          transition={{ ...anim.transition, delay: 0.16 }}
        />
        {/* Ghost 1 */}
        <motion.img
          src={spaceShip}
          alt=""
          style={{
            position: 'absolute',
            width: 64,
            filter: 'blur(1.2px) drop-shadow(0 0 10px rgba(0,255,255,0.6))',
            opacity: 0.28
          }}
          animate={anim}
          transition={{ ...anim.transition, delay: 0.08 }}
        />
        {/* Main ship */}
        <motion.img
          src={spaceShip}
          alt=""
          style={{
            position: 'absolute',
            width: 72,
            filter: 'drop-shadow(0 0 14px rgba(0,255,255,0.75))'
          }}
          animate={anim}
        />
      </div>

      {/* home */}
      <HomeButton />

      {/* Mobile tuning */}
      <style>{`
        @media (max-width: 600px) {
          h2 { font-size: 1.05rem !important; }
          img[alt=""] { width: 56px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          img[alt=""] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
