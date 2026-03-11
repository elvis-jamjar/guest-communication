"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { VisibilityConfig } from "@/types";
import { Eye, EyeOff } from "lucide-react";

const SECTION_LABELS: Record<keyof VisibilityConfig, string> = {
  hero: "Hero Section",
  quickLinks: "Quick Links",
  countdown: "Countdown / Join Us",
  programme: "Program Outline",
  speakers: "Speakers",
  accommodation: "Accommodation",
  flights: "Flights",
  postFlights: "Post Flights",
  travelRequirements: "Travel Requirements",
  weatherAndPack: "Weather & What to Pack",
  completeRegistration: "Complete Registration",
  footer: "Footer",
};

interface VisibilityConfigFormProps {
  visibilityConfig?: VisibilityConfig;
  onChange: (config: VisibilityConfig) => void;
}

export function VisibilityConfigForm({
  visibilityConfig = {},
  onChange,
}: VisibilityConfigFormProps) {
  const toggleSection = (key: keyof VisibilityConfig, value: boolean) => {
    onChange({
      ...visibilityConfig,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8 p-4 border rounded-md">
      <p className="text-sm text-muted-foreground">
        Toggle which sections are visible on the landing page.
      </p>
      <div className="grid gap-3">
        {(Object.keys(SECTION_LABELS) as (keyof VisibilityConfig)[]).map(
          (key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <Label
                htmlFor={`visibility-${key}`}
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                {visibilityConfig[key] === false ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-primary" />
                )}
                {SECTION_LABELS[key]}
              </Label>
              <Switch
                id={`visibility-${key}`}
                checked={visibilityConfig[key] !== false}
                onCheckedChange={(checked) =>
                  toggleSection(key, checked)
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
