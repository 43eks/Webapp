import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

function CharacterUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setUploadedUrl(data.url);
        }
      });
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return alert('画像を選択してください');

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/character`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      setUploadedUrl(data.url);
      alert('アップロード完了！');
    } else {
      alert('アップロード失敗');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧍 キャラクターアイコンアップロード</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      {previewUrl && (
        <div>
          <p>📷 プレビュー</p>
          <img src={previewUrl} alt="preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
      <br />
      <button onClick={handleUpload}>アップロード</button>

      {uploadedUrl && (
        <>
          <h3>✅ 現在のキャラクター画像</h3>
          <img src={`${API_BASE_URL}${uploadedUrl}`} alt="uploaded" style={{ maxWidth: '200px' }} />
        </>
      )}
    </div>
  );
}

export default CharacterUpload;