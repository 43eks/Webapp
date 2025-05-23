// src/components/CharacterAvatar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './CharacterAvatar.css';

function CharacterAvatar() {
  return (
    <motion.div
      className="character-avatar"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="avatar-wrapper">
        <img src="/character/idle.png" alt="キャラクター" className="avatar-img" />
        <div className="speech-bubble">こんにちは！</div>
      </div>
    </motion.div>
  );
}

export default CharacterAvatar;