// src/features/dj/components/Deck.tsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – 片側デッキ (アップロード不具合修正版)
//  ◇ 改善点
//    1. WaveSurfer の <div ref> を常に描画 → ref == null で初期化エラーが起きない
//    2. WaveSurfer 7系なら loadBlob / 6系なら load を自動判定
//    3. Drag & Drop と『Select Audio』ボタンのどちらでも確実に動く
// -----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import { Box, Button, Slider, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

export interface DeckProps {
  id: "A" | "B";
  onPlayerReady?: (player: Tone.Player) => void;
}

export default function Deck({ id, onPlayerReady }: DeckProps) {
  const [isPlaying, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const waveDivRef = useRef<HTMLDivElement | null>(null);
  const waveRef    = useRef<WaveSurfer | null>(null);
  const playerRef  = useRef<Tone.Player | null>(null);

  /* ---------------- WaveSurfer ライフサイクル ---------------- */
  const ensureWaveSurfer = () => {
    if (waveRef.current || !waveDivRef.current) return;
    const ctx = Tone.getContext().rawContext as AudioContext;
    waveRef.current = WaveSurfer.create({
      container: waveDivRef.current,
      backend: "WebAudio",
      audioContext: ctx,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
      responsive: true,
    });
    waveRef.current.on("seek", (progress: number) => {
      const p = playerRef.current;
      if (p) Tone.Transport.seconds = p.buffer.duration * progress;
    });
  };

  /* ---------------- ファイル処理 ---------------- */
  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    await Tone.start();
    ensureWaveSurfer();

    // WaveSurfer load (Blob if 7系, fallback to ObjectURL)
    if ((waveRef.current! as any).loadBlob) {
      (waveRef.current! as any).loadBlob(file);
    } else {
      const url = URL.createObjectURL(file);
      waveRef.current!.load(url);
    }

    // Tone.Player
    playerRef.current?.dispose();
    const url = URL.createObjectURL(file);
    const p = new Tone.Player({ url, autostart: false }).toDestination();
    p.sync().start(0);
    playerRef.current = p;
    onPlayerReady?.(p);

    setFileName(file.name);
    setPlaying(false);
  }, [onPlayerReady]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    noClick: true,
    accept: { "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg"] },
  });

  /* ---------------- 再生 / 停止 ---------------- */
  const togglePlay = async () => {
    const p = playerRef.current;
    if (!p) return;
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.pause();
      setPlaying(false);
    } else {
      if (Tone.Transport.state === "stopped") Tone.Transport.start();
      else Tone.Transport.start();
      setPlaying(true);
    }
  };

  const changePitch = (_: Event, v: number | number[]) => {
    const val = Array.isArray(v) ? v[0] : v;
    setPitch(val);
    const p = playerRef.current;
    if (p) p.playbackRate = 1 + val / 100;
  };

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2, width: "100%", maxWidth: 480 }}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      <Box {...getRootProps()} sx={{ position: "relative", height: 100, mb: 2, bgcolor: "#f1f3f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input {...getInputProps()} />
        {/* WaveSurfer Canvas (常に描画) */}
        <div ref={waveDivRef} style={{ width: "100%", height: "100%" }} />
        {/* オーバーレイメッセージ */}
        {!fileName && (
          <Button variant="outlined" onClick={open} sx={{ position: "absolute" }}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!fileName} onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>
    </Box>
  );
}