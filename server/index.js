require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // ✅ 追加

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 静的ファイル公開（アップロード画像用）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// データファイルのパス
const DATA_FILE = './data.json';

let db = { knowledge: [], tasks: [], habits: [], goals: [], history: [] };
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(data);
    db.goals = db.goals || [];
    db.history = db.history || [];
    console.log('✅ データファイル読み込み成功');
  } else {
    console.log('⚠️ データファイルが存在しないため、新規作成されます');
  }
} catch (error) {
  console.error('❌ データファイル読み込みエラー:', error);
}

// --- ✅ 画像アップロードAPI ---
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ファイルがアップロードされていません' });
  }
  const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  console.log('✅ 画像アップロード完了:', imageUrl);
  res.json({ url: imageUrl });
});

// --- タスク一覧取得
app.get('/tasks', (req, res) => {
  res.json(db.tasks);
});

// --- タスク追加
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  db.tasks.push(newTask);
  db.history.push({ type: 'task', action: 'create', data: newTask, timestamp: new Date().toISOString() });

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しいタスク追加:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ タスク保存エラー:', error);
    res.status(500).json({ error: 'タスクの保存に失敗しました' });
  }
});

// --- ナレッジ一覧取得
app.get('/knowledge', (req, res) => {
  res.json(db.knowledge);
});

// --- ナレッジ追加
app.post('/knowledge', (req, res) => {
  const newKnowledge = req.body;
  db.knowledge.push(newKnowledge);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しいナレッジ追加:', newKnowledge);
    res.status(201).json(newKnowledge);
  } catch (error) {
    console.error('❌ ナレッジ保存エラー:', error);
    res.status(500).json({ error: 'ナレッジの保存に失敗しました' });
  }
});

// --- 習慣一覧取得
app.get('/habits', (req, res) => {
  res.json(db.habits);
});

// --- 習慣追加
app.post('/habits', (req, res) => {
  const newHabit = req.body;
  db.habits.push(newHabit);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しい習慣追加:', newHabit);
    res.status(201).json(newHabit);
  } catch (error) {
    console.error('❌ 習慣保存エラー:', error);
    res.status(500).json({ error: '習慣の保存に失敗しました' });
  }
});

// --- 習慣更新（PATCH）
app.patch('/habits/:id', (req, res) => {
  const habitId = req.params.id;
  const { done } = req.body;

  const habit = db.habits.find(h => h.id === habitId);
  if (!habit) {
    return res.status(404).json({ error: '指定された習慣が見つかりません' });
  }

  habit.done = done;

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log(`✅ 習慣ID ${habitId} の状態を更新:`, habit);
    res.json(habit);
  } catch (error) {
    console.error('❌ 習慣更新保存エラー:', error);
    res.status(500).json({ error: '習慣の保存に失敗しました' });
  }
});

// --- ゴール一覧取得
app.get('/goals', (req, res) => {
  res.json(db.goals);
});

// --- ゴール追加
app.post('/goals', (req, res) => {
  const newGoal = req.body;
  db.goals.push(newGoal);
  db.history.push({ type: 'goal', action: 'create', data: newGoal, timestamp: new Date().toISOString() });

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しいゴール追加:', newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('❌ ゴール保存エラー:', error);
    res.status(500).json({ error: 'ゴールの保存に失敗しました' });
  }
});

// --- ゴール更新
app.patch('/goals/:id', (req, res) => {
  const goalId = req.params.id;
  const { title, description, deadline, taskIds, completed } = req.body;

  const goal = db.goals.find(g => g.id === goalId);
  if (!goal) {
    return res.status(404).json({ error: '指定されたゴールが見つかりません' });
  }

  if (title !== undefined) goal.title = title;
  if (description !== undefined) goal.description = description;
  if (deadline !== undefined) goal.deadline = deadline;
  if (taskIds !== undefined) goal.taskIds = taskIds;
  if (completed !== undefined) goal.completed = completed;

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log(`✅ ゴールID ${goalId} の状態を更新:`, goal);
    res.json(goal);
  } catch (error) {
    console.error('❌ ゴール更新保存エラー:', error);
    res.status(500).json({ error: 'ゴールの保存に失敗しました' });
  }
});

// --- ゴール削除
app.delete('/goals/:id', (req, res) => {
  const goalId = req.params.id;
  const index = db.goals.findIndex(g => g.id === goalId);
  if (index === -1) {
    return res.status(404).json({ error: '指定されたゴールが見つかりません' });
  }

  db.goals.splice(index, 1);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log(`✅ ゴールID ${goalId} を削除`);
    res.status(204).send();
  } catch (error) {
    console.error('❌ ゴール削除保存エラー:', error);
    res.status(500).json({ error: 'ゴールの削除に失敗しました' });
  }
});

// --- AI提案API
app.post('/suggest', async (req, res) => {
  const { userSummary } = req.body;
  console.log('💬 受信した userSummary:', userSummary);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'あなたはユーザーの状況に応じて今週のタスクを提案するアシスタントです。' },
          { role: 'user', content: `今週の状況：${userSummary}。やるべきことを5つ提案してください。` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const suggestionText = response.data.choices[0].message.content;
    const suggestions = suggestionText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+\.\s*/, ''));

    console.log('✅ AI提案取得成功:', suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('🔥 AIリクエスト失敗:', error.response?.data || error.message);
    res.status(500).json({ error: '提案の取得に失敗しました' });
  }
});

// --- サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});