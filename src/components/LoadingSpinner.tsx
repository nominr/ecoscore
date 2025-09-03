import React from 'react';
import { motion } from 'framer-motion';

/**
 * A custom loading spinner that animates an arrow along a curved path.
 * While not a perfect match to the mockup, it provides a subtle
 * indication of progress using SVG path animations. The path
 * repeatedly draws from left to right and resets.
 */
const LoadingSpinner: React.FC<{ width?: number; height?: number }> = ({ width = 300, height = 150 }) => {
  const path = 'M10 ' + (height - 20) +
    ' C ' + width * 0.3 + ' 10, ' + width * 0.6 + ' 10, ' + (width - 20) + ' ' + (height - 20);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <motion.svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        initial={{}}
        animate={{}}
      >
        {/* The line */}
        <motion.path
          d={path}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1000}
          strokeDashoffset={1000}
          animate={{ strokeDashoffset: [1000, 0] }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.svg>
    </div>
  );
};

export default LoadingSpinner;