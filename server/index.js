// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// データファイルのパス
const DATA_FILE = './data.json';

// 初期データ読み込み
let db = { knowledge: [], tasks: [], habits: [] };
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(data);
    console.log('✅ データファイル読み込み成功');
  } else {
    console.log('⚠️ データファイルが存在しないため、新規作成されます');
  }
} catch (error) {
  console.error('❌ データファイル読み込みエラー:', error);
}

// --- APIキー確認 ---
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ エラー: OPENAI_API_KEY が設定されていません (.env を確認してください)');
  process.exit(1); // サーバー起動停止
}
console.log('✅ 環境変数 OPENAI_API_KEY 読み込み成功');

// --- ルーティング ---

// タスク一覧取得
app.get('/tasks', (req, res) => {
  res.json(db.tasks);
});

// タスク追加
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  db.tasks.push(newTask);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しいタスク追加:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ タスク保存エラー:', error);
    res.status(500).json({ error: 'タスクの保存に失敗しました' });
  }
});

// ナレッジ一覧取得
app.get('/knowledge', (req, res) => {
  res.json(db.knowledge);
});

// ナレッジ追加
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

// 習慣一覧取得
app.get('/habits', (req, res) => {
  res.json(db.habits);
});

// 習慣追加
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

// タスク提案（AI呼び出し）
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
      .map(line => line.replace(/^\d+\.\s*/, '')); // 「1. ○○」の番号を除去

    console.log('✅ AI提案取得成功:', suggestions);

    res.json({ suggestions });
  } catch (error) {
    console.error('🔥 AIリクエスト失敗:', error.response?.data || error.message);
    res.status(500).json({ error: '提案の取得に失敗しました' });
  }
});

// サーバー起動
app.listen(8080, () => {
  console.log('✅ サーバー起動！http://localhost:8080 で待機中');
});