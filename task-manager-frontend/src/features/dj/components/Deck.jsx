// src/features/dj/components/Deck.jsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – 片側デッキ (アップロード進捗 & 録音対応版)
// -----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import {
  Box,
  Button,
  Slider,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "../../../App";

export default function Deck({ id, onPlayerReady }) {
  /* ---------------- state ---------------- */
  const [isPlaying, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);          // 波形ロード中
  const [uploadPct, setUploadPct] = useState(null);       // アップロード進捗

  /* ---------------- refs ---------------- */
  const waveDivRef = useRef(null);
  const waveRef    = useRef(null);
  const playerRef  = useRef(null);

  /* ---------------- WaveSurfer 初期化 ---------------- */
  const ensureWave = () => {
    if (waveRef.current || !waveDivRef.current) return;
    const ctx = Tone.getContext().rawContext;
    waveRef.current = WaveSurfer.create({
      container: waveDivRef.current,
      backend: "WebAudio",
      audioContext: ctx,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
    });
    waveRef.current.on("seek", (p) => {
      const pl = playerRef.current;
      if (pl) Tone.Transport.seconds = pl.buffer.duration * p;
    });
    waveRef.current.on("ready", () => setLoading(false));
  };

  /* ---------------- ファイル取り込み ---------------- */
  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // ① サーバーにアップロード (進捗取得)
    setUploadPct(0);
    const fd = new FormData();
    fd.append("file", file);
    await axios.post(`${API_BASE_URL}/upload`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (!e.total) return;
        setUploadPct(Math.round((e.loaded / e.total) * 100));
      },
    });
    setUploadPct(null);

    // ② 再生準備
    setLoading(true);
    await Tone.start();
    ensureWave();
    if (waveRef.current.loadBlob) waveRef.current.loadBlob(file);
    else waveRef.current.load(URL.createObjectURL(file));

    playerRef.current?.dispose();
    const pl = new Tone.Player({ url: URL.createObjectURL(file), autostart: false }).toDestination();
    pl.sync().start(0);
    playerRef.current = pl;
    onPlayerReady?.(pl);

    setFileName(file.name);
    setPlaying(false);
  }, [onPlayerReady]);

  /* ---------------- Dropzone ---------------- */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    accept: { "audio/*": [".mp3", ".wav", ".flac", ".ogg", ".aac"] },
  });

  /* ---------------- Play / Pause ---------------- */
  const togglePlay = async () => {
    const pl = playerRef.current;
    if (!pl) return;
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
  const changePitch = (_, v) => {
    const val = Array.isArray(v) ? v[0] : v;
    setPitch(val);
    const pl = playerRef.current;
    if (pl) pl.playbackRate = 1 + val / 100;
  };

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2, width: "100%", maxWidth: 480 }}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      {/* Dropzone / Waveform */}
      <Box {...getRootProps()} sx={{ position: "relative", height: 100, mb: 2, bgcolor: "#f1f3f5" }}>
        <input {...getInputProps()} />
        <div ref={waveDivRef} style={{ width: "100%", height: "100%" }} />

        {/* 初期メッセージ */}
        {!fileName && uploadPct === null && !loading && (
          <Button onClick={open} variant="outlined" sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}

        {/* アップロード中バー */}
        {uploadPct !== null && (
          <LinearProgress variant="determinate" value={uploadPct} sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />
        )}

        {/* 波形ロードスピナー */}
        {loading && (
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" onClick={togglePlay} disabled={!fileName || loading}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>

      {fileName && (
        <Typography variant="caption" color="text.secondary" noWrap>
          {fileName}
        </Typography>
      )}
    </Box>
  );
}