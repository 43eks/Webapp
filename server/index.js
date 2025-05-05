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

// --- 📸 画像アップロード
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'ファイルなし' });
  const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// --- 🧍 キャラクター画像一覧取得
app.get('/character', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: '画像一覧取得エラー' });
    const imageUrls = files.map(file => `http://localhost:8080/uploads/${file}`);
    res.json(imageUrls);
  });
});

// --- 🎞️ スライド動画＋音楽合成
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

        const videoUrl = `http://localhost:8080/videos/${path.basename(outputWithAudio)}`;
        res.json({ message: '動画生成成功', videoUrl });
      });
    });
  } catch (error) {
    console.error('❌ 動画処理エラー:', error);
    res.status(500).json({ error: '内部処理エラー' });
  }
});

// --- 📦 タスクAPI
app.get('/tasks', (req, res) => res.json(db.tasks));
app.post('/tasks', (req, res) => {
  const task = req.body;
  db.tasks.push(task);
  db.history.push({ type: 'task', action: 'create', data: task, timestamp: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(task);
});

// --- 📚 ナレッジAPI
app.get('/knowledge', (req, res) => res.json(db.knowledge));
app.post('/knowledge', (req, res) => {
  const item = req.body;
  db.knowledge.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(item);
});

// --- 🔁 習慣API
app.get('/habits', (req, res) => res.json(db.habits));
app.post('/habits', (req, res) => {
  const habit = req.body;
  db.habits.push(habit);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(habit);
});
app.patch('/habits/:id', (req, res) => {
  const habit = db.habits.find(h => h.id === req.params.id);
  if (!habit) return res.status(404).json({ error: '習慣が見つかりません' });
  habit.done = req.body.done;
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(habit);
});

// --- 🎯 ゴールAPI
app.get('/goals', (req, res) => res.json(db.goals));
app.post('/goals', (req, res) => {
  const goal = req.body;
  db.goals.push(goal);
  db.history.push({ type: 'goal', action: 'create', data: goal, timestamp: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(goal);
});
app.patch('/goals/:id', (req, res) => {
  const goal = db.goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ error: 'ゴールが見つかりません' });
  Object.assign(goal, req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.json(goal);
});
app.delete('/goals/:id', (req, res) => {
  db.goals = db.goals.filter(g => g.id !== req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  res.status(204).send();
});

// --- 💡 AI提案API
app.post('/suggest', async (req, res) => {
  const { userSummary } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは今週のやるべきことを提案するアシスタントです。' },
        { role: 'user', content: `今週の状況：${userSummary}。やるべきことを5つ提案してください。` }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = response.data.choices[0].message.content;
    const suggestions = text.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, ''));
    res.json({ suggestions });
  } catch (error) {
    console.error('❌ AI提案エラー:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI提案取得に失敗しました' });
  }
});

// --- 🚀 サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});
