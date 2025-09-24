import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { PopOverChat } from "@/components/chat-bot";
import { Toaster } from "@/components/ui/sonner"
import NotificationUI from "@/components/Notification";

export const metadata: Metadata = {
  title: "ACGC guest communication",
  description: "ACGC guest communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth no-scrollbar">
      <body
        className={cn(`text-foreground no-scrollbar bg-background antialiased scroll-smooth`)}>
        <Providers>
          {children}
          <PopOverChat />
          <Toaster position="top-center" richColors />
          <NotificationUI />
        </Providers>
      </body>
    </html>
  );
}
