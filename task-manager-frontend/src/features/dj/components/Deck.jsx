// src/features/dj/components/Deck.tsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – 片側デッキ (AudioContext 警告ゼロ版)
//   ▸ WaveSurfer インスタンスを “ユーザー操作後” に生成し、Tone.js の共通
//     AudioContext を共有することで Chrome の autoplay 制約を完全回避
// -----------------------------------------------------------------------------
import React, { useCallback, useRef, useState } from "react";
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
  const [hasAudio, setHasAudio] = useState(false);

  const waveDivRef   = useRef<HTMLDivElement | null>(null);
  const waveRef      = useRef<WaveSurfer | null>(null);
  const playerRef    = useRef<Tone.Player | null>(null);

  /* ---------------- すべてユーザー操作後に行う ---------------- */
  const initWaveSurfer = () => {
    if (waveRef.current || !waveDivRef.current) return; // 1度だけ

    // Tone の AudioContext を使い回す
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

    // 波形スクラブ → 再生位置
    waveRef.current.on("seek", (progress: number) => {
      const p = playerRef.current;
      if (p) Tone.Transport.seconds = p.buffer.duration * progress;
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    await Tone.start();      // ← ユーザー操作の中で呼ばれるので警告なし

    initWaveSurfer();

    // WaveSurfer へ Blob ロード
    waveRef.current!.loadBlob(file);

    // Tone.Player
    playerRef.current?.dispose();
    const url = URL.createObjectURL(file);
    const p = new Tone.Player({ url, autostart: false }).toDestination();
    p.sync().start(0);
    playerRef.current = p;
    onPlayerReady?.(p);

    setHasAudio(true);
    setPlaying(false);
  }, [onPlayerReady]);

  /* ---------------- Dropzone ---------------- */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    noClick: true,
    accept: { "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg"] },
  });

  /* ---------------- Play / Pause ---------------- */
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

  /* ---------------- Pitch ---------------- */
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

      <Box
        {...getRootProps()}
        sx={{ height: 100, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f3f5" }}
      >
        <input {...getInputProps()} />
        {hasAudio ? (
          <div ref={waveDivRef} style={{ width: "100%", height: "100%" }} />
        ) : (
          <Button variant="outlined" onClick={open}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!hasAudio} onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>
    </Box>
  );
}