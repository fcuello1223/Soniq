"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import { useIsMobile } from "@/hooks/use-mobile";

interface WaveSurferOptions {
  url?: string;
  autoplay?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

interface UseWaveSurferReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  togglePlayPause: () => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
}

export function useWaveSurfer({
  url,
  autoplay,
  onReady,
  onError,
}: WaveSurferOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !url) {
      return;
    }

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    let destroyed = false;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#96999d",
      progressColor: "#4a8a9a",
      cursorColor: "#4a8a9a",
      cursorWidth: 2,
      barWidth: 2,
      barRadius: 2,
      barMinHeight: 4,
      height: "auto",
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());

      //Catch NotAllowedError when rowser blocks autoplay without user interaction
      if (autoplay) {
        ws.play().catch(() => {});
      }

      onReady?.();
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    ws.on("timeupdate", (time) => setCurrentTime(time));

    ws.on("error", (error) => {
      if (destroyed) {
        return;
      }
      console.error("WaveSurfer error: ", error);
      onError?.(new Error(String(error)));
    });

    ws.load(url).catch((error) => {
      if (destroyed) {
        return;
      }
      console.error("WaveSurfer load error: ", error);
      onError?.(new Error(String(error)));
    });

    return () => {
      destroyed = true;
      ws.destroy();
    };
  }, [url, autoplay, onReady, onError, isMobile]);

  const togglePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const seekForward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) {
      return;
    }
    const newTime = Math.min(ws.getCurrentTime() + seconds, ws.getDuration());
    ws.seekTo(newTime / ws.getDuration());
  }, []);

  const seekBackward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) {
      return;
    }
    const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
    ws.seekTo(newTime / ws.getDuration());
  }, []);

  return {
    containerRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    togglePlayPause,
    seekForward,
    seekBackward
  }
}
