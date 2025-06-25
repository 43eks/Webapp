// src/features/dj/pages/DJStudio.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import * as Tone from "tone";
import Deck from "../components/Deck";

export default function DJStudio() {
  /* CrossFade ノードを保持 */
  const [cross, setCross] = useState(null);

  /* 初回だけ生成 */
  useEffect(() => {
    const node = new Tone.CrossFade().toDestination();
    setCross(node);
    return () => node.dispose();
  }, []);

  /* Deck が ready になったら A/B に接続 */
  const handlePlayerReady = (side) => (player) => {
    if (!cross) return;
    if (side === "A") player.connect(cross.a);
    if (side === "B") player.connect(cross.b);
  };

  /* クロスフェーダー操作 */
  const handleFader = (_, v) => {
    if (!cross) return;
    cross.fade.value = Array.isArray(v) ? v[0] : v; // 0–1
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        DJ Studio
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
        <Deck id="A" onPlayerReady={handlePlayerReady("A")} />
        <Deck id="B" onPlayerReady={handlePlayerReady("B")} />
      </Box>

      <Box width={300}>
        <Typography gutterBottom>Crossfader</Typography>
        <Slider defaultValue={0.5} min={0} max={1} step={0.01} onChange={handleFader} />
      </Box>
    </Box>
  );
}