import React, { useRef, useState, useEffect } from 'react';

function CreateSlideVideo() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('slideHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);
  };

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
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

    // 画像読み込み
    const loadedImages = await Promise.all(images.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve({ src, img });
      });
    }));

    const slides = chunkArray(loadedImages, 4);

    for (let slideIndex = 0; slideIndex < slides.length; slideIndex++) {
      const currentSlide = slides[slideIndex];

      // フェードイン
      for (let alpha = 0; alpha <= 1.0; alpha += 0.05) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = alpha;

        currentSlide.forEach((item, i) => {
          const { img } = item;

          // 中央配置の計算（2列×2行）
          const col = i % 2;
          const row = Math.floor(i / 2);
          const centerX = (canvas.width / 2) * (col * 2 + 1) / 2;
          const centerY = (canvas.height / 2) * (row * 2 + 1) / 2;

          const x = centerX - img.width / 2;
          const y = centerY - img.height / 2;

          ctx.drawImage(img, x, y);
        });

        ctx.globalAlpha = 1;
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`${title || 'マイライフスライド'} - スライド${slideIndex + 1}`, canvas.width / 2, 80);

        await new Promise(r => setTimeout(r, 50));
      }

      await new Promise(r => setTimeout(r, 2000));
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
    const historySet = history[index];
    setImages(historySet);
    setRecordedChunks([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎞️ 元サイズ配置スライドショー作成</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトルを入力"
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