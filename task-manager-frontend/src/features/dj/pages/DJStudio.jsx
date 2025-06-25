// src/features/dj/components/Deck.jsx
// -----------------------------------------------------------------------------
// 2-Deck DJ アプリ – 単独デッキ (React + Tone.js + WaveSurfer.js)
// 2025-06-25  シンプル化: Dropzone を <div> に変更して string-ref 警告を解消
// -----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import { Box, Button, Slider, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

export default function Deck({ id, onPlayerReady }) {
  const [isPlaying, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const waveDivRef = useRef(null);
  const waveRef = useRef(null);
  const playerRef = useRef(null);

  /* ---------------- ドロップ処理 ---------------- */
  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    // WaveSurfer
    waveRef.current?.load(url);

    // Tone.Player
    playerRef.current?.dispose();
    const p = new Tone.Player({ url, autostart: false }).toDestination();
    p.sync().start(0);
    playerRef.current = p;
    onPlayerReady?.(p);
    setPlaying(false);
  }, [onPlayerReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".wav", ".mp3", ".aac", ".flac", ".ogg"],
    },
    multiple: false,
  });

  /* ---------------- WaveSurfer init ---------------- */
  useEffect(() => {
    if (!waveDivRef.current) return;
    const ws = WaveSurfer.create({
      container: waveDivRef.current,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
      cursorWidth: 1,
      responsive: true,
    });
    waveRef.current = ws;
    ws.on("seek", (progress) => {
      const p = playerRef.current;
      if (!p) return;
      Tone.Transport.seconds = p.buffer.duration * progress;
    });
    return () => ws.destroy();
  }, []);

  /* ---------------- Play / Pause ---------------- */
  const handlePlayPause = () => {
    const p = playerRef.current;
    if (!p) return;
    if (Tone.Transport.state === "stopped") Tone.Transport.start();
    if (isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    setPlaying(!isPlaying);
  };

  /* ---------------- Pitch (+-8%) ---------------- */
  const handlePitch = (_, v) => {
    const val = Array.isArray(v) ? v[0] : v;
    setPitch(val);
    const p = playerRef.current;
    if (p) p.playbackRate = 1 + val / 100;
  };

  return (
    <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2, width: "100%", maxWidth: 480 }}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      <div
        {...getRootProps()}
        style={{
          height: 100,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f3f5",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <div ref={waveDivRef} style={{ width: "100%", height: "100%" }}>
          {isDragActive ? "Drop audio here…" : "Click or drop audio file"}
        </div>
      </div>

      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!playerRef.current} onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={handlePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>
    </Box>
  );
}