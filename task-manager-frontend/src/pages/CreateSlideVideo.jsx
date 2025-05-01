import React, { useRef, useState, useEffect } from 'react';

function CreateSlideVideo() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('slideHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);
    setCaptions(urls.map(() => '')); // 各画像に空のキャプションを用意
  };

  const updateCaption = (index, text) => {
    setCaptions(prev =>
      prev.map((cap, i) => (i === index ? text : cap))
    );
  };

  const startRecording = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(60);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      setRecordedChunks(chunks);
      setIsRecording(false);
      const newHistory = [...history, images];
      setHistory(newHistory);
      localStorage.setItem('slideHistory', JSON.stringify(newHistory));
    };

    mediaRecorder.start();
    setIsRecording(true);

    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = images[i];
      await new Promise(resolve => {
        img.onload = async () => {
          const duration = 2000;
          const steps = 30;
          for (let step = 0; step <= steps; step++) {
            const offset = canvas.width - (canvas.width * step) / steps;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offset, 0, img.width, img.height);

            // タイトル
            ctx.font = '48px sans-serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvas.width / 2, 60);

            // キャプション
            ctx.font = '32px sans-serif';
            ctx.fillText(captions[i], canvas.width / 2, canvas.height - 60);

            await new Promise(r => setTimeout(r, duration / steps));
          }

          // 2秒静止
          await new Promise(r => setTimeout(r, 1000));
          resolve();
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

  const resetSlides = () => {
    setImages([]);
    setCaptions([]);
    setRecordedChunks([]);
    setTitle('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎞️ スライドショー（スライド式 + キャプション）</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトルを入力"
        style={{ width: '300px', fontSize: '16px' }}
      />
      <br /><br />
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <br /><br />

      {images.map((img, index) => (
        <div key={img} style={{ marginBottom: '10px' }}>
          <strong>画像 {index + 1} キャプション：</strong><br />
          <input
            type="text"
            value={captions[index]}
            onChange={(e) => updateCaption(index, e.target.value)}
            style={{ width: '400px' }}
          />
        </div>
      ))}

      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ border: '1px solid #ccc', maxWidth: '100%' }}
      />
      <br /><br />

      <button onClick={startRecording} disabled={!images.length || isRecording}>
        🎥 録画スタート
      </button>
      <button onClick={downloadVideo} disabled={!recordedChunks.length}>
        💾 ダウンロード
      </button>
      <button onClick={resetSlides} style={{ marginLeft: '10px' }}>
        ♻️ リセット
      </button>
    </div>
  );
}

export default CreateSlideVideo;