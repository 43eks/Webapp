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

// --- multer設定（画像アップロード用） ---
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

// --- データファイル読み込み＆初期化 ---
const DATA_FILE = path.join(__dirname, 'data.json');
let db = { knowledge: [], tasks: [], habits: [], goals: [], history: [] };
if (fs.existsSync(DATA_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    console.error('❌ data.json parse error:', e);
  }
}
// ensure arrays exist
db.knowledge = db.knowledge || [];
db.tasks     = db.tasks     || [];
db.habits    = db.habits    || [];
db.goals     = db.goals     || [];
db.history   = db.history   || [];
// save back to ensure structure
fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log('✅ data.json loaded/initialized');

// --- Advice Logs ファイルパス ---
const ADVICE_LOG_FILE = path.join(__dirname, 'advice_logs.json');

// --- Advice Logs API ---
// 取得
app.get('/advice/logs', (req, res) => {
  try {
    if (!fs.existsSync(ADVICE_LOG_FILE)) {
      // ファイルがなければ空配列
      return res.json([]);
    }
    const raw = fs.readFileSync(ADVICE_LOG_FILE, 'utf-8');
    const logs = JSON.parse(raw);
    res.json(logs);
  } catch (err) {
    console.error('❌ /advice/logs GET error:', err);
    res.status(500).json({ error: 'Failed to load advice logs' });
  }
});

// 追加
app.post('/advice/logs', (req, res) => {
  try {
    const entry = { ...req.body, timestamp: new Date().toISOString() };
    let logs = [];
    if (fs.existsSync(ADVICE_LOG_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(ADVICE_LOG_FILE, 'utf-8'));
        if (!Array.isArray(logs)) logs = [];
      } catch {
        logs = [];
      }
    }
    logs.push(entry);
    fs.writeFileSync(ADVICE_LOG_FILE, JSON.stringify(logs, null, 2));
    res.status(201).json(entry);
  } catch (err) {
    console.error('❌ /advice/logs POST error:', err);
    res.status(500).json({ error: 'Failed to save advice log' });
  }
});

// （その他の既存 API 以下は省略せずすべてこの下に）


/* --- 統計データ取得API --- */
app.get('/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const totalTasks     = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const habits = (data.habits || []).map(h => {
      const records = Object.entries(h.records || {})
        .filter(([date]) => new Date(date) >= new Date(Date.now() - 30*24*60*60*1000));
      const done = records.filter(([,v]) => v).length;
      const rate = records.length ? (done / records.length) * 100 : 0;
      return { name: h.name, rate };
    });
    const totalGoals     = data.goals.length;
    const completedGoals = data.goals.filter(g => g.completed).length;
    // adviceTrend は logs ファイルから集計
    let logs = [];
    if (fs.existsSync(ADVICE_LOG_FILE)) {
      try { logs = JSON.parse(fs.readFileSync(ADVICE_LOG_FILE, 'utf-8')); }
      catch { logs = []; }
    }
    const adviceTrend = logs.reduce((acc, log) => {
      const day = log.timestamp.slice(0,10);
      acc[day] = (acc[day]||0) + 1;
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
  const idx = db.tasks.findIndex(x => x.id===req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.tasks[idx]);
});
app.delete('/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(x=>x.id===req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Not found' });
  db.tasks.splice(idx,1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- ナレッジAPI ---
app.get('/knowledge', (req, res) => res.json(db.knowledge));
app.post('/knowledge', (req, res) => {
  const it = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  db.knowledge.push(it);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(it);
});
app.get('/knowledge/:id', (req, res) => {
  const it = db.knowledge.find(x=>x.id===req.params.id);
  if (!it) return res.status(404).json({ error:'Not found' });
  res.json(it);
});
app.put('/knowledge/:id', (req,res) => {
  const idx = db.knowledge.findIndex(x=>x.id===req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Not found' });
  db.knowledge[idx] = { ...db.knowledge[idx], ...req.body, updatedAt:new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(db.knowledge[idx]);
});
app.delete('/knowledge/:id', (req, res) => {
  const idx = db.knowledge.findIndex(x=>x.id===req.params.id);
  if (idx===-1) return res.status(404).json({ error:'Not found' });
  db.knowledge.splice(idx,1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- 画像アップロードAPI（単一） ---
app.post('/upload', upload.single('image'), (req,res) => {
  if(!req.file) return res.status(400).json({ error:'No file' });
  res.json({ url:`/uploads/${req.file.filename}` });
});
// --- 画像アップロードAPI（複数） ---
app.post('/upload/multiple', upload.array('images'), (req,res)=>{
  if(!req.files||req.files.length===0) return res.status(400).json({ error:'No files' });
  const urls = req.files.map(f=>`/uploads/${f.filename}`);
  res.json({ urls });
});
// --- キャラクター画像一覧／削除 ---
app.get('/character', (req,res)=>{
  const dir=path.join(__dirname,'uploads');
  fs.readdir(dir,(err,files)=>{
    if(err) return res.status(500).json({ error:'Read failed' });
    res.json(files.map(f=>`/uploads/${f}`));
  });
});
app.delete('/character/:filename',(req,res)=>{
  const p=path.join(__dirname,'uploads',req.params.filename);
  if(!fs.existsSync(p)) return res.status(404).json({ error:'Not found' });
  fs.unlinkSync(p);
  res.json({ message:'Deleted' });
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