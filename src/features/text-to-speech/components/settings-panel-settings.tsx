"use client";
import { Fragment } from "react";
import { useSelector } from "@tanstack/react-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { sliders } from "../data/sliders";
import { ttsFormOptions } from "./text-to-speech-form";

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);
  const isSubmitting = useSelector(form.store, (selector) => selector.isSubmitting);

  return (
    <Fragment>
      {/* Voice style dropdown section */}
      <div className="border-b border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          Voice selector coming soon
        </p>
      </div>
      {/* Voice adjustments section */}
      <div className="p-4 flex-1">
        <FieldGroup className="gap-8">
          {sliders.map((slider) => {
            return (
              <form.Field key={slider.id} name={slider.id}>
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>{slider.label}</FieldLabel>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {slider.leftLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {slider.rightLabel}
                        </span>
                      </div>
                      <Slider
                        value={[field.state.value]}
                        onValueChange={(value) => field.handleChange(value[0])}
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        disabled={isSubmitting}
                        className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **:data-[slot=slider-track]:h-1"
                      />
                    </Field>
                  );
                }}
              </form.Field>
            );
          })}
        </FieldGroup>
      </div>
    </Fragment>
  );
}
