import React, { useRef, useState, useEffect } from 'react';

function CreateSlideVideo() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState(''); // タイトル入力用

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('slideHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);
  };

  const startRecording = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(60); // 高FPSでなめらか
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

      await new Promise((resolve) => {
        img.onload = async () => {
          // フェードイン処理
          for (let alpha = 0; alpha <= 1.0; alpha += 0.05) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // タイトル描画
            ctx.font = '48px sans-serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 1;
            ctx.fillText(`${title} - スライド ${i + 1}`, canvas.width / 2, 80);

            await new Promise(r => setTimeout(r, 50)); // 50msごとに描画
          }

          setTimeout(resolve, 1000); // 1秒表示
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
    setRecordedChunks([]);
    setTitle('');
  };

  const loadFromHistory = (index) => {
    setImages(history[index]);
    setRecordedChunks([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎞️ スライドショー動画作成</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="スライドタイトルを入力"
        style={{ width: '300px', fontSize: '16px', marginBottom: '10px' }}
      />
      <br />

      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <br /><br />

      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{ border: '1px solid #ccc', maxWidth: '100%' }}
      />
      <br /><br />

      <button onClick={startRecording} disabled={!images.length || isRecording}>
        🎥 録画スタート
      </button>
      <button onClick={downloadVideo} disabled={!recordedChunks.length}>
        💾 動画保存
      </button>
      <button onClick={resetSlides} style={{ marginLeft: '10px' }}>
        ♻️ リセット
      </button>

      <h3>🕑 過去の履歴から復元</h3>
      <ul>
        {history.map((h, index) => (
          <li key={index}>
            <button onClick={() => loadFromHistory(index)}>
              {`履歴 ${index + 1} を読み込む`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateSlideVideo;