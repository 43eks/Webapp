// src/components/CharacterAvatar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './CharacterAvatar.css';

function CharacterAvatar() {
  const imageUrl = 'http://localhost:8080/uploads/idle.png'; // ✅ ここが最重要ポイント！

  return (
    <motion.div
      className="character-avatar"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <img src={imageUrl} alt="キャラクター" className="character-image" />
      <div className="character-speech-bubble">こんにちは！</div>
    </motion.div>
  );
}

export default CharacterAvatar;