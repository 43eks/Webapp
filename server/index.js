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
let db = { knowledge: [], tasks: [], habits: [], goals: [] }; // ✅ goalsも初期化
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(data);
    db.goals = db.goals || []; // ✅ もしgoalsが存在しない場合に備えて保険
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
  process.exit(1);
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

// 習慣更新（PATCH）
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

// --- ゴール管理API --- ✅

// ゴール一覧取得
app.get('/goals', (req, res) => {
  res.json(db.goals);
});

// ゴール追加
app.post('/goals', (req, res) => {
  const newGoal = req.body;
  db.goals.push(newGoal);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('✅ 新しいゴール追加:', newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('❌ ゴール保存エラー:', error);
    res.status(500).json({ error: 'ゴールの保存に失敗しました' });
  }
});

// ゴール更新（タスク追加やタイトル編集）
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