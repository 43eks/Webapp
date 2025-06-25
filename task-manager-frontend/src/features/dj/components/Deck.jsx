// src/features/dj/components/Deck.tsx
// -----------------------------------------------------------------------------
// 2-Deck DJ アプリの「片側デッキ」サンプル実装                                     
//  – ローカルファイルをドロップ → 波形表示 → Play / Pause → Pitch（±8%）
//  – WebAudio/Tone.js で再生しつつ、WaveSurfer.js で波形を描画
// -----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import { Box, Button, Slider, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

export interface DeckProps {
  /** デッキ識別子（UI や外部クロスフェーダー接続で使用） */
  id: "A" | "B";
  /** Player が ready になったら外部へ渡す（クロスフェーダー接続などに利用） */
  onPlayerReady?: (player: Tone.Player) => void;
}

export default function Deck({ id, onPlayerReady }: DeckProps) {
  /* ---------------- local state ---------------- */
  const [isPlaying, setPlaying] = useState(false);
  const [pitch, setPitch] = useState(0); // -8〜+8 [%]
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const playerRef = useRef<Tone.Player | null>(null);

  /* ---------------- ファイルドロップ ---------------- */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // WaveSurfer にロード
    waveRef.current?.load(url);

    // Tone.Player を生成（既存があれば dispose）
    playerRef.current?.dispose();
    const player = new Tone.Player({ url, autostart: false }).toDestination();
    player.sync().start(0); // Transport と同期
    playerRef.current = player;
    onPlayerReady?.(player);

    // 再生状態リセット
    setPlaying(false);
  }, [onPlayerReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".wav", ".mp3", ".aac", ".flac", ".ogg"],
    },
    multiple: false,
  });

  /* ---------------- WaveSurfer 初期化 ---------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    // インスタンスを生成
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#a0c4ff",
      progressColor: "#4361ee",
      height: 80,
      cursorWidth: 1,
      responsive: true,
    });
    waveRef.current = wavesurfer;

    // 再生位置をスクラブしたら Tone.Transport に反映
    wavesurfer.on("seek", (progress: number) => {
      const player = playerRef.current;
      if (!player) return;
      const dur = player.buffer.duration;
      const next = dur * progress;
      Tone.Transport.seconds = next;
    });

    return () => {
      wavesurfer.destroy();
      waveRef.current = null;
    };
  }, []);

  /* ---------------- 再生 / 停止 ---------------- */
  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!Tone.Transport.state || Tone.Transport.state === "stopped") {
      Tone.Transport.start();
    }

    if (isPlaying) {
      Tone.Transport.pause();
      setPlaying(false);
    } else {
      Tone.Transport.start();
      setPlaying(true);
    }
  };

  /* ---------------- ピッチ（再生速度） ---------------- */
  const handlePitchChange = (_: Event, value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    setPitch(v);
    const player = playerRef.current;
    if (player) {
      player.playbackRate = 1 + v / 100; // ±8% → 0.92〜1.08
    }
  };

  /* ---------------- アンマウントでクリーンアップ ---------------- */
  useEffect(() => {
    return () => {
      playerRef.current?.dispose();
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 2,
        width: "100%",
        maxWidth: 480,
      }}
    >
      <Typography variant="h6" mb={1}>
        Deck {id}
      </Typography>

      {/* ドロップゾーン / 波形 */}
      <Box
        {...getRootProps()}
        sx={{
          height: 100,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f1f3f5",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
          {isDragActive ? "Drop audio here…" : "Click or drop audio file"}
        </div>
      </Box>

      {/* 再生コントロール */}
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Button
          variant="contained"
          onClick={handlePlayPause}
          disabled={!playerRef.current}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography variant="body2">Pitch</Typography>
        <Slider
          value={pitch}
          onChange={handlePitchChange}
          min={-8}
          max={8}
          step={0.1}
          sx={{ width: 120 }}
        />
      </Box>
    </Box>
  );
}