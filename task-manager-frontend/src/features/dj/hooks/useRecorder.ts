// src/features/dj/hooks/useRecorder.ts
import { useRef, useState, useCallback } from "react";
import * as Tone from "tone";

export function useRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);

  /** 録音開始 */
  const start = useCallback(() => {
    if (recording) return;
    const dstStream = Tone.getContext().rawContext.destination.stream;
    const rec = new MediaRecorder(dstStream);
    mediaRecorderRef.current = rec;

    rec.ondataavailable = (e) => chunksRef.current.push(e.data);
    rec.start();
    setRecording(true);
  }, [recording]);

  /** 停止して Blob を返す */
  const stop = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const rec = mediaRecorderRef.current;
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