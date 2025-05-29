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

const STORAGE_KEY = 'characterComments';

export default function CharacterAvatar({ initialMood = 'happy' }) {
  const [images, setImages] = useState([]);
  const [idx, setIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [mood, setMood] = useState(initialMood);

  // 画像と保存済コメントの読み込み
  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => res.json())
      .then(imgs => {
        const urls = imgs.map(u => u.startsWith('http') ? u : `${API_BASE_URL}${u}`);
        setImages(urls);

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        // 画像の数だけコメント配列を初期化
        const filled = urls.map((_, i) => saved[i] || '');
        setComments(filled);
      })
      .catch(console.error);
  }, []);

  // 吹き出しダブルクリックで編集開始
  const beginEdit = () => {
    setDraft(comments[idx]);
    setEditing(true);
  };

  // 編集確定
  const finishEdit = () => {
    const updated = [...comments];
    updated[idx] = draft;
    setComments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
  };

  // クリックで次のキャラクターへ
  const nextCharacter = () => {
    if (!images.length) return;
    const ni = (idx + 1) % images.length;
    setIdx(ni);
    // ムードも順番に切り替え
    const moods = Object.keys(moodVariants);
    setMood(moods[ni % moods.length]);
    setEditing(false);
  };

  if (!images.length) return null;

  return (
    <motion.div
      className="character-avatar"
      onClick={nextCharacter}
      animate={moodVariants[mood]}
      transition={moodTransition[mood]}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="speech-bubble"
        onDoubleClick={e => {
          e.stopPropagation();
          beginEdit();
        }}
      >
        {editing ? (
          <input
            className="speech-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={e => e.key === 'Enter' && finishEdit()}
            autoFocus
          />
        ) : (
          comments[idx] || '（ダブルクリックでコメント追加）'
        )}
        <div className="speech-arrow" />
      </div>
      <img
        src={images[idx]}
        alt="キャラクター"
        className={`character-image mood-${mood}`}
      />
    </motion.div>
  );
}