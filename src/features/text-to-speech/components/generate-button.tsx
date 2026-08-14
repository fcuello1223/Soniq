"use client";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function GenerateButton({
  size,
  disabled,
  isSubmitting,
  onSubmit,
  className,
}: {
  size?: "default" | "sm";
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  className?: string;
}) {
  return (
    <Button
      onClick={onSubmit}
      size={size}
      disabled={disabled}
      className={className}
    >
      {isSubmitting ? (
        <Fragment>
          <Spinner className="size-3" />
          Generating...
        </Fragment>
      ) : (
        "Generate Speech"
      )}
    </Button>
  );
}
