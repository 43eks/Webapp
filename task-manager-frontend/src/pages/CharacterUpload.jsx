// src/pages/CharacterUpload.jsx
import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../App';
import './CharacterUpload.css';

function CharacterUpload() {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // サーバー上の画像一覧を取得
  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/character`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUploadedImages(data);
    } catch (err) {
      console.error('画像取得失敗:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ファイル選択
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // アップロード
  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert('アップロード成功！');
      fetchImages();
      // ファイル選択をクリア
      fileInputRef.current.value = '';
      setFiles([]);
    } catch (err) {
      console.error('アップロード失敗:', err);
      alert('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  // 削除
  const handleDelete = async (url) => {
    const filename = url.split('/').pop();
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/character/${filename}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchImages();
    } catch (err) {
      console.error('削除失敗:', err);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="upload-container">
      <h2>🧍 キャラクター画像アップロード</h2>

      <div className="upload-form">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploading}
        />
        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={uploading || files.length === 0}
        >
          {uploading ? 'アップロード中…' : 'アップロード'}
        </button>
      </div>

      <div className="image-gallery">
        {uploadedImages.length === 0 && <p>まだ画像がアップロードされていません。</p>}
        {uploadedImages.map((url) => (
          <div key={url} className="image-item">
            <img src={`${API_BASE_URL}${url}`} alt="キャラ" className="preview-image" />
            <button
              className="delete-btn"
              onClick={() => handleDelete(url)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterUpload;