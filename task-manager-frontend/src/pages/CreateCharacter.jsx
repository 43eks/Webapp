import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

function CharacterUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  // --- 初回読み込み：アップロード済み画像一覧取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/character`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUploadedImages(data); // 絶対パスでなく相対パス（/uploads/...）をそのまま保持
        }
      })
      .catch(err => console.error('❌ 画像取得エラー:', err));
  }, []);

  // --- ファイル選択
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  // --- アップロード処理
  const handleUpload = async () => {
    if (!file) return alert('画像を選択してください');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedImages(prev => [...prev, data.url]); // 相対パスのまま保持
        setFile(null);
        setPreviewUrl('');
        alert('✅ アップロード完了！');
      } else {
        alert('❌ アップロード失敗');
      }
    } catch (err) {
      console.error('❌ アップロード通信エラー:', err);
      alert('❌ 通信エラー');
    }
  };

  // --- 削除処理
  const handleDelete = async (url) => {
    const filename = url.split('/').pop();
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/character/${filename}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUploadedImages(prev => prev.filter(u => u !== url));
        alert('🗑️ 削除完了');
      } else {
        alert('❌ 削除失敗');
      }
    } catch (err) {
      console.error('❌ 削除通信エラー:', err);
      alert('❌ 削除中にエラーが発生しました');
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
          <br /><br />
          <button onClick={handleUpload}>アップロード</button>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>✅ アップロード済みキャラクター画像</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {uploadedImages.map((url, idx) => (
              <div key={url + idx} style={{ textAlign: 'center' }}>
                <img
                  src={`${API_BASE_URL}${url}`}
                  alt={`uploaded-${idx}`}
                  style={{ maxWidth: '150px' }}
                />
                <br />
                <button onClick={() => handleDelete(url)} style={{ marginTop: '8px' }}>
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterUpload;