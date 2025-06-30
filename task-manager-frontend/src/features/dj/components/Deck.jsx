// src/features/dj/components/Deck.jsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – UI が潰れず常に見える最終版
//   • 波形 <div> を absolute + zIndex:1
//   • オーバーレイボタンを zIndex:2 で確実に前面
//   • 親 Box は minHeight:140 で余裕を確保
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
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "../../../App";

export default function Deck({ id, onPlayerReady }) {
  const [fileName, setFileName] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);

  const waveDivRef = useRef(null);
  const waveRef = useRef(null);
  const playerRef = useRef(null);

  /* WaveSurfer -------------------------------------------------- */
  const ensureWave = () => {
    if (waveRef.current || !waveDivRef.current) return;
    waveRef.current = WaveSurfer.create({
      container: waveDivRef.current,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
    });
    waveRef.current.on("seek", (p) => {
      playerRef.current?.seek?.(p);
    });
    waveRef.current.on("ready", () => setLoading(false));
  };

  /* ファイル取り込み -------------------------------------------- */
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    ensureWave();

    // アップロード
    setUploadPct(0);
    const fd = new FormData();
    fd.append("image", file);
    try {
      await axios.post(`${API_BASE_URL}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: ({ loaded, total }) => {
          if (!total) return;
          setUploadPct(Math.round((loaded / total) * 100));
        },
      });
    } catch (e) {
      console.warn("upload fail -> local only", e);
    }
    setUploadPct(null);

    // ローカル再生
    setLoading(true);
    await Tone.start();
    const url = URL.createObjectURL(file);
    waveRef.current?.loadBlob ? waveRef.current.loadBlob(file) : waveRef.current.load(url);

    playerRef.current?.dispose();
    const pl = new Tone.Player({ url, autostart: false }).toDestination();
    playerRef.current = pl;
    onPlayerReady?.(pl);

    setFileName(file.name);
    setPlaying(false);
    setPitch(0);
  }, [onPlayerReady]);

  /* Dropzone ---------------------------------------------------- */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    accept: { "audio/*": [".mp3", ".wav", ".flac", ".ogg", ".aac"] },
  });

  /* 再生 ------------------------------------------------------ */
  const togglePlay = async () => {
    const pl = playerRef.current;
    if (!pl) return;
    await Tone.start();
    if (playing) {
      pl.stop();
      setPlaying(false);
    } else {
      pl.start();
      setPlaying(true);
    }
  };

  const changePitch = (_, v) => {
    const val = Array.isArray(v) ? v[0] : v;
    setPitch(val);
    playerRef.current && (playerRef.current.playbackRate = 1 + val / 100);
  };

  /* UI --------------------------------------------------------- */
  return (
    <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2, width: "100%", maxWidth: 480 }}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      <Box {...getRootProps()} sx={{ position: "relative", minHeight: 140, mb: 2, bgcolor: "#f1f3f5" }}>
        <input {...getInputProps()} />

        {/* 波形 Canvas */}
        <div ref={waveDivRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

        {/* 初期ボタン */}
        {!fileName && uploadPct === null && !loading && (
          <Button variant="outlined" onClick={open} sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}

        {/* 進捗バー */}
        {uploadPct !== null && (
          <LinearProgress variant="determinate" value={uploadPct} sx={{ position: "absolute", bottom: 0, width: "100%", zIndex: 2 }} />
        )}

        {/* ローディング */}
        {loading && (
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!fileName || loading} onClick={togglePlay}>
          {playing ? "Stop" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{ width: 120 }} />
      </Box>

      {fileName && (
        <Typography variant="caption" color="text.secondary" noWrap>{fileName}</Typography>
      )}
    </Box>
  );
}