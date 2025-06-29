// src/features/dj/components/Deck.jsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – 単独デッキ (再生不具合修正版)
//   ▸ Tone.Transport 同期をやめ、Player.start()/stop() で直接制御
//   ▸ これにより “Play が鳴らない / Pitch が効かない” 問題を解消
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
  /* state */
  const [fileName, setFileName] = useState(null);
  const [playing, setPlaying]   = useState(false);
  const [pitch, setPitch]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [uploadPct, setUploadPct] = useState(null);

  /* refs */
  const waveDivRef = useRef(null);
  const waveRef    = useRef(null);
  const playerRef  = useRef(null);

  /* WaveSurfer init once */
  const ensureWave = () => {
    if (waveRef.current || !waveDivRef.current) return;
    waveRef.current = WaveSurfer.create({
      container: waveDivRef.current,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
    });
    waveRef.current.on("seek", (p) => {
      const pl = playerRef.current;
      if (pl) pl.seek(p); // WaveSurfer との同期（秒→割合）
    });
    waveRef.current.on("ready", () => setLoading(false));
  };

  /* ファイル取り込み */
  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // アップロード進捗
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

    // 再生準備
    setLoading(true);
    await Tone.start();
    ensureWave();

    const objectURL = URL.createObjectURL(file);
    if (waveRef.current.loadBlob) waveRef.current.loadBlob(file);
    else waveRef.current.load(objectURL);

    playerRef.current?.dispose();
    const pl = new Tone.Player({ url: objectURL, autostart: false }).toDestination();
    playerRef.current = pl;
    onPlayerReady?.(pl);

    setFileName(file.name);
    setPlaying(false);
    setPitch(0);
  }, [onPlayerReady]);

  /* Dropzone */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (files) => handleFile(files[0]),
    accept: { "audio/*": [".mp3", ".wav", ".flac", ".ogg", ".aac"] },
  });

  /* Play / Stop */
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

  /* Pitch */
  const changePitch = (_, val) => {
    const v = Array.isArray(val) ? val[0] : val;
    setPitch(v);
    const pl = playerRef.current;
    if (pl) pl.playbackRate = 1 + v / 100;
  };

  /* UI */
  return (
    <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2, width: "100%", maxWidth: 480 }}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      <Box {...getRootProps()} sx={{ position: "relative", height: 100, mb: 2, bgcolor: "#f1f3f5" }}>
        <input {...getInputProps()} />
        <div ref={waveDivRef} style={{ width: "100%", height: "100%" }} />

        {!fileName && uploadPct === null && !loading && (
          <Button variant="outlined" onClick={open} sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            {isDragActive ? "Drop audio" : "Select audio"}
          </Button>
        )}
        {uploadPct !== null && (
          <LinearProgress variant="determinate" value={uploadPct} sx={{ position: "absolute", bottom: 0, width: "100%" }} />
        )}
        {loading && (
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!fileName || loading} onClick={togglePlay}>
          {playing ? "Stop" : "Play"}
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