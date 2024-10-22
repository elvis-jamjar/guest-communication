import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
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
          {children}
          {/* Footer */}
        </Providers>
        <footer className="text-white bg-primary-main">
          <div className="bg-secondary-main mx-auto py-6">
            <h1 className="text-white text-center text-xl md:text-4xl font-bold">Send inquiries to info@jamjargh.com</h1>
          </div>
          <div className="container py-20 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
            <div className="flex flex-wrap gap-5 justify-center items-center">
              <div className="flex items-center rounded-full p-5 bg-white">
                <Image
                  src="/images/4dx/logo.png"
                  width={600}
                  height={600}
                  priority
                  alt="4dx"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <p className="text-left text-[0.9rem] max-w-xs">
                4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community.
              </p>
            </div>
            <div className="flex gap-6 flex-col items-center justify-center">
              <div className="flex gap-4">
                <Image src="/images/4dx/linkedin.png" width={200} height={200} alt="linkedin" className="w-12 h-12 object-contain" />
                <Image src="/images/4dx/globe.png" width={200} height={200} alt="twitter" className="w-12 h-12 object-contain" />
              </div>
              <p className="w-fit text-lg font-medium">&copy; {new Date().getFullYear()} 4DX Ventures</p>
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
      </body>
    </html>
  );
}
