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

const COMMENTS_STORAGE_KEY = 'characterComments';

function CharacterAvatar({ initialMood = 'happy' }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [mood, setMood] = useState(initialMood);

  // 画像一覧とコメントの初期化
  useEffect(() => {
    // 1) 画像取得
    fetch(`${API_BASE_URL}/character`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(imgs => {
        const fullUrls = imgs.map(raw =>
          raw.startsWith('http') ? raw : `${API_BASE_URL}${raw}`
        );
        setImages(fullUrls);

        // 2) 保存済コメントを localStorage から読み込み
        const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
        let arr = [];
        if (saved) {
          try { arr = JSON.parse(saved); }
          catch {}
        }
        // 3) 画像数に合わせ、足りない分は空文字で埋める
        const filled = fullUrls.map((_, i) => arr[i] ?? '');
        setComments(filled);
      })
      .catch(err => console.error('❌ キャラクター画像の取得失敗:', err));
  }, []);

  // コメント編集開始
  const startEdit = () => {
    setEditText(comments[currentIndex]);
    setEditing(true);
  };

  // コメントを保存
  const saveComment = () => {
    const updated = comments.slice();
    updated[currentIndex] = editText;
    setComments(updated);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
  };

  // 画像切り替え
  const handleClick = () => {
    if (images.length === 0) return;
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setEditing(false);
    // ムードも順次切り替え
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
      <div className="speech-bubble" onDoubleClick={startEdit}>
        {editing ? (
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={saveComment}
            onKeyDown={e => e.key === 'Enter' && saveComment()}
            autoFocus
            style={{ width: '100%', fontSize: '14px' }}
          />
        ) : (
          comments[currentIndex] || '（ダブルクリックでコメントを追加）'
        )}
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