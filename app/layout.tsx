import type { Metadata } from "next";
// import localFont from "next/font/local";
import { ArrowDownButton } from "@/components/arrowdown";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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


  function scrollToProgram() {
    // scroll to program id
    const program = document.getElementById("programme");
    program?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <html lang="en"

    >
      <body
        // style={{
        //   backgroundAttachment: "local",
        //   // backgroundPosition: "fixed",
        //   // backgroundRepeat: "repeat",
        //   // backgroundSize: "cover",
        //   backgroundImage: "url('/images/4dx/parttern_2.png')",
        // }}
        className={cn(`text-foreground antialiased`)}>
        <Providers>
          <>
            <section
              className="text-white w-screen h-screen flex items-center justify-center relative"
              style={{
                backgroundImage: "url('/images/4dx/background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                // backgroundAttachment: "",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Card className="md:p-14 p-4 shadow-2xl rounded-3xl border-none">
                <CardContent>
                  <div className="flex flex-wrap gap-12 justify-center items-center">
                    <div>
                      <Image
                        src={"/images/4dx/4dx_programme_logo.png"}
                        width={600}
                        height={600}
                        priority
                        alt="4dx"
                        className="w-80 h-auto object-contain"
                      />
                    </div>
                    <Separator orientation="vertical" className="border-gray-50 h-60 hidden md:flex" />
                    <Separator orientation="horizontal" className="border-gray-50 w-full md:hidden" />
                    <div className="flex-col justify-center flex space-y-4">
                      <div className="flex-col flex w-fit">
                        <span className="text-md">
                          Welcome to the 4DX CEO Summit,
                        </span>
                        <span className="text-sm text-center">
                          an exclusive annual event hosted
                        </span>
                        <span className="text-sm text-center">
                          by 4DX Ventures.
                        </span>
                      </div>
                      <p className="text-secondary-main font-semibold text-xs">Click below to complete your registration</p>
                      <a target="_blank" href="https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1" className="w-full">
                        <Button variant={"outline"}
                          className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-bold border-secondary-main rounded-full"
                        >Already in Johannesburg</Button>
                      </a>
                      <a target="_blank" href="https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC" className="w-full">
                        <Button variant={"outline"}
                          className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-bold border-secondary-main rounded-full"
                        >Flying to Johannesburg</Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <ArrowDownButton />
            </section>
            <section className="container flex flex-col gap-14 mx-auto py-10 mt-24">
              <h2 className="text-center text-lg font-normal">
                Join us for insightful discussions, networking opportunities, and strategic <br className="hidden md:block" /> collaborations shaping the future of technology and innovation across Africa.
              </h2>
              <CountdownTimer />
            </section>
            <main className="container mx-auto">
              {children}
            </main>
            {/* Footer */}
          </>
        </Providers>
        <footer className=" text-white bg-primary-main">
          <div className="bg-secondary-main mx-auto py-8">
            <h1 className="text-white text-center text-xl md:text-4xl font-bold">Send inquiries to info@jamjargh.com</h1>
          </div>
          <div className="container py-24 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
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
            <div className="flex gap-6 flex-col items-center justify-center">
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
      </body>
    </html>
  );
}
