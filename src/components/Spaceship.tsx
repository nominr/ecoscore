import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  src: string;            
  alt?: string;
  size?: number;          
  style?: React.CSSProperties;
  onVanish?: () => void;  
};

const Spaceship: React.FC<Props> = ({ src, alt = 'spaceship', size = 120, style, onVanish }) => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{
            position: 'absolute',
            userSelect: 'none',
            cursor: 'pointer',
            ...style,
          }}
          initial={{ scale: 1, opacity: 1, rotate: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          exit={{
            scale: 0,
            opacity: 0,
            rotate: 40,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }}
          onAnimationComplete={() => {
            if (!visible && onVanish) onVanish();
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default Spaceship;
