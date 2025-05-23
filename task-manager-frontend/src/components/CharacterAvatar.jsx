// src/components/CharacterAvatar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './CharacterAvatar.css';

function CharacterAvatar({ imageUrl = '/character/idle.png', message = '', mood = 'normal' }) {
  const moodClass = `character-image ${mood}`;

  return (
    <motion.div
      className="character-avatar"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {message && <div className="speech-bubble">{message}</div>}
      <img src={imageUrl} alt="キャラクター" className={moodClass} />
    </motion.div>
  );
}

export default CharacterAvatar;