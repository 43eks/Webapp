require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process'); // ← ffmpeg実行に必要

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 静的ファイル公開
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/music', express.static(path.join(__dirname, 'music')));

// ✅ multer設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ スライド動画＋BGM作成API
app.post('/slidevideo/create', upload.array('images'), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: '画像がアップロードされていません' });
  }

  const imageListFile = path.join(__dirname, 'uploads', 'images.txt');
  const outputNoAudio = path.join(__dirname, 'videos', 'slideshow.mp4');
  const outputWithAudio = path.join(__dirname, 'videos', 'final_video.mp4');
  const bgmPath = path.join(__dirname, 'music', 'background.mp3');

  try {
    // 画像一覧（ffmpeg用）
    const imageList = files
      .map(file => `file '${file.path.replace(/\\/g, '/')}'\nduration 2`)
      .join('\n');
    fs.writeFileSync(imageListFile, imageList + `\nfile '${files[files.length - 1].path.replace(/\\/g, '/')}'`);

    // スライド動画作成（無音）
    const slideCommand = `ffmpeg -y -f concat -safe 0 -i "${imageListFile}" -vsync vfr -pix_fmt yuv420p "${outputNoAudio}"`;
    exec(slideCommand, (err1) => {
      if (err1) {
        console.error('❌ スライド動画作成失敗:', err1);
        return res.status(500).json({ error: 'スライド動画の作成に失敗しました' });
      }

      // 音楽合成
      const audioCommand = `ffmpeg -y -i "${outputNoAudio}" -i "${bgmPath}" -shortest -c:v copy -c:a aac "${outputWithAudio}"`;
      exec(audioCommand, (err2) => {
        if (err2) {
          console.error('❌ 音楽合成失敗:', err2);
          return res.status(500).json({ error: '音楽の合成に失敗しました' });
        }

        const videoUrl = `http://localhost:8080/videos/${path.basename(outputWithAudio)}`;
        console.log('✅ 音楽付きスライド動画生成成功:', videoUrl);
        res.json({ message: '成功', videoUrl });
      });
    });
  } catch (error) {
    console.error('❌ 処理エラー:', error);
    res.status(500).json({ error: '内部処理エラー' });
  }
});

// ✅ その他のAPI（/upload, /tasks, /knowledge, /habits, /goals, /suggest など）はそのまま

// --- サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});