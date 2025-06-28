// src/features/dj/pages/DJStudio.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Deck from "../components/Deck";
import { useRecorder } from "../hooks/useRecorder";
import * as Tone from "tone";
import fileDownload from "js-file-download";   // npm i js-file-download

export default function DJStudio() {
  /* --- 既存 crossfader などはそのまま --- */

  /* 録音フック */
  const { recording, start, stop } = useRecorder();

  /** stop → Blob をダウンロード */
  const handleRecord = async () => {
    if (!recording) {
      await Tone.start();   // 録音側も AudioContext が必要
      start();
    } else {
      const blob = await stop();
      if (blob) fileDownload(blob, `mix_${Date.now()}.wav`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>DJ Studio</Typography>

      {/* デッキとクロスフェーダーは省略 */}

      {/* ▼ 録音ボタン */}
      <Button
        variant={recording ? "outlined" : "contained"}
        color={recording ? "error" : "primary"}
        onClick={handleRecord}
        sx={{ mt: 2 }}
      >
        {recording ? "Stop & Save" : "● REC"}
      </Button>
    </Box>
  );
}