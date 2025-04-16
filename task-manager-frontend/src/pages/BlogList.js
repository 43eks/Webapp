import React from 'react';

function BlogList() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 ナレッジ管理（ブログ一覧）</h2>
      <p>ここにあなたの知識や学びを記録していきましょう。</p>
      <ul>
        <li>💡 React の学習メモ</li>
        <li>📝 Spring Boot のAPI開発ノート</li>
        <li>🔧 Eclipse の設定まとめ</li>
        {/* 後でAPIと連携して動的に表示にできます */}
      </ul>
    </div>
  );
}

export default BlogList;