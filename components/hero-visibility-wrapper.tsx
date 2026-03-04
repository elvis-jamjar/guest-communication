"use client";

import { useSectionVisibility } from "@/lib/visibility-provider";

interface HeroVisibilityWrapperProps {
  children: React.ReactNode;
}

export function HeroVisibilityWrapper({ children }: HeroVisibilityWrapperProps) {
  const showHero = useSectionVisibility("hero");

  if (!showHero) return null;

  return <>{children}</>;
}
