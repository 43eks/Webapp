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

function CharacterAvatar({ initialMood = 'happy' }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [mood, setMood] = useState(initialMood);

  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(imgs => {
        // サーバーが "/uploads/xxx.png" を返す想定
        const fullUrls = imgs.map(raw =>
          raw.startsWith('http') ? raw : `${API_BASE_URL}${raw}`
        );
        setImages(fullUrls);

        // 画像数に合わせたコメント配列（デフォルト）
        setComments(fullUrls.map((_, i) => `メッセージ ${i + 1}`));
      })
      .catch(err => console.error('❌ キャラクター画像の取得失敗:', err));
  }, []);

  const handleClick = () => {
    if (images.length === 0) return;
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);

    // ムードもコメントに合わせて変えたい場合はここで設定
    // 例: happy, sad, angry, calm を順にループ
    const moods = Object.keys(moodVariants);
    setMood(moods[next % moods.length]);
  };

  if (images.length === 0) return null;

  return (
    <motion.div
      className="character-avatar"
      animate={moodVariants[mood] || moodVariants.happy}
      transition={moodTransition[mood] || moodTransition.happy}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="speech-bubble">
        {comments[currentIndex]}
        <div className="speech-arrow" />
      </div>
      <img
        src={images[currentIndex]}
        alt="キャラクター"
        className={`character-image mood-${mood}`}
      />
    </motion.div>
  );
}

export default CharacterAvatar;