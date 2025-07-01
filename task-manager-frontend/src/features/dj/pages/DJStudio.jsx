// src/features/dj/pages/DJStudio.jsx
import React, { useState } from "react";
import { Box, Button, Slider, Typography } from "@mui/material";
import Deck from "../components/Deck";
import { useRecorder } from "../hooks/useRecorder";
import * as Tone from "tone";
import fileDownload from "js-file-download";

export default function DJStudio() {
  /* ---------- Deck と CrossFade の接続 ---------- */
  const [crossFade] = useState(() => new Tone.CrossFade().toDestination());
  const handlePlayerReady = (deckId) => (player) => {
    // A=0, B=1
    player.disconnect();            // 既定の Destination を切る
    player.connect(deckId === "A" ? crossFade.a : crossFade.b);
  };

  /* ---------- クロスフェーダー値 ---------- */
  const [xfader, setXfader] = useState(0.5); // 0=A側, 1=B側
  const changeXfader = (_, v) => {
    const val = Array.isArray(v) ? v[0] : v;
    setXfader(val);
    crossFade.fade.rampTo(val, 0.01);        // 10 ms で追従
  };

  /* ---------- 録音フック ---------- */
  const { recording, start, stop } = useRecorder();
  const handleRecord = async () => {
    if (!recording) {
      await Tone.start();
      start();
    } else {
      const blob = await stop();
      blob && fileDownload(blob, `mix_${Date.now()}.wav`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        DJ Studio
      </Typography>

      {/* Deck A / Deck B */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Deck id="A" onPlayerReady={handlePlayerReady("A")} />
        <Deck id="B" onPlayerReady={handlePlayerReady("B")} />
      </Box>

      {/* クロスフェーダー */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography>A</Typography>
        <Slider
          value={xfader}
          onChange={changeXfader}
          min={0}
          max={1}
          step={0.01}
          sx={{ flexGrow: 1 }}
        />
        <Typography>B</Typography>
      </Box>

      {/* REC ボタン */}
      <Button
        variant={recording ? "outlined" : "contained"}
        color={recording ? "error" : "primary"}
        onClick={handleRecord}
      >
        {recording ? "Stop & Save" : "● REC"}
      </Button>
    </Box>
  );
}