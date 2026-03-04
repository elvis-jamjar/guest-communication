import React from "react";

interface ScreenProps {
  children: React.ReactNode;
}

interface ScreenSimulatorProps {
  /** Full landing page content - updates in real-time as user edits */
  landingPageContent: React.ReactNode;
  /** Label shown in the preview header (e.g. "Live preview", "Draft preview") */
  previewLabel?: string;
}

const DesktopScreenWithLabel: React.FC<ScreenProps & { label?: string }> = ({
  children,
  label = "Live Preview",
}) => (
  <div className="w-full max-w-full max-h-[85dvh] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 flex flex-col">
    <div className="h-8 bg-gray-100 flex items-center px-4 space-x-2 shrink-0">
      <div className="w-3 h-3 rounded-full bg-red-400"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="w-3 h-3 rounded-full bg-green-400"></div>
      <div className="flex-1 w-full flex justify-center font-bold text-sm">{label}</div>
    </div>
    <div className="flex-1 overflow-auto p-5 min-h-0">{children}</div>
  </div>
);

export function ScreenSimulator({ landingPageContent, previewLabel }: ScreenSimulatorProps) {
  return (
    <div className="w-full mx-auto p-4">
      <div className="flex justify-center items-center bg-gray-50 rounded-lg p-2">
        <DesktopScreenWithLabel label={previewLabel}>{landingPageContent}</DesktopScreenWithLabel>
      </div>
    </div>
  );
}