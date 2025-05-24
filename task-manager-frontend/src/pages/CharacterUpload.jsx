// src/pages/CharacterUpload.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';
import './CharacterUpload.css';

function CharacterUpload() {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('アップロード失敗');
      alert('アップロード成功！');
      fetchImages();
    } catch (err) {
      alert('アップロードに失敗しました');
      console.error(err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/character`);
      const data = await res.json();
      setUploadedImages(data);
    } catch (err) {
      console.error('画像取得失敗:', err);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await fetch(`${API_BASE_URL}/character/${filename}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('削除失敗');
      fetchImages();
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="upload-container">
      <h2>🧍 キャラクター画像アップロード</h2>

      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} className="upload-button">アップロード</button>

      <div className="image-gallery">
        {uploadedImages.map((url, index) => {
          const filename = url.split('/').pop();
          return (
            <div key={index} className="image-item">
              <img src={url} alt="キャラ画像" className="preview-image" />
              <button onClick={() => handleDelete(filename)}>🗑️</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CharacterUpload;
