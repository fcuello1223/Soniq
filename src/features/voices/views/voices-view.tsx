"use client";
import { Fragment } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { useTRPC } from "@/trpc/client";

import { VoicesList } from "../components/voices-list";
import { VoicesToolbar } from "../components/voices-toolbar";

import { voicesSearchParams } from "../lib/params";

function VoicesContent() {
  const trpc = useTRPC();
  const [query] = useQueryState("query", voicesSearchParams.query);

  const { data } = useSuspenseQuery(
    trpc.voices.getAll.queryOptions({ query: query }),
  );

  return (
    <Fragment>
      <VoicesList title="Team Voices" voices={data.custom} />
      <VoicesList title="Built-in Voices" voices={data.system} />
    </Fragment>
  );
}

export function VoicesView() {
  return (
    <div className="flex-1 space-y-10 overflow-y-auto p-3 lg:p-6">
      <VoicesToolbar />
      <VoicesContent />
    </div>
  );
}
