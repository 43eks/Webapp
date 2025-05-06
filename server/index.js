require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// --- 静的ファイル公開
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.mp4') {
      res.setHeader('Content-Type', 'video/mp4');
    }
  }
}));
app.use('/music', express.static(path.join(__dirname, 'music')));

// --- multer設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

// --- データファイル
const DATA_FILE = './data.json';
let db = { knowledge: [], tasks: [], habits: [], goals: [], history: [] };
if (fs.existsSync(DATA_FILE)) {
  db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  db.goals = db.goals || [];
  db.history = db.history || [];
  console.log('✅ データ読み込み成功');
}

// --- 📚 ナレッジ記事API
app.get('/knowledge', (req, res) => res.json(db.knowledge));

app.post('/knowledge', (req, res) => {
  const item = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  db.knowledge.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(item);
});

app.get('/knowledge/:id', (req, res) => {
  const item = db.knowledge.find(k => k.id === req.params.id);
  if (!item) return res.status(404).json({ error: '記事が見つかりません' });
  res.json(item);
});

app.put('/knowledge/:id', (req, res) => {
  const index = db.knowledge.findIndex(k => k.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '記事が見つかりません' });
  db.knowledge[index] = { ...db.knowledge[index], ...req.body, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.knowledge[index]);
});

app.delete('/knowledge/:id', (req, res) => {
  const index = db.knowledge.findIndex(k => k.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '記事が見つかりません' });
  db.knowledge.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- 📸 画像アップロード
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'ファイルなし' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// --- 🧝 キャラクター画像一覧取得
app.get('/character', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: '画像一覧取得エラー' });
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

// --- 🪩 キャラクター画像削除
app.delete('/character/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'ファイルが存在しません' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('❌ 画像削除エラー:', err);
      return res.status(500).json({ error: '画像削除に失敗しました' });
    }

    console.log(`🗑️ 画像削除成功: ${fileName}`);
    res.json({ message: '削除成功' });
  });
});

// --- 🎮 スライド動画合成
app.post('/slidevideo/create', upload.array('images'), async (req, res) => {
  const files = req.files;
  if (!files?.length) return res.status(400).json({ error: '画像がありません' });

  const videosDir = path.join(__dirname, 'videos');
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

  const imageListFile = path.join(__dirname, 'uploads', 'images.txt');
  const outputNoAudio = path.join(videosDir, 'slideshow.mp4');
  const outputWithAudio = path.join(videosDir, 'final_video.mp4');
  const bgmPath = path.join(__dirname, 'music', 'background.mp3');

  if (!fs.existsSync(bgmPath)) {
    return res.status(500).json({ error: '背景音楽が見つかりません' });
  }

  try {
    const imageList = files.map(f => `file '${f.path.replace(/\\/g, '/')}'\nduration 2`).join('\n');
    fs.writeFileSync(imageListFile, imageList + `\nfile '${files[files.length - 1].path.replace(/\\/g, '/')}'`);

    exec(`ffmpeg -y -f concat -safe 0 -i "${imageListFile}" -vsync vfr -pix_fmt yuv420p "${outputNoAudio}"`, (err1) => {
      if (err1) {
        console.error('ffmpeg(無音動画)エラー:', err1);
        return res.status(500).json({ error: 'スライド動画作成に失敗しました' });
      }

      exec(`ffmpeg -y -i "${outputNoAudio}" -i "${bgmPath}" -shortest -c:v copy -c:a aac "${outputWithAudio}"`, (err2) => {
        if (err2) {
          console.error('ffmpeg(音楽合成)エラー:', err2);
          return res.status(500).json({ error: '音楽の合成に失敗しました' });
        }

        const videoUrl = `/videos/${path.basename(outputWithAudio)}`;
        res.json({ message: '動画生成成功', videoUrl });
      });
    });
  } catch (error) {
    console.error('❌ 動画処理エラー:', error);
    res.status(500).json({ error: '内部処理エラー' });
  }
});

// --- サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});
