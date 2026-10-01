"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVoiceRecorderOptions {
  /** Called with a playable object URL once a recording is stopped. */
  onRecorded: (audioUrl: string) => void;
}

interface UseVoiceRecorder {
  isRecording: boolean;
  seconds: number;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  cancel: () => void;
}

/** Records microphone audio with MediaRecorder; start() asks for mic
 * permission, stop() hands back an object URL via onRecorded, cancel()
 * discards. Releases the mic on unmount. */
export function useVoiceRecorder({ onRecorded }: UseVoiceRecorderOptions): UseVoiceRecorder {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const discardRef = useRef(false);
  const onRecordedRef = useRef(onRecorded);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const release = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording isn't supported on this device.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      discardRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const shouldKeep = !discardRef.current && chunksRef.current.length > 0;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        release();
        if (shouldKeep) onRecordedRef.current(URL.createObjectURL(blob));
      };

      recorder.start();
      setSeconds(0);
      setIsRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone access was blocked. Allow it in your browser settings.");
    }
  }, [release]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  const cancel = useCallback(() => {
    discardRef.current = true;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    else release();
  }, [release]);

  useEffect(
    () => () => {
      discardRef.current = true;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      else release();
    },
    [release],
  );

  return { isRecording, seconds, error, start, stop, cancel };
}
