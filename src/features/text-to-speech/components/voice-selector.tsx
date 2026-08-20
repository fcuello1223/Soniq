"use client";
import { Fragment } from "react";
import { useSelector } from "@tanstack/react-form";

import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import { useTTSVoices } from "@/features/text-to-speech/contexts/tts-voices-context";

import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { ttsFormOptions } from "./text-to-speech-form";

export function VoiceSelector() {
  const { customVoices, systemVoices, allVoices: voices } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);

  const voiceId = useSelector(
    form.store,
    (selector) => selector.values.voiceId,
  );

  const isSubmitting = useSelector(
    form.store,
    (selector) => selector.isSubmitting,
  );

  const selectedVoice = voices.find((voice) => voice.id === voiceId);

  const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice;

  let currentVoice;

  if (selectedVoice) {
    currentVoice = selectedVoice;
  } else if (hasMissingSelectedVoice) {
    currentVoice = {
      id: voiceId,
      name: "Unavailable voice",
      category: null as null,
    };
  } else {
    currentVoice = voices[0];
  }

  return (
    <Field>
      <FieldLabel>Voice style</FieldLabel>
      <Select
        value={voiceId}
        onValueChange={(val) => form.setFieldValue("voiceId", val)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-full h-auto gap-1 rounded-lg bg-white px-2 py-1">
          <SelectValue>
            {currentVoice && (
              <Fragment>
                <VoiceAvatar seed={currentVoice.id} name={currentVoice.name} />
                <span className="truncate text-sm font-medium tracking-tight">
                  {currentVoice.name}
                  {currentVoice.category &&
                    ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
                </span>
              </Fragment>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {hasMissingSelectedVoice && currentVoice && (
            <Fragment>
              <SelectGroup>
                <SelectLabel>Selected Voice</SelectLabel>
                <SelectItem value={currentVoice.id}>
                  <VoiceAvatar
                    seed={currentVoice.id}
                    name={currentVoice.name}
                  />
                  <span className="truncate text-sm font-medium">
                    {currentVoice.name}
                    {currentVoice.category &&
                      ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
                  </span>
                </SelectItem>
              </SelectGroup>
              {(customVoices.length > 0 || systemVoices.length > 0) && (
                <SelectSeparator />
              )}
            </Fragment>
          )}
          {customVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Team Voices</SelectLabel>
              {customVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <VoiceAvatar seed={voice.id} name={voice.name} />
                  <span className="truncate text-sm font-medium tracking-tight">
                    {voice.name} - {VOICE_CATEGORY_LABELS[voice.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {customVoices.length > 0 && systemVoices.length > 0 && (
            <SelectSeparator />
          )}
          {systemVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Built-in Voices</SelectLabel>
              {systemVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <VoiceAvatar seed={voice.id} name={voice.name} />
                  <span className="truncate text-sm font-medium tracking-tight">
                    {voice.name} - {VOICE_CATEGORY_LABELS[voice.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}
