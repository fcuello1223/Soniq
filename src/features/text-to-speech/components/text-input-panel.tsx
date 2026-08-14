"use client";
import { Coins } from "lucide-react";
import { useSelector } from "@tanstack/react-form";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { useTypedAppFormContext } from "@/hooks/use-app-form";

import {
  COST_PER_UNIT,
  TEXT_MAX_LENGTH,
} from "@/features/text-to-speech/data/constants";
import { ttsFormOptions } from "./text-to-speech-form";
import { GenerateButton } from "./generate-button";

export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions);

  const text = useSelector(form.store, (selector) => selector.values.text);
  const isSubmitting = useSelector(
    form.store,
    (selector) => selector.isSubmitting,
  );
  const isValid = useSelector(form.store, (selector) => selector.isValid);

  return (
    <div className="flex flex-1 flex-col h-full min-h-0">
      <div className="relative min-h-0 flex-1">
        <form.Field name="text">
          {(field) => {
            return (
              <Textarea
                placeholder="Start typing or place your text here"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                className="absolute inset-0 resize-none border-0 bg-transparent p-4 pb-6 lg:p-6 lg:pb-8 text-base! leading-relaxed tracking-tight shadow-none wrap-break-word focus-visible:ring-0"
                maxLength={TEXT_MAX_LENGTH}
                disabled={isSubmitting}
              />
            );
          }}
        </form.Field>
        {/* Bottom Fade Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
      </div>
      {/* Action Bar */}
      <div className="shrink-0 p-4 lg:p-6">
        {/* Mobile Layout */}
        <div className="flex gap-3 lg:hidden">
          <GenerateButton
            className="w-full"
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            onSubmit={() => form.handleSubmit()}
          />
        </div>
        {/* Desktop Layout */}
        {text.length > 0 ? (
          <div className="hidden items-center justify-between lg:flex">
            <Badge variant="outline" className="gap-1.5 border-dashed">
              <Coins className="size-3 text-chart-5" />
              <span className="text-xs">
                <span className="tabular-nums">
                  ${(text.length * COST_PER_UNIT).toFixed(4)}
                </span>
                &nbsp; estimated
              </span>
            </Badge>
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-tight">
                {text.length.toLocaleString()}
                <span className="text-muted-foreground">
                  &nbsp;/&nbsp;{TEXT_MAX_LENGTH.toLocaleString()} characters
                </span>
              </p>
              <GenerateButton
                size="sm"
                disabled={isSubmitting || !isValid}
                isSubmitting={isSubmitting}
                onSubmit={() => form.handleSubmit()}
              />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">
              Get started by typing or pasting text above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
