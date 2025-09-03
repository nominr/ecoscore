import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import spaceShip from './space-ship.png'; 

// Generate keyframes along an arc (in local pixels)
function arcPoints(size: number, startDeg = 210, endDeg = 510, steps = 100) {
  const r = size * 0.65;              
  const cx = size / 2;
  const cy = size / 2;
  const xs: number[] = [];
  const ys: number[] = [];
  const rots: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const deg = startDeg + (endDeg - startDeg) * t; 
    const rad = (deg * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    xs.push(x);
    ys.push(y);
    rots.push((rad * 180) / Math.PI + 90); 
  }
  return { xs, ys, rots };
}

const OrbitingShip: React.FC<{ parentSize: number }> = ({ parentSize }) => {
  // build the arc once per size
  const { xs, ys, rots } = useMemo(() => arcPoints(parentSize), [parentSize]);

  const anim = {
    x: xs,
    y: ys,
    rotate: rots,
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2
      }}
    >
      {/* trailing ghosts for a glow */}
      <motion.img
        src={spaceShip}
        alt=""
        style={{ position: 'absolute', width: parentSize * 0.12, opacity: 0.2, filter: 'blur(2px) drop-shadow(0 0 10px rgba(0,255,255,.6))' }}
        animate={anim}
        transition={{ ...anim.transition, delay: 0.12 }}
      />
      <motion.img
        src={spaceShip}
        alt=""
        style={{ position: 'absolute', width: parentSize * 0.125, opacity: 0.3, filter: 'blur(1px) drop-shadow(0 0 12px rgba(0,255,255,.8))' }}
        animate={anim}
        transition={{ ...anim.transition, delay: 0.06 }}
      />
      <motion.img
        src={spaceShip}
        alt=""
        style={{ position: 'absolute', width: parentSize * 0.13, filter: 'drop-shadow(0 0 14px rgba(0,255,255,1))' }}
        animate={anim}
      />
    </div>
  );
};

export default OrbitingShip;
