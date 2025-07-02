// src/features/dj/components/Deck.jsx
// -----------------------------------------------------------------------------
// 2-Deck DJ – loading が解除されず Play が押せないケースを完全に修正
//   • WaveSurfer 7.x: "ready" | "waveform-ready" | "error" で loading=false
//   • 6 秒フェイルセーフ setTimeout
//   • Play ボタン disabled 判定を playerRef で厳密化
// -----------------------------------------------------------------------------
import React, { useCallback, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import {
  Box, Button, Slider, Typography,
  LinearProgress, CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "../../../App";

export default function Deck({ id, onPlayerReady }) {
  /* state */
  const [fileName, setFileName]   = useState(null);
  const [playing, setPlaying]     = useState(false);
  const [pitch, setPitch]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [uploadPct, setUploadPct] = useState(null);

  /* refs */
  const waveDivRef = useRef(null);
  const waveRef    = useRef(null);
  const playerRef  = useRef(null);

  /* WaveSurfer init */
  const ensureWave = () => {
    if (waveRef.current || !waveDivRef.current) return;
    const ws = WaveSurfer.create({
      container: waveDivRef.current,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
    });
    ws.on("seek", p => playerRef.current?.seek?.(p));
    ["ready", "waveform-ready", "error"].forEach(ev =>
      ws.on(ev, () => setLoading(false))
    );
    // フェイルセーフ: 6 秒で強制解除
    setTimeout(() => setLoading(false), 6000);
    waveRef.current = ws;
  };

  /* handleFile */
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    ensureWave();

    /* Local playback first */
    setLoading(true);
    await Tone.start();
    const url = URL.createObjectURL(file);
    if (waveRef.current.loadBlob) waveRef.current.loadBlob(file);
    else waveRef.current.load(url);

    playerRef.current?.dispose();
    const pl = new Tone.Player({ url, autostart:false }).toDestination();
    playerRef.current = pl;
    onPlayerReady?.(pl);

    setFileName(file.name);
    setPlaying(false);
    setPitch(0);

    /* async upload */
    setUploadPct(0);
    const fd = new FormData();
    fd.append("image", file);
    axios.post(`${API_BASE_URL}/upload`, fd, {
      headers:{"Content-Type":"multipart/form-data"},
      timeout:15000,
      onUploadProgress:({loaded,total})=> total&&setUploadPct(Math.round(loaded/total*100)),
    }).catch(e=>console.warn("upload skipped",e.message))
      .finally(()=>setUploadPct(null));
  },[onPlayerReady]);

  /* Dropzone */
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: files => handleFile(files[0]),
    accept:{"audio/*":[]} // すべてのオーディオ
  });

  /* play / stop */
  const togglePlay = async () => {
    const pl = playerRef.current;
    if (!pl) return;
    await Tone.start();
    playing ? pl.stop() : pl.start();
    setPlaying(!playing);
  };

  const changePitch = (_,v)=>{
    const val = Array.isArray(v)?v[0]:v;
    setPitch(val);
    playerRef.current&&(playerRef.current.playbackRate=1+val/100);
  };

  /* UI */
  return (
    <Box sx={{border:"2px dashed #ccc",borderRadius:2,p:2,maxWidth:480}}>
      <Typography variant="h6" mb={1}>Deck {id}</Typography>

      {/* Drop & Wave */}
      <Box {...getRootProps()} sx={{position:"relative",minHeight:140,mb:2,bgcolor:"#f1f3f5"}}>
        <input {...getInputProps()} />
        <div ref={waveDivRef} style={{position:"absolute",inset:0,zIndex:1}} />

        {!fileName && uploadPct===null && !loading && (
          <Button variant="outlined" onClick={open}
            sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:2}}>
            {isDragActive?"Drop audio":"Select audio"}
          </Button>
        )}

        {uploadPct!==null && (
          <LinearProgress value={uploadPct} sx={{position:"absolute",bottom:0,width:"100%",zIndex:2}} />
        )}

        {loading && (
          <Box sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:2}}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button variant="contained" disabled={!playerRef.current||loading} onClick={togglePlay}>
          {playing?"Stop":"Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider value={pitch} onChange={changePitch} min={-8} max={8} step={0.1} sx={{width:120}}/>
      </Box>

      {fileName && <Typography variant="caption" color="text.secondary" noWrap>{fileName}</Typography>}
    </Box>
  );
}