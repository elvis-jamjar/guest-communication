import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { HeroVisibilityWrapper } from "@/components/hero-visibility-wrapper";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";


export const metadata: Metadata = {
  title: `4DX CEO Summit ${new Date().getFullYear()}`,
  description: "",
  // openGraph
  openGraph: {
    title: `4DX CEO Summit ${new Date().getFullYear()}`,
    description: "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa",
    url: "https://4dxceosummit.com",
    images: [
      {
        url: "/images/4dx/26/3721x4300 pxl-01.jpeg",
        width: 1200,
        height: 630,
        alt: `4DX CEO Summit ${new Date().getFullYear()}`,
      }
    ],
    type: 'website',
    locale: 'en_US',
    siteName: `4DX CEO Summit ${new Date().getFullYear()}`,
  },
  twitter: {
    card: "summary_large_image",
    title: `4DX CEO Summit ${new Date().getFullYear()}`,
    description: "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa",
    // images: [
    //   "https://4dxceosummit.com/images/4dx/new/Stacked_4DX_Summit_Updated_LogoTransp.png",
    //   "https://4dxceosummit.com/images/4dx/new/Stacked w date_4DX Summit Updated LogoTransp.png",
    //   "https://4dxceosummit.com/images/4dx/new/Horiz_4DX Summit updated LogoTransp.png"

    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="scroll-smooth">
      <body>

        <Providers>
          <HeroVisibilityWrapper>
            <Hero />
          </HeroVisibilityWrapper>
          <Suspense>
            {children}
          </Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
