// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { API_BASE_URL } from '../App';

function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('❌ stats fetch error:', err));
  }, []);

  if (!stats) return <p>読み込み中…</p>;

  // 習慣達成率グラフ用データ
  const habitData = stats.habits.map(h => ({ name: h.name, rate: Math.round(h.rate) }));

  // アドバイスログ推移データ
  const adviceData = Object.entries(stats.adviceTrend)
    .map(([day, count]) => ({ day, count }))
    .sort((a,b) => a.day.localeCompare(b.day));

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 分析ダッシュボード</h2>

      {/* タスク完了率 */}
      <section style={{ margin: '40px 0' }}>
        <h3>📝 タスク完了状況</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'タスク', 完了: stats.tasks.completed, 未完了: stats.tasks.total - stats.tasks.completed }
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="完了" />
            <Bar dataKey="未完了" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 習慣達成率 */}
      <section style={{ margin: '40px 0' }}>
        <h3>🔥 習慣達成率（過去30日）</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitData}>
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ゴール完了率 */}
      <section style={{ margin: '40px 0' }}>
        <h3>🎯 ゴール完了状況</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'ゴール', 完了: stats.goals.completed, 未完了: stats.goals.total - stats.goals.completed }
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="完了" fill="#ffc658" />
            <Bar dataKey="未完了" fill="#d0ed57" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* アドバイスログ推移 */}
      <section style={{ margin: '40px 0' }}>
        <h3>🧠 アドバイスログ推移（日別件数）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={adviceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default DashboardPage;