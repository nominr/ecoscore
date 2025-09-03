import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated text component that bounces individual characters.
 *
 * This component replaces the previous shimmer effect. It splits
 * the provided children into characters (when children is a string)
 * and applies a slight vertical bounce animation to each letter
 * with staggered delays. Spaces are rendered normally without
 * animation. When hovered, letters scale up a bit for interactivity.
 */
type Props = {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const ShimmerText: React.FC<Props> = ({ as: Tag = 'div', children, style, className }) => {
  const content = typeof children === 'string' ? children : String(children);
  const letters = React.useMemo(() => Array.from(content), [content]);

  return (
    <Tag className={className} style={{ ...style, display: 'inline-block' }}>
      {letters.map((char, idx) => {
        if (char === ' ') {
          return <span key={idx} style={{ whiteSpace: 'pre' }}>{char}</span>;
        }
        return (
          <motion.span
            key={idx}
            style={{ display: 'inline-block' }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              delay: idx * 0.05,
              repeat: Infinity,
              repeatDelay: letters.length * 0.05,
            }}
            whileHover={{ scale: 1.1 }}
          >
            {char}
          </motion.span>
        );
      })}
    </Tag>
  );
};

export default ShimmerText;
