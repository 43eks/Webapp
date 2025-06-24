// src/features/dj/pages/DJStudio.tsx
// -----------------------------------------------------------------------------
// 2-Deck DJ Studio – Deck A / Deck B + クロスフェーダーの最小実装サンプル
// -----------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import * as Tone from "tone";
import Deck from "../components/Deck";

export default function DJStudio() {
  /* ---------------- Audio Nodes ---------------- */
  const [cross, setCross] = useState<Tone.CrossFade | null>(null);

  useEffect(() => {
    // AudioContext がユーザー操作までロックされている場合があるが、
    // Deck 側のクリックで resume されるのでここでは生成のみ。
    const crossfade = new Tone.CrossFade().toDestination();
    setCross(crossfade);
    return () => {
      crossfade.dispose();
    };
  }, []);

  /** Deck から Player を受け取って CrossFade に接続 */
  const handlePlayerReady = (side: "A" | "B") => (player: Tone.Player) => {
    if (!cross) return;
    if (side === "A") player.connect(cross.a);
    if (side === "B") player.connect(cross.b);
  };

  /** クロスフェーダー変更 */
  const handleFaderChange = (_: Event, v: number | number[]) => {
    if (!cross) return;
    const value = Array.isArray(v) ? v[0] : v;
    cross.fade.value = value; // 0〜1
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        DJ Studio
      </Typography>

      {/* Decks */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        <Deck id="A" onPlayerReady={handlePlayerReady("A")} />
        <Deck id="B" onPlayerReady={handlePlayerReady("B")} />
      </Box>

      {/* Crossfader */}
      <Box width={300}>
        <Typography gutterBottom>Crossfader</Typography>
        <Slider
          defaultValue={0.5}
          min={0}
          max={1}
          step={0.01}
          onChange={handleFaderChange}
        />
      </Box>
    </Box>
  );
}