/* App.css */

/* HTMLに背景を設定（より確実に反映される） */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', sans-serif;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/2/24/Valle_de_Viñales_Pinar_del_Río_Cuba.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* 全体オーバーレイ */
.app-overlay {
  background-color: rgba(255, 255, 255, 0.85);
  min-height: 100%;
  min-height: 100vh;
  padding: 40px;
  box-sizing: border-box;
}

/* ホーム画面のタイトル */
.home-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #111827;
}

/* ホーム画面のサブタイトル */
.home-subtitle {
  text-align: center;
  color: #4b5563;
  margin-bottom: 30px;
}

/* グリッドレイアウト */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 機能カード */
.card {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  color: #111827;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 無効カード */
.card.disabled {
  color: #9ca3af;
  background-color: #e5e7eb;
  cursor: not-allowed;
  pointer-events: none;
}

/* 汎用ボタン */
button {
  background-color: #2563eb;
  color: #fff;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1e40af;
}

/* リンクスタイル */
a {
  color: inherit;
  text-decoration: none;
}