import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import { PopOverChat } from "@/components/chat-bot";
import { Toaster } from "@/components/ui/sonner"


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// // add sotashi fonts
// const sotashiBlack = localFont({
//   src: "./fonts/Satoshi-Black.woff",
//   variable: "--font-sotas-black",
//   weight: "100 900",
// });
// const sotashiBold = localFont({
//   src: "./fonts/Satoshi-Bold.woff",
//   variable: "--font-sotas-bold",
//   weight: "100 900",
// });
// // italics
// const sotashiItalic = localFont({
//   src: "./fonts/Satoshi-Italic.woff",
//   variable: "--font-sotas-italic",
//   weight: "100 900",
// });

// //light
// const sotashiLight = localFont({
//   src: "./fonts/Satoshi-Light.woff",
//   variable: "--font-sotas-light",
//   weight: "100 900",
// });

// // medium
// const sotashiMedium = localFont({
//   src: "./fonts/Satoshi-Medium.woff",
//   variable: "--font-sotas-medium",
//   weight: "100 900",
// });

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
        </Providers>
      </body>
    </html>
  );
}
