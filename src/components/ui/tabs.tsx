"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

export function Tabs({ items, defaultValue }: { items: TabItem[]; defaultValue?: string }) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value);

  return (
    <div>
      <div role="tablist" className="flex gap-2 overflow-x-auto border-b border-neutral-200">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            onClick={() => setActive(item.value)}
            className={cn(
              "min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold transition",
              active === item.value ? "border-primary-600 text-primary-700" : "border-transparent text-neutral-600 hover:text-neutral-900"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.value} role="tabpanel" hidden={active !== item.value} className="pt-5">
          {item.content}
        </div>
      ))}
    </div>
  );
}
