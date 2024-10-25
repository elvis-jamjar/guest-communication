import Footer from "@/components/footer";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";


export const metadata: Metadata = {
  title: "4DX CEO Summit 2024",
  description: "",
  // openGraph
  openGraph: {
    title: "4DX CEO Summit 2024",
    description: "Welcome to the 4DX CEO Summit, an exclusive annual event hosted by 4DX Ventures",
    url: "https://4dxceosummit.com",
    images: [
      {
        url: "/images/4dx/new/Stacked_4DX_Summit_Updated_LogoTransp.png",
        width: 1200,
        height: 630,
        alt: "4DX CEO Summit 2024",
      },
    ],
    type: 'website',
    locale: 'en_US',
    siteName: '4DX CEO Summit 2024',
  },
  twitter: {
    card: "summary_large_image",
    title: "4DX CEO Summit 2024",
    description: "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa",
    images: ["https://4dxceosummit.com/images/4dx/new/Stacked_4DX_Summit_Updated_LogoTransp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        // style={{
        //   backgroundAttachment: "local",
        //   // backgroundPosition: "fixed",
        //   // backgroundRepeat: "repeat",
        //   // backgroundSize: "cover",
        //   backgroundImage: "url('/images/4dx/parttern_2.png')",
        // }}
        className={cn(``)}>
        <Providers>
          <Suspense>
            {children}
          </Suspense>
          {/* Footer */}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
