// src/components/CharacterAvatar.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../App';
import './CharacterAvatar.css';

function CharacterAvatar() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => res.json())
      .then(images => {
        if (images.length > 0) {
          // サーバーからの画像URLが "/uploads/filename.png" 形式で来る前提
          setImageUrl(images[0].startsWith('http') ? images[0] : `${API_BASE_URL}${images[0]}`);
        }
      })
      .catch(err => console.error('❌ キャラクター画像の取得失敗:', err));
  }, []);

  if (!imageUrl) return null;

  return (
    <motion.div
      className="character-avatar"
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <img src={imageUrl} alt="キャラクター" className="character-image" />
    </motion.div>
  );
}

export default CharacterAvatar;