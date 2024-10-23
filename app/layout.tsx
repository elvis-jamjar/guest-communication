import Footer from "@/components/footer";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
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
        <Footer />
      </body>
    </html>
  );
}
