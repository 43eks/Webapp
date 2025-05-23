// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// --- 静的ファイル公開 ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/music', express.static(path.join(__dirname, 'music')));

// --- multer設定 ---
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

// --- データファイル初期化 ---
const DATA_FILE = path.join(__dirname, 'data.json');
let db = { knowledge: [], tasks: [], habits: [], goals: [], history: [] };
if (fs.existsSync(DATA_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    console.error('❌ data.json parse error:', e);
  }
}
['knowledge', 'tasks', 'habits', 'goals', 'history'].forEach(key => {
  db[key] = db[key] || [];
});
fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log('✅ data.json loaded');

// --- アドバイスログAPI ---
const ADVICE_LOG_FILE = path.join(__dirname, 'advice_logs.json');

app.get('/advice/logs', (req, res) => {
  try {
    const logs = fs.existsSync(ADVICE_LOG_FILE)
      ? JSON.parse(fs.readFileSync(ADVICE_LOG_FILE, 'utf-8'))
      : [];
    res.json(logs);
  } catch (err) {
    console.error('❌ /advice/logs GET error:', err);
    res.status(500).json({ error: 'Failed to load advice logs' });
  }
});

app.post('/advice/logs', (req, res) => {
  try {
    const entry = { ...req.body, timestamp: new Date().toISOString() };
    let logs = [];
    if (fs.existsSync(ADVICE_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(ADVICE_LOG_FILE, 'utf-8'));
    }
    logs.push(entry);
    fs.writeFileSync(ADVICE_LOG_FILE, JSON.stringify(logs, null, 2));
    res.status(201).json(entry);
  } catch (err) {
    console.error('❌ /advice/logs POST error:', err);
    res.status(500).json({ error: 'Failed to save advice log' });
  }
});

// --- 統計API ---
app.get('/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const habits = (data.habits || []).map(h => {
      const records = Object.entries(h.records || {})
        .filter(([date]) => new Date(date) >= new Date(Date.now() - 30 * 86400000));
      const done = records.filter(([, v]) => v).length;
      const rate = records.length ? (done / records.length) * 100 : 0;
      return { name: h.name, rate };
    });
    const totalGoals = data.goals.length;
    const completedGoals = data.goals.filter(g => g.completed).length;

    let logs = [];
    if (fs.existsSync(ADVICE_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(ADVICE_LOG_FILE, 'utf-8'));
    }
    const adviceTrend = logs.reduce((acc, log) => {
      const day = log.timestamp.slice(0, 10);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    res.json({
      tasks: { total: totalTasks, completed: completedTasks },
      habits,
      goals: { total: totalGoals, completed: completedGoals },
      adviceTrend
    });
  } catch (err) {
    console.error('❌ /stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- タスクAPI ---
app.get('/tasks', (req, res) => res.json(db.tasks));
app.get('/tasks/:id', (req, res) => {
  const t = db.tasks.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  res.json(t);
});
app.post('/tasks', (req, res) => {
  const item = { ...req.body, id: Date.now().toString() };
  db.tasks.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(item);
});
app.put('/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.tasks[idx]);
});
app.delete('/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks.splice(idx, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- ナレッジAPI ---
app.get('/knowledge', (req, res) => res.json(db.knowledge));
app.post('/knowledge', (req, res) => {
  const item = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
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
  const idx = db.knowledge.findIndex(k => k.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.knowledge[idx] = { ...db.knowledge[idx], ...req.body, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.knowledge[idx]);
});
app.delete('/knowledge/:id', (req, res) => {
  const idx = db.knowledge.findIndex(k => k.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.knowledge.splice(idx, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- アップロード（単一） ---
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `http://localhost:8080/uploads/${req.file.filename}` });
});

// --- アップロード（複数） ---
app.post('/upload/multiple', upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files' });
  const urls = req.files.map(f => `http://localhost:8080/uploads/${f.filename}`);
  res.json({ urls });
});

// --- キャラクター画像一覧＆削除 ---
app.get('/character', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Read failed' });
    res.json(files.map(f => `http://localhost:8080/uploads/${f}`));
  });
});
app.delete('/character/:filename', (req, res) => {
  const file = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  fs.unlinkSync(file);
  res.json({ message: 'Deleted' });
});

// --- DWH モデリングAPI ---
const MODEL_FILE = path.join(__dirname, 'modeling.json');
app.post('/dwh/model', (req, res) => {
  fs.writeFileSync(MODEL_FILE, JSON.stringify(req.body, null, 2));
  res.status(201).json({ message: 'モデリング情報を保存しました' });
});
app.get('/dwh/model', (req, res) => {
  if (!fs.existsSync(MODEL_FILE)) return res.json({ tables: [], relations: [] });
  const m = JSON.parse(fs.readFileSync(MODEL_FILE, 'utf-8'));
  res.json(m);
});

// --- サーバ起動 ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});