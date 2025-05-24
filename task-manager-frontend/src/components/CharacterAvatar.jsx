// src/components/CharacterAvatar.jsx
import React from 'react';
import './CharacterAvatar.css';
import { motion } from 'framer-motion';

function CharacterAvatar({ image = '/uploads/idle.png', message = 'こんにちは！' }) {
  return (
    <div className="character-container">
      <motion.img
        src={image}
        alt="キャラクター"
        className="character-image"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="character-bubble">{message}</div>
    </div>
  );
}

export default CharacterAvatar;