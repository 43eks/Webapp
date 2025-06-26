// src/components/CharacterAvatar.jsx
// -----------------------------------------------------------------------------
// キャラクターアバター – バックエンドが落ちていても UI を壊さない安全版
// -----------------------------------------------------------------------------
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../App";
import "./CharacterAvatar.css";

/* ---------------- モーション設定 ---------------- */
const moodVariants = {
  happy: { y: [0, -8, 0], rotate: [0, 2, 0] },
  sad: { y: [0, -4, 0], rotate: [0, 0, 0] },
  angry: { y: [0, -6, 0], rotate: [0, -4, 0] },
  calm: { y: [0, -2, 0], rotate: [0, 0, 0] },
};
const moodTransition = {
  happy: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  sad: { repeat: Infinity, duration: 3, ease: "linear" },
  angry: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  calm: { repeat: Infinity, duration: 4, ease: "easeInOut" },
};

const STORAGE_KEY = "characterComments";
const FALLBACK_IMG = "https://placekitten.com/160/160"; // オフライン時のプレースホルダ

export default function CharacterAvatar({ initialMood = "happy" }) {
  const [images, setImages] = useState([]);
  const [idx, setIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState(initialMood);
  const [error, setError] = useState(false);

  /* ---------------- 画像 + コメント読み込み ---------------- */
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/character`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(res.status);
        const json = await res.json();
        const urls = json.map((u) => (u.startsWith("http") ? u : `${API_BASE_URL}${u}`));
        if (!urls.length) throw new Error("empty");
        setImages(urls);

        // コメント
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setComments(urls.map((_, i) => saved[i] || ""));
      } catch (e) {
        console.error("Avatar fetch failed:", e);
        // フォールバック: 1 枚だけ placeholder を表示
        setImages([FALLBACK_IMG]);
        setComments([""]);
        setError(true);
      }
    };
    load();

    return () => controller.abort();
  }, []);

  /* ---------------- コメント編集 ---------------- */
  const beginEdit = () => {
    setDraft(comments[idx]);
    setEditing(true);
  };
  const finishEdit = () => {
    const updated = [...comments];
    updated[idx] = draft;
    setComments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
  };

  /* ---------------- キャラクター切替 ---------------- */
  const nextCharacter = useCallback(() => {
    if (!images.length) return;
    const ni = (idx + 1) % images.length;
    setIdx(ni);
    const moods = Object.keys(moodVariants);
    setMood(moods[ni % moods.length]);
    setEditing(false);
  }, [idx, images]);

  if (!images.length) return null;

  return (
    <motion.div
      className="character-avatar"
      onClick={nextCharacter}
      animate={moodVariants[mood]}
      transition={moodTransition[mood]}
      style={{ position: "fixed", bottom: 20, right: 20, cursor: "pointer", zIndex: 99 }}
    >
      {/* スピーチバブル */}
      <div
        className="speech-bubble"
        onDoubleClick={(e) => {
          e.stopPropagation();
          beginEdit();
        }}
      >
        {editing ? (
          <input
            className="speech-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => e.key === "Enter" && finishEdit()}
            autoFocus
          />
        ) : (
          comments[idx] || (error ? "オフライン中…" : "（ダブルクリックでコメント追加）")
        )}
        <div className="speech-arrow" />
      </div>

      {/* キャラクター画像 */}
      <img src={images[idx]} alt="avatar" className={`character-image mood-${mood}`} />
    </motion.div>
  );
}