const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const router = express.Router();

// アップロード先の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 画像保存ディレクトリ
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/create', upload.array('images'), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: '画像がありません' });
  }

  const imageListFile = 'uploads/images.txt';
  const outputNoAudio = 'videos/slideshow.mp4';
  const outputWithAudio = 'videos/final_video.mp4';
  const bgmPath = 'music/background.mp3';

  try {
    // ① ffmpeg で使う画像リストファイルを作成
    const imageList = files
      .map(file => `file '${path.resolve(file.path)}'\nduration 2`)
      .join('\n');
    fs.writeFileSync(imageListFile, imageList + '\nfile ' + path.resolve(files[files.length - 1].path)); // 最後の画像を静止

    // ② スライドショー動画作成（音楽なし）
    const createSlideshowCmd = `ffmpeg -y -f concat -safe 0 -i ${imageListFile} -vsync vfr -pix_fmt yuv420p ${outputNoAudio}`;
    exec(createSlideshowCmd, (err) => {
      if (err) {
        console.error('動画作成エラー:', err);
        return res.status(500).json({ error: '動画生成失敗' });
      }

      // ③ 音楽を追加して最終出力
      const addMusicCmd = `ffmpeg -y -i ${outputNoAudio} -i ${bgmPath} -shortest -c:v copy -c:a aac ${outputWithAudio}`;
      exec(addMusicCmd, (err2) => {
        if (err2) {
          console.error('音楽追加エラー:', err2);
          return res.status(500).json({ error: '音楽追加失敗' });
        }

        // ✅ 成功時、動画のパスを返す
        return res.json({ message: '動画生成成功', videoUrl: '/videos/final_video.mp4' });
      });
    });
  } catch (e) {
    console.error('サーバー処理エラー:', e);
    return res.status(500).json({ error: 'サーバーエラー' });
  }
});

module.exports = router;