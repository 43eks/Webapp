/* -----------------------------------------------------------------------
 * server/index.js
 * -------------------------------------------------------------------- */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const multer  = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

/* =============== 静的ファイル ========================================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos',  express.static(path.join(__dirname, 'videos')));
app.use('/music',   express.static(path.join(__dirname, 'music')));

/* =============== multer（画像アップロード用） ========================= */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

/* =============== data.json 初期化 ===================================== */
const DATA_FILE = path.join(__dirname, 'data.json');
let db = {
  /* array 型 */
  knowledge: [], tasks: [], habits: [], goals: [],
  features : [], wbs  : [], requirements: [],
  /* object 型 */
  history  : [], scope: {}
};

if (fs.existsSync(DATA_FILE)) {
  try {
    db = { ...db, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) };
  } catch (e) {
    console.error('❌ data.json parse error:', e);
  }
}
[
  'knowledge','tasks','habits','goals',
  'features','wbs','requirements','history'
].forEach(k => { db[k] = Array.isArray(db[k]) ? db[k] : []; });
if (typeof db.scope !== 'object' || Array.isArray(db.scope)) db.scope = {};

fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
console.log('✅ data.json loaded');

/* =============== アドバイスログ ======================================= */
const ADVICE_LOG_FILE = path.join(__dirname, 'advice_logs.json');

app.get('/advice/logs', (_q, res) => {
  try {
    const raw = fs.existsSync(ADVICE_LOG_FILE)
      ? fs.readFileSync(ADVICE_LOG_FILE, 'utf-8').trim()
      : '';
    res.json(raw ? JSON.parse(raw) : []);
  } catch (e) {
    console.error('❌ /advice/logs GET error:', e);
    res.status(500).json({ error: 'Failed to load advice logs' });
  }
});

app.post('/advice/logs', (req, res) => {
  try {
    const entry = { ...req.body, timestamp: new Date().toISOString() };
    const raw   = fs.existsSync(ADVICE_LOG_FILE)
      ? fs.readFileSync(ADVICE_LOG_FILE, 'utf-8').trim()
      : '';
    const logs  = raw ? JSON.parse(raw) : [];
    logs.push(entry);
    fs.writeFileSync(ADVICE_LOG_FILE, JSON.stringify(logs, null, 2));
    res.status(201).json(entry);
  } catch (e) {
    console.error('❌ /advice/logs POST error:', e);
    res.status(500).json({ error: 'Failed to save advice log' });
  }
});

/* =============== Scope（概要フォーム） =============================== */
app.get('/scope', (_q, res) => res.json(db.scope));
app.put('/scope', (req, res) => {
  db.scope = req.body || {};
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json({ message: 'Scope saved' });
});

/* =============== 共通 CRUD （tasks / goals / …） ==================== */
const entities = [
  { name: 'tasks',        defaults: { completed: false } },
  { name: 'knowledge',    defaults: {} },
  { name: 'habits',       defaults: { records: {} } },
  { name: 'goals',        defaults: { completed: false } },
  { name: 'features',     defaults: { priority: 'M', owner: '' } },
  { name: 'wbs',          defaults: { owner: '', progress: 0 } },
  { name: 'requirements', defaults: { type: 'FR', priority: 'M', status: '検討中' } },
  { name:'stakeholders', defaults:{ role:'', influence:'中', interest:'中' } }
];

entities.forEach(({ name, defaults }) => {
  /* 一覧取得 --------------------------------------------------------- */
  app.get(`/${name}`, (_q, res) => res.json(db[name]));

  /* 単一取得 --------------------------------------------------------- */
  app.get(`/${name}/:id`, (req, res) => {
    const item = db[name].find(x => x.id === req.params.id);
    return item
      ? res.json(item)
      : res.status(404).json({ error: `${name.slice(0, -1)} not found` });
  });

  /* 作成 ------------------------------------------------------------- */
  app.post(`/${name}`, (req, res) => {
    const item = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...defaults,
      ...req.body
    };
    db[name].push(item);
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    res.status(201).json(item);
  });

  /* 更新 ------------------------------------------------------------- */
  app.put(`/${name}/:id`, (req, res) => {
    const idx = db[name].findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db[name][idx] = { ...db[name][idx], ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    res.json(db[name][idx]);
  });

  /* 削除 ------------------------------------------------------------- */
  app.delete(`/${name}/:id`, (req, res) => {
    const idx = db[name].findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db[name].splice(idx, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    res.status(204).send();
  });
});

/* =============== 画像アップロード ==================================== */
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});
app.post('/upload/multiple', upload.array('images'), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'No files' });
  res.json({ urls: req.files.map(f => `/uploads/${f.filename}`) });
});

/* =============== キャラクター画像一覧／削除 ========================= */
app.get('/character', (_q, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (e, files) => {
    if (e) return res.status(500).json({ error: 'Read failed' });
    res.json(files.map(f => `/uploads/${f}`));
  });
});
app.delete('/character/:filename', (req, res) => {
  const p = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
  fs.unlinkSync(p);
  res.json({ message: 'Deleted' });
});

/* =============== DWH モデリング ====================================== */
const MODEL_FILE = path.join(__dirname, 'modeling.json');
app.post('/dwh/model', (req, res) => {
  fs.writeFileSync(MODEL_FILE, JSON.stringify(req.body, null, 2));
  res.status(201).json({ message: 'Saved' });
});
app.get('/dwh/model', (_q, res) => {
  if (!fs.existsSync(MODEL_FILE)) return res.json({ tables: [], relations: [] });
  res.json(JSON.parse(fs.readFileSync(MODEL_FILE, 'utf-8')));
});

/* =============== サーバー起動 ======================================== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Server started: http://localhost:${PORT}`)
);