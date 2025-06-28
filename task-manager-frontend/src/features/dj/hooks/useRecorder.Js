// src/features/dj/hooks/useRecorder.js
import { useRef, useState, useCallback } from "react";
import * as Tone from "tone";

export function useRecorder() {
  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const [recording, setRecording] = useState(false);

  const start = useCallback(() => {
    if (recording) return;
    const stream = Tone.getContext().rawContext.destination.stream;
    const rec    = new MediaRecorder(stream);
    mediaRecRef.current = rec;

    rec.ondataavailable = (e) => chunksRef.current.push(e.data);
    rec.start();
    setRecording(true);
  }, [recording]);

  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const rec = mediaRecRef.current;
      if (!rec || !recording) return resolve(null);

      rec.onstop = () => {
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