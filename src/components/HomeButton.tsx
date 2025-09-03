import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeButton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        navigate('/');
      }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        padding: 'clamp(0.6rem, 2.8vw, 0.75rem) clamp(0.9rem, 4.2vw, 1.2rem)',
        borderRadius: 12,
        border: '1px solid rgba(0, 255, 255, 0.4)',
        background: 'rgba(0, 40, 80, 0.22)',
        color: '#fff',
        fontSize: 'clamp(0.8rem, 3.6vw, 0.95rem)',
        fontWeight: 700,
        letterSpacing: 1,
        cursor: 'pointer',
        boxShadow:
          '0 0 14px rgba(0, 255, 255, 0.28), inset 0 0 10px rgba(0, 200, 255, 0.22)',
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
        zIndex: 10,
        ...style,
      }}
    >
      HOME
    </motion.button>
  );
};

export default HomeButton;