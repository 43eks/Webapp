// server/index.js
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

// --- データファイル読み込み＆ID補完
const DATA_FILE = './data.json';
let db = { knowledge: [], tasks: [], habits: [], goals: [], history: [] };

if (fs.existsSync(DATA_FILE)) {
  db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  db.knowledge = (db.knowledge || []).map(k => ({
    ...k,
    id: k.id || (Date.now() + Math.floor(Math.random() * 1000)).toString()
  }));

  db.goals = db.goals || [];
  db.history = db.history || [];

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log('✅ データ読み込み＆ID補完成功');
}

// --- タスクAPI
app.get('/tasks', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const freshDb = JSON.parse(rawData);
    res.json(freshDb.tasks || []);
  } catch (err) {
    console.error('❌ タスク取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

app.get('/tasks/:id', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const freshDb = JSON.parse(rawData);
    const task = freshDb.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'タスクが見つかりません' });
    res.json(task);
  } catch (err) {
    console.error('❌ タスク詳細取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// --- ナレッジ記事API
app.get('/knowledge', (req, res) => res.json(db.knowledge));

app.post('/knowledge', (req, res) => {
  const item = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  db.knowledge.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(item);
});

app.get('/knowledge/:id', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const freshDb = JSON.parse(rawData);
    const item = freshDb.knowledge.find(k => k.id === req.params.id);
    if (!item) return res.status(404).json({ error: '記事が見つかりません' });
    res.json(item);
  } catch (err) {
    console.error('❌ 記事取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

app.put('/knowledge/:id', (req, res) => {
  const index = db.knowledge.findIndex(k => k.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '記事が見つかりません' });
  db.knowledge[index] = {
    ...db.knowledge[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };
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

// --- キャラクター画像API
app.get('/character', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: '画像一覧取得エラー' });
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

app.delete('/character/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'ファイルが存在しません' });

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('❌ 画像削除エラー:', err);
      return res.status(500).json({ error: '画像削除に失敗しました' });
    }
    console.log(`🗑️ 画像削除成功: ${fileName}`);
    res.json({ message: '削除成功' });
  });
});

// --- サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});
