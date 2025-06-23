/*  ------------------------------------------------------------
 *  src/App.js  （2025/06 リファクタ + DJ ルート追加）
 *  ---------------------------------------------------------- */

import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

/* ===== 既存ページ ===== */
import Home from "./pages/Home";
import KnowledgeList from "./pages/knowledgeList";
import CreateKnowledge from "./pages/Createknowledge";
import EditKnowledge from "./pages/Editknowledge";
import ViewKnowledge from "./pages/Viewknowledge";
import TaskList from "./pages/TaskList";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";
import CreateHabit from "./pages/CreateHabit";
import HabitTracker from "./pages/HabitTracker";
import MonthlyView from "./pages/MonthlyView";
import GoalPage from "./pages/GoalPage";
import GoalForm from "./pages/GoalForm";
import SlideVideoPage from "./pages/SlideVideoPage";
import CharacterUpload from "./pages/CharacterUpload";
import DataSourceStep from "./pages/DataSourceStep";
import FieldDefinitionStep from "./pages/FieldDefinitionStep";
import ModelingStep from "./pages/ModelingStep";
import AdviceLogPage from "./pages/AdviceLogPage";
import DashboardPage from "./pages/DashboardPage";

/* ===== 上流工程ダッシュボード（入れ子ルート） ===== */
import UpstreamDashboard from "./pages/upstream/UpstreamDashboard";

/* ===== DJ 機能 ===== */
import DJLanding from "./features/dj/pages/DJLanding";
import DJStudio from "./features/dj/pages/DJStudio";

/* ===== 右下キャラクター ===== */
import CharacterAvatar from "./components/CharacterAvatar";

/* ===== API ベース URL ===== */
export const API_BASE_URL = "http://localhost:8080";

/* ------------------------------------------------------------ */

export default function App() {
  return (
    <>
      <Router>
        {/* ===== ナビバー ===== */}
        <nav style={navBarStyle}>
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavItem key={to} to={to} end={end} label={label} />
          ))}
        </nav>

        {/* ===== ルート定義 ===== */}
        <main className="app-overlay">
          <Routes>
            {/* ------------- ホーム ------------- */}
            <Route index element={<Home />} />

            {/* ------------- タスク ------------- */}
            <Route path="tasks">
              <Route index element={<TaskList />} />
              <Route path="create" element={<CreateTask />} />
              <Route path=":id" element={<TaskDetail />} />
            </Route>

            {/* ------------- ナレッジ ------------- */}
            <Route path="knowledges">
              <Route index element={<KnowledgeList />} />
              <Route path="create" element={<CreateKnowledge />} />
              <Route path=":id">
                <Route index element={<ViewKnowledge />} />
                <Route path="edit" element={<EditKnowledge />} />
              </Route>
            </Route>

            {/* ------------- 習慣 ------------- */}
            <Route path="habits">
              <Route index element={<HabitTracker />} />
              <Route path="create" element={<CreateHabit />} />
              <Route path="monthly" element={<MonthlyView />} />
            </Route>

            {/* ------------- ゴール ------------- */}
            <Route path="goals">
              <Route index element={<GoalPage />} />
              <Route path="new" element={<GoalForm />} />
            </Route>

            {/* ------------- DJ ------------- */}
            <Route path="dj">
              <Route index element={<DJLanding />} />
              <Route path="studio" element={<DJStudio />} />
            </Route>

            {/* ------------- その他単独画面 ------------- */}
            <Route path="slides/create" element={<SlideVideoPage />} />
            <Route path="character" element={<CharacterUpload />} />
            <Route path="datasource" element={<DataSourceStep />} />
            <Route path="fields" element={<FieldDefinitionStep />} />
            <Route path="modeling" element={<ModelingStep />} />
            <Route path="advice" element={<AdviceLogPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* ------------- 上流工程 (子ルートは内部で定義) ------------- */}
            <Route path="upstream/*" element={<UpstreamDashboard />} />

            {/* ------------- 404 ------------- */}
            <Route path="*" element={<p style={{ padding: 20 }}>ページが見つかりません</p>} />
          </Routes>
        </main>
      </Router>

      {/* ===== キャラクター ===== */}
      <CharacterAvatar initialMood="happy" />
    </>
  );
}

/* ------------------------------------------------------------
 * ナビゲーションアイテム
 * ---------------------------------------------------------- */
function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        ...navLinkStyle,
        color: isActive ? "#d63384" : "#333",
      })}
    >
      {label}
    </NavLink>
  );
}

/* ------------------------------------------------------------
 * 定義をまとめて管理しやすく
 * ---------------------------------------------------------- */
const NAV_ITEMS = [
  { to: "/", label: "🏠 ホーム", end: true },
  { to: "/tasks", label: "📝 タスク" },
  { to: "/knowledges", label: "📚 ナレッジ" },
  { to: "/habits", label: "📅 習慣" },
  { to: "/goals", label: "🎯 ゴール" },
  { to: "/slides/create", label: "🎞️ スライド作成" },
  { to: "/character", label: "🧍 キャラクター" },
  { to: "/datasource", label: "🧬 データソース" },
  { to: "/fields", label: "🧩 項目定義" },
  { to: "/modeling", label: "🧱 モデリング" },
  { to: "/advice", label: "🧠 アドバイス" },
  { to: "/dashboard", label: "📊 ダッシュボード" },
  { to: "/upstream", label: "🛠 上流工程" },
  { to: "/dj", label: "🎧 DJ" }, // ← 追加
];

/* ------------------------------------------------------------
 * スタイル
 * ---------------------------------------------------------- */
const navBarStyle = {
  padding: "10px",
  backgroundColor: "#f8f9fa",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const navLinkStyle = {
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: 600,
};