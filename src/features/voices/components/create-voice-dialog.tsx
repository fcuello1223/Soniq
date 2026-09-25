"use client";
import { ReactNode, useCallback } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { CreateVoiceForm } from "@/features/voices/components/create-voice-form";

import { useIsMobile } from "@/hooks/use-mobile";

interface CreateVoiceDialogProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateVoiceDialog({
  children,
  open,
  onOpenChange,
}: CreateVoiceDialogProps) {
  const isMobile = useIsMobile();

  const { checkout } = useCheckout();

  const handleError = useCallback(
    (message: string) => {
      if (message === "SUBSCRIPTION_REQUIRED") {
        toast.error("Subscription required", {
          action: {
            label: "Subscribe",
            onClick: () => checkout(),
          },
        });
      } else {
        toast.error(message);
      }
    },
    [checkout],
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create custom voice</DrawerTitle>
            <DrawerDescription>
              Upload or record a new audio to add a new voice to your library
            </DrawerDescription>
          </DrawerHeader>
          <CreateVoiceForm
            scrollable
            onError={handleError}
            footer={(submit) => {
              return (
                <DrawerFooter>
                  {submit}
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              );
            }}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle>Create custom voice</DialogTitle>
          <DialogDescription>
            Upload or record a new audio to add a new voice to your library
          </DialogDescription>
        </DialogHeader>
        <CreateVoiceForm scrollable onError={handleError} />
      </DialogContent>
    </Dialog>
  );
}
