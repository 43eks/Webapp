// src/components/CharacterAvatar.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../App';
import './CharacterAvatar.css';

const moodVariants = {
  happy: { y: [0, -8, 0], rotate: [0, 2, 0] },
  sad:   { y: [0, -4, 0], rotate: [0, 0, 0] },
  angry: { y: [0, -6, 0], rotate: [0, -4, 0] },
  calm:  { y: [0, -2, 0], rotate: [0, 0, 0] },
};

const moodTransition = {
  happy: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  sad:   { repeat: Infinity, duration: 3, ease: 'linear' },
  angry: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  calm:  { repeat: Infinity, duration: 4, ease: 'easeInOut' },
};

function CharacterAvatar({ message = 'こんにちは！', mood = 'happy' }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(images => {
        if (images.length > 0) {
          const url = images[0].startsWith('http')
            ? images[0]
            : `${API_BASE_URL}${images[0]}`;
          setImageUrl(url);
        }
      })
      .catch(err => console.error('❌ キャラクター画像の取得失敗:', err));
  }, []);

  if (!imageUrl) return null;

  return (
    <motion.div
      className="character-avatar"
      animate={moodVariants[mood] || moodVariants.happy}
      transition={moodTransition[mood] || moodTransition.happy}
    >
      <div className="speech-bubble">
        {message}
        <div className="speech-arrow" />
      </div>
      <img
        src={imageUrl}
        alt="キャラクター"
        className={`character-image mood-${mood}`}
      />
    </motion.div>
  );
}

export default CharacterAvatar;