import React, { useRef, useState, useEffect } from 'react';

function CreateSlideVideo() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [layout, setLayout] = useState([]); // 各画像の位置とサイズを記録

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('slideHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);

    const defaultLayout = urls.map((src, i) => ({
      src,
      x: (i % 2) * 960,
      y: Math.floor(i / 2) * 540,
      width: 960,
      height: 540
    }));
    setLayout(defaultLayout);
  };

  const updateLayout = (index, key, value) => {
    setLayout(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
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

    const loadedImages = await Promise.all(layout.map(({ src }) => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve({ src, img });
      });
    }));

    for (let alpha = 0; alpha <= 1.0; alpha += 0.05) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;

      for (const item of layout) {
        const loaded = loadedImages.find(l => l.src === item.src);
        if (loaded) {
          ctx.drawImage(loaded.img, item.x, item.y, item.width, item.height);
        }
      }

      ctx.globalAlpha = 1;
      ctx.font = '48px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(title || 'マイライフスライド', canvas.width / 2, 80);

      await new Promise(r => setTimeout(r, 50));
    }

    await new Promise(r => setTimeout(r, 1000));
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
    setLayout([]);
    setTitle('');
  };

  const loadFromHistory = (index) => {
    const historySet = history[index];
    setImages(historySet);
    setRecordedChunks([]);
    const defaultLayout = historySet.map((src, i) => ({
      src,
      x: (i % 2) * 960,
      y: Math.floor(i / 2) * 540,
      width: 960,
      height: 540
    }));
    setLayout(defaultLayout);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎞️ 自由配置スライドショー動画作成</h2>

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

      <h3>🛠 画像の配置を編集</h3>
      {layout.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <strong>画像 {index + 1}</strong><br />
          <label>
            X: <input
              type="number"
              value={item.x}
              onChange={(e) => updateLayout(index, 'x', parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Y: <input
              type="number"
              value={item.y}
              onChange={(e) => updateLayout(index, 'y', parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            幅: <input
              type="number"
              value={item.width}
              onChange={(e) => updateLayout(index, 'width', parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            高さ: <input
              type="number"
              value={item.height}
              onChange={(e) => updateLayout(index, 'height', parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
        </div>
      ))}

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