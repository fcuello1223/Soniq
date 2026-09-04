import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { SettingsPanelHistory } from "./settings-panel-history";

export function HistoryDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline" size="sm" className="w-full">
          <History className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>History</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <SettingsPanelHistory />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
