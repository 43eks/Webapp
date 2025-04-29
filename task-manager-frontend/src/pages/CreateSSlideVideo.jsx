// src/pages/CreateSlideVideo.jsx
import React, { useRef, useState } from 'react';

function CreateSlideVideo() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);
  };

  const startRecording = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(30); // 30FPS
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      setRecordedChunks(chunks);
      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i];
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setTimeout(resolve, 1000); // 1秒間表示
        };
      });
    }

    mediaRecorder.stop();
  };

  const downloadVideo = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slide_show.webm';
      a.click();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎞️ スライドショー動画作成</h2>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <br /><br />
      <canvas ref={canvasRef} width={640} height={480} style={{ border: '1px solid #ccc' }} />
      <br /><br />
      <button onClick={startRecording} disabled={!images.length || isRecording}>
        🎥 録画スタート
      </button>
      <button onClick={downloadVideo} disabled={!recordedChunks.length}>
        💾 動画保存
      </button>
    </div>
  );
}

export default CreateSlideVideo;