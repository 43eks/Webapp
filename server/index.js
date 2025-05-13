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

// --- データファイル読み込み×ID補筆
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
  console.log('✅ データ読み込み×ID補筆成功');
}

// --- タスクAPI
app.get('/tasks', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const freshDb = JSON.parse(rawData);
    res.json(freshDb.tasks || []);
  } catch (err) {
    console.error('❌ タスク取得エラー:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
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
  const item = db.knowledge.find(k => k.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.put('/knowledge/:id', (req, res) => {
  const index = db.knowledge.findIndex(k => k.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.knowledge[index] = { ...db.knowledge[index], ...req.body, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.knowledge[index]);
});

app.delete('/knowledge/:id', (req, res) => {
  const index = db.knowledge.findIndex(k => k.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.knowledge.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- 画像アップロードAPI（単一）
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
});

// --- 画像アップロードAPI（複数）
app.post('/upload/multiple', upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.status(200).json({ urls });
});

// --- キャラクター画像API
app.get('/character', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read images' });
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

app.delete('/character/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Deleted' });
  });
});

// --- サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動: http://localhost:8080');
});