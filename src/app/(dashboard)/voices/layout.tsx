import { ReactNode } from "react";

import { VoicesLayout } from "@/features/voices/views/voices-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <VoicesLayout>{children}</VoicesLayout>;
}
