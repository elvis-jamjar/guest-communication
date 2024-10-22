import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import "./globals.css";


export const metadata: Metadata = {
  title: "4DX Guest Communication",
  description: "4DX Guest Communication is a platform for managing guest communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"

    >
      <body
        style={{
          backgroundAttachment: "local",
          // backgroundPosition: "fixed",
          // backgroundRepeat: "repeat",
          // backgroundSize: "cover",
          backgroundImage: "url('/images/4dx/parttern_2.png')",
        }}
        className={cn(`text-foreground antialiased`)}>
        <Providers>
          <>
            <main className="container mx-auto">
              {children}
            </main>
            {/* Footer */}
            <footer className=" text-white bg-primary-main">
              <div className="container py-24 mx-auto flex flex-wrap md:justify-around justify-center">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                  <div className="flex items-center rounded-full p-4 bg-white">
                    <Image
                      src="/images/4dx/logo.png"
                      width={600}
                      height={600}
                      priority
                      alt="4dx"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                  <p className="text-left max-w-72">
                    4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community.
                  </p>
                </div>
                <div className="flex  gap-6 flex-col items-center justify-center">
                  <div className="flex gap-2">
                    <Image src="/images/4dx/linkedin.png" width={200} height={200} alt="linkedin" className="w-12 h-12 object-contain" />
                    <Image src="/images/4dx/globe.png" width={200} height={200} alt="twitter" className="w-12 h-12 object-contain" />
                  </div>
                  <p className="w-fit">&copy; {new Date().getFullYear()} 4DX Ventures</p>
                </div>
              </div>
              <Image
                src="/images/4dx/background.png"
                width={1000}
                height={400}
                alt="4dx"
                className="w-full h-12 object-cover bg-white"
              />
            </footer>
          </>
        </Providers>
      </body>
    </html>
  );
}
