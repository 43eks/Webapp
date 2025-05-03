import React, { useState } from 'react';

function SlideVideoPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 画像ファイルを複数選択
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleCreateVideo = async () => {
    if (selectedImages.length === 0) return alert("画像を選んでください！");
    setLoading(true);

    // 画像ファイルをFormDataで送信
    const formData = new FormData();
    selectedImages.forEach((img) => formData.append('images', img));

    // 必要なら BGM ファイルも formData.append('music', file);

    try {
      const res = await fetch('http://localhost:8080/slidevideo/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error('動画作成エラー:', err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 スライド動画作成</h2>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <br />
      <button onClick={handleCreateVideo} disabled={loading}>
        {loading ? '作成中...' : '動画を作成する'}
      </button>

      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>🎉 完成した動画</h3>
          <video src={videoUrl} controls width="500" />
          <p><a href={videoUrl} download>📥 ダウンロード</a></p>
        </div>
      )}
    </div>
  );
}

export default SlideVideoPage;