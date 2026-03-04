"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VisibilityProvider } from "../visibility-provider";

const queryClient = new QueryClient();
export function Providers(
  { children }: { children: ReactNode }
) {
  return (
    <QueryClientProvider client={queryClient}>
      <VisibilityProvider>
        {children}
      </VisibilityProvider>
    </QueryClientProvider>
  );
}