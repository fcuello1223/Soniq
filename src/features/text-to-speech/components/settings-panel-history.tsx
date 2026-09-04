"use client";
import { AudioLines, AudioWaveform, Clock } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { formatDistanceToNow } from "date-fns";

export function SettingsPanelHistory() {
  const trpc = useTRPC();

  const { data: generations } = useSuspenseQuery(
    trpc.generations.getAll.queryOptions(),
  );

  if (!generations.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 h-full">
        <div className="relative flex items-center justify-center w-25 ">
          <div className="absolute left-0 -rotate-30 rounded-full bg-muted p-3">
            <AudioLines className="size-4 text-muted-foreground" />
          </div>
          <div className="relative z-10 rounded-full bg-foreground p-3">
            <AudioWaveform className="size-4 text-background" />
          </div>
          <div className="absolute right-0 rotate-30 rounded-full bg-muted p-3">
            <Clock className="size-4 text-muted-foreground" />
          </div>
        </div>
        <p className="font-semibold tracking-tight text-foreground">
          No generations yet
        </p>
        <p className="max-w-48 text-center text-xs text-muted-foreground">
          Generate some audio and it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {generations.map((generation) => {
        return (
          <Link
            key={generation.id}
            href={`/text-to-speech/${generation.id}`}
            className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex flex-col min-w-0 gap-0.5">
              <p className="truncate text-sm font-medium text-foreground">
                {generation.text}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <VoiceAvatar
                  seed={generation.voiceId ?? generation.voiceName}
                  name={generation.voiceName}
                  className="shrink-0"
                />
                <span>{generation.voiceName}</span>
                <span>&middot;</span>
                <span>
                  {formatDistanceToNow(new Date(generation.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
