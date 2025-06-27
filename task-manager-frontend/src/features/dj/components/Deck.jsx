// src/features/dj/components/Deck.tsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – 片側デッキ (アップロード進捗バー付き)
//   ・axios + onUploadProgress で実ファイル送信率を表示
//   ・LinearProgress を波形領域の下側に重ねる
// -----------------------------------------------------------------------------
import React, { useCallback, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import {
  Box,
  Button,
  Slider,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "../../../App"; // ← フロントのベース URL を流用

export interface DeckProps {
  id: "A" | "B";
  onPlayerReady?: (player: Tone.Player) => void;
}

export default function Deck({ id, onPlayerReady }: DeckProps) {
  /* ---------------- state ---------------- */
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [loading, setLoading] = useState(false);         // WaveSurfer ready
  const [uploadPct, setUploadPct] = useState<number | null>(null); // 0-100

  /* ---------------- refs ---------------- */
  const waveDivRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const playerRef = useRef<Tone.Player | null>(null);

  /* ---------------- helper ---------------- */
  const initWave = () => {
    if (waveRef.current || !waveDivRef.current) return;
    const ctx = Tone.getContext().rawContext as AudioContext;
    waveRef.current = WaveSurfer.create({
      container: waveDivRef.current,
      backend: "WebAudio",
      audioContext: ctx,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
    });
    waveRef.current.on("seek", (p: number) => {
      const player = playerRef.current;
      if (player) Tone.Transport.seconds = player.buffer.duration * p;
    });
    waveRef.current.on("ready", () => setLoading(false));
  };

  /* ---------------- file handler ---------------- */
  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    /* ① サーバーへアップロード (プログレス取得) */
    setUploadPct(0);
    const fd = new FormData();
    fd.append("file", file);
    await axios.post(`${API_BASE_URL}/upload`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (!e.total) return;
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadPct(pct);
      },
    });
    setUploadPct(null); // 完了 → バー非表示

    /* ② ローカル再生準備 */
    setLoading(true);
    await Tone.start();
    initWave();

    const ws: any = waveRef.current;
    if (ws.loadBlob) ws.loadBlob(file); else ws.load(URL.createObjectURL(file));

    playerRef.current?.dispose();
    const p = new Tone.Player({ url: URL.createObjectURL(file), autostart: false }).toDestination();
    p.sync().start(0);
    playerRef.current = p;
    onPlayerReady?.(p);

    setFileName(file.name);
    setPlaying(false);
  }, [onPlayerReady]);

  /* ---------------- dropzone ---------------- */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    accept: { "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg"] },
  });

  /* ---------------- controls ---------------- */
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

      {/* Waveform / Drop */}
      <Box {...getRootProps()} sx={{ position: "relative", height: 100, mb: 2, bgcolor: "#f1f3f5" }}>
        <input {...getInputProps()} />
        <div ref={waveDivRef} style={{ width: "100%", height: "100%" }} />

        {/* オーバーレイメッセージ or スピナー */}
        {!fileName && uploadPct === null && !loading && (
          <Button variant="outlined" onClick={open} sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}
        {loading && (
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* アップロード進捗バー */}
        {uploadPct !== null && (
          <LinearProgress variant="determinate" value={uploadPct} sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />
        )}
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!fileName || loading} onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>

      {/* File name */}
      {fileName && (
        <Typography variant="caption" color="text.secondary" noWrap>
          {fileName}
        </Typography>
      )}
    </Box>
  );
}