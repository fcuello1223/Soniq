"use client";
import { ChevronDown } from "lucide-react";
import { useSelector } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { useTTSVoices } from "../contexts/tts-voices-context";

import { ttsFormOptions } from "./text-to-speech-form";

export function VoiceSelectorButton() {
  const { allVoices } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);

  const voiceId = useSelector(form.store, (store) => store.values.voiceId);
  const currentVoice =
    allVoices.find((voice) => voice.id === voiceId) ?? allVoices[0];

  const buttonLabel = currentVoice?.name ?? "Select Voice";

  return (
    <DrawerTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 px-2"
      >
        {currentVoice && (
          <VoiceAvatar
            seed={currentVoice.id}
            name={currentVoice.name}
            className="size-6"
          />
        )}
        <span className="flex-1 truncate text-sm font-medium">
          {buttonLabel}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </Button>
    </DrawerTrigger>
  );
}
