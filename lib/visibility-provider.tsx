"use client";

import { getConferenceSchedule } from "@/app/actions/timeline";
import { VisibilityConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

const VisibilityContext = createContext<VisibilityConfig | null>(null);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ["conference-schedules"],
    queryFn: getConferenceSchedule,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <VisibilityContext.Provider value={data?.visibilityConfig ?? null}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useSectionVisibility(key: keyof VisibilityConfig): boolean {
  const config = useContext(VisibilityContext);
  const pathname = usePathname();

  // Hide hero and footer on admin pages
  if (pathname?.includes("/admin")) {
    if (key === "hero" || key === "footer") return false;
  }

  return config?.[key] !== false;
}
