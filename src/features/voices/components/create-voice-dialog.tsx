"use client";
import { ReactNode } from "react";

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

import { CreateVoiceForm } from "@/features/voices/components/create-voice-form";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

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
        <CreateVoiceForm scrollable />
      </DialogContent>
    </Dialog>
  );
}
