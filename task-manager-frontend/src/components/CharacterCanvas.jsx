import React from 'react';
import { motion } from 'framer-motion';
import { useDragControls, motion as m } from 'framer-motion';

const personalityVariants = {
  energetic: {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { repeat: Infinity, duration: 2 },
    },
  },
  calm: {
    animate: {
      y: [0, 5, 0],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
    },
  },
  shy: {
    animate: {
      opacity: [1, 0.7, 1],
      scale: [1, 0.95, 1],
      transition: { repeat: Infinity, duration: 2 },
    },
  },
};

const CharacterCanvas = ({ imageUrl, personality = 'energetic' }) => {
  const controls = useDragControls();

  return (
    <div style={{ position: 'relative', height: '80vh', background: '#eef' }}>
      <m.div
        drag
        dragControls={controls}
        dragMomentum={false}
        style={{ width: 150, height: 150, cursor: 'grab', position: 'absolute', top: 100, left: 100 }}
      >
        <motion.img
          src={imageUrl}
          alt="キャラクター"
          width={150}
          height={150}
          {...personalityVariants[personality]}
          initial="animate"
          animate="animate"
          style={{ borderRadius: '50%' }}
        />
      </m.div>
    </div>
  );
};

export default CharacterCanvas;