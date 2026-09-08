import { Search, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { voicesSearchParams } from "../lib/params";

export function VoicesToolbar() {
  const [query, setQuery] = useQueryState("query", voicesSearchParams.query);

  const [localQuery, setLocalQuery] = useState(query);

  const debouncedSetQuery = useDebouncedCallback(
    (val: string) => setQuery(val),
    300,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">
          All libraries
        </h2>
        <p className="text-sm text-muted-foreground">
          Discover your voices (or make your own)
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <InputGroup className="lg:max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search voices"
              value={localQuery}
              onChange={(event) => {
                setLocalQuery(event.target.value);
                debouncedSetQuery(event.target.value);
              }}
            />
          </InputGroup>
          <div className="ml-auto hidden lg:block">
            <Button size="sm">
              <Sparkles />
              Custom voice
            </Button>
          </div>
          <div className="lg:hidden">
            <Button size="sm" className="w-full">
              <Sparkles />
              Custom voice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
