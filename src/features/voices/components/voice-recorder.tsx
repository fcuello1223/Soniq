import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { cn, formatFileSize } from "@/lib/utils";
import {
  Mic,
  Square,
  RotateCcw,
  X,
  FileAudio,
  Play,
  Pause,
} from "lucide-react";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { Fragment } from "react";

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

interface VoiceRecorderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isInvalid?: boolean;
}

export function VoiceRecorder({
  file,
  onFileChange,
  isInvalid,
}: VoiceRecorderProps) {
  const { isPlaying, togglePlay } = useAudioPlayback(file);

  const {
    isRecording,
    elapsedTime,
    audioBlob,
    containerRef,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleStop = () => {
    stopRecording((blob) => {
      const recordedFile = new File([blob!], "recording.wav", {
        type: "audio/wav",
      });
      onFileChange(recordedFile);
    });
  };

  const handleReRecord = () => {
    onFileChange(null);
    resetRecording();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/50 bg-destructive/5 px-6 py-10">
        <p className="text-sm text-center text-destructive">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetRecording}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <FileAudio className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="">
            {formatFileSize(file.size)}{" "}
            {audioBlob && elapsedTime > 0 && (
              <Fragment>&nbsp;&middot;&nbsp;{formatTime(elapsedTime)}</Fragment>
            )}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleReRecord}
          title="Re-record"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleReRecord}
          title="Remove"
        >
          <X />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex flex-col overflow-hidden rounded-2xl border">
        <div className="w-full" ref={containerRef} />
        <div className="flex items-center justify-between border-t p-4">
          <p className="text-[28px] font-semibold leading-[1.2] tracking-tight">
            {formatTime(elapsedTime)}
          </p>
          <Button type="button" variant="destructive" onClick={handleStop}>
            <Square className="size-4" />
            Stop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border px-6 py-10 cursor-pointer",
        isInvalid && "border-destructive",
      )}
    >
      <div className="flex items-center justify-center size-12 rounded-xl bg-muted">
        <Mic className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-base font-semibold tracking-tight">
          Record your voice
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Click "Record" to start capturing audio
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={startRecording}
      >
        <Mic className="size-3.5" />
        Record
      </Button>
    </div>
  );
}
