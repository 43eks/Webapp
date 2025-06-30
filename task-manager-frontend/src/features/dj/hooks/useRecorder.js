// src/features/dj/hooks/useRecorder.js
// -----------------------------------------------------------------------------
// useRecorder – 全ミックス録音フック (MediaStreamDestination 方式)
// -----------------------------------------------------------------------------
import { useRef, useState, useCallback } from "react";
import * as Tone from "tone";

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const mediaDestRef = useRef(null);   // MediaStreamDestinationNode
  const mediaRecRef  = useRef(null);   // MediaRecorder
  const chunksRef    = useRef([]);

  /* ---------------- 録音開始 ---------------- */
  const start = useCallback(() => {
    if (recording) return;

    // 1. MediaStreamDestination を用意
    const ctx = Tone.getContext().rawContext;
    const destNode = ctx.createMediaStreamDestination();
    mediaDestRef.current = destNode;

    // 2. Tone 全体出力を接続
    Tone.Destination.connect(destNode);

    // 3. Recorder 開始
    const rec = new MediaRecorder(destNode.stream);
    mediaRecRef.current = rec;
    rec.ondataavailable = (e) => chunksRef.current.push(e.data);
    rec.start();
    setRecording(true);
  }, [recording]);

  /* ---------------- 録音停止 ---------------- */
  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const rec  = mediaRecRef.current;
      const dest = mediaDestRef.current;
      if (!rec || !dest || !recording) return resolve(null);

      rec.onstop = () => {
        // Tone 出力を切断
        Tone.Destination.disconnect(dest);
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        chunksRef.current = [];
        setRecording(false);
        resolve(blob);
      };
      rec.stop();
    });
  }, [recording]);

  return { recording, start, stop };
}