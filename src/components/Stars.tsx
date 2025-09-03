import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Stars: React.FC<{ count?: number; zIndex?: number; opacity?: number }> = ({ count = 140, zIndex = -1, opacity = 0.6 }) => {
  const stars = useMemo(
    () => Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 5,
      driftX: (Math.random() - 0.5) * 8,
      driftY: (Math.random() - 0.5) * 8,
    })),
    [count]
  );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: opacity * 0.4 }}
          animate={{ x: [0, s.driftX, 0], y: [0, s.driftY, 0], opacity: [opacity * 0.3, opacity, opacity * 0.3] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
          }}
        />
      ))}
    </div>
  );
};
export default Stars;
