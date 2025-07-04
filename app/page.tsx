"use client"

import { PageQuickLinks } from "@/components/page-content-display";
import { ScheduleList } from "@/components/schedule-list";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
// import { Globe, Linkedin, Mail, Twitter, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { getConferenceSchedule, getConferenceSettings, getPageContent } from "./actions/timeline";
// import Link from "next/link";
import HeroSection from "@/components/hero-section";
import { useMobile } from "@/hooks/use-mobile";

// const textIconData = [
//   {
//     text: 'www.acgc.africa',
//     icon: <Globe className="w-4 h-4" />
//   },
//   {
//     text: '@african_inhouse',
//     // twitter icon
//     icon: <Twitter className="w-4 h-4" />
//   },
//   {
//     text: 'mail@acgc.africa',
//     icon: <Mail className="w-4 h-4" />
//   },
//   {
//     text: 'ACGC (African Corprate Government Counsel Forum)',
//     icon: <Linkedin className="w-4 h-4" />
//   }
// ]

const sections = ["about", "programme", "sponsors", "partners"];
// #ACGC4B, #Africaninhouse, #Generalcounselafrica, #Govtcounselafrica, #Corporatecounselafrica
// const hashTags = ["ACGC4B", "Africaninhouse", "Generalcounselafrica", "Govtcounselafrica", "Corporatecounselafrica"];
// const INTERVAL = 60000; // 1 minute
export default function Home() {
  const isMobile = useMobile();
  const { data, isLoading } = useQuery({
    queryKey: ['conference-schedules'],
    queryFn: async () => await getConferenceSchedule(),
    refetchInterval: 65000, // 1 minute 5 seconds
  });
  const { data: settings } = useQuery({
    queryKey: ['conference-settings'],
    queryFn: async () => await getConferenceSettings(),
    refetchInterval: 80000, // 1 minute 20 seconds
  });

  // get page content
  const { data: pageContent } = useQuery({
    queryKey: ['page-content'],
    queryFn: async () => await getPageContent(),
    refetchInterval: 90000, // 15 minutes
  });

  const [isSelectedSection, setIsSelectedSection] = React.useState<string | null>(null);

  // listen for scroll events to update the selected section
  React.useEffect(() => {
    function handleScroll() {
      // check if the section is in view at least 20% to select it
      const selectedSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.2;
        }
        return false;
      });
      setTimeout(() => selectedSection && setIsSelectedSection(selectedSection), 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      {/* <header className="bg-white py-4 px-1.5 sticky z-30 top-0 backdrop-blur-sm bg-opacity-80 w-full">
        <div className="container mx-auto  max-w-5xl md:px-8 flex justify-between items-center">
          <a href="https://acgc.africa" target="_blank" className="text-2xl font-bold">
            <Image src="/images/logo.png" width={400} height={400} alt="ACGC" className="w-16 md:w-24 h-12 object-contain rounded-xl" />
          </a>
          <nav className="flex items-center gap-2">
            {
              sections?.map((section, index) => {
                return (
                  <Link
                    key={section}
                    href={`#${section}`}
                    className={cn("px-2 py-1 text-xs font-semibold rounded-md hover:opacity-80 transition-all duration-500 hover:bg-primary-main hover:text-gray-100" + (isSelectedSection === section ? " bg-primary-main text-gray-100" : ""), (index > 2) && 'hidden md:flex')}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Link>
                )
              })
            }
          </nav>
        </div>
      </header> */}

      {/* Hero Section */}
      <section id={"about"} className=" w-full relative h-auto"
        style={{
          backgroundImage: "url('/images/ACGC_bg_2025_dark.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          backgroundBlendMode: "overlay",
          backgroundColor: isMobile ? "rgba(0, 0, 0, 0.5)" : "transparent",
          minHeight: "100dvh",
        }}
      >
        <HeroSection />
      </section>

      {/* Program Section */}
      <section id="programme" className="py-20 bg-gray-100 md:min-h-[10dvh]">
        {
          isLoading && <div className="text-center">
            <p>Loading...</p>
          </div>
        }
        {
          data &&
          <ScheduleList schedules={data || []} columns={settings?.columns} />
        }
      </section>
      {/* quick links */}
      <section id="quick-links" className="py-16 bg-white">
        <PageQuickLinks
          pageContent={pageContent || {}}
          className={cn("container mx-auto max-w-5xl px-5 md:px-2")}
        />
      </section>
      {/* sponsors */}
      <section id="sponsors" className="py-16 bg-white">
        <div className="mx-auto container max-w-5xl px-4 md:px-0">
          <Image
            src="/images/sponsors_25.png"
            width={1000}
            height={500}
            draggable={false}
            fetchPriority="high"
            quality={100}
            priority={true}
            alt="Sponsors"
            className="w-full h-auto pointer-events-none object-contain select-none" />
        </div>
      </section>
      {/* partners */}
      <section id="partners" className="py-16 bg-white mx-auto">
        <div className="mx-auto container max-w-5xl">
          <Image
            src="/images/partners_25.png"
            width={1000}
            height={500}
            draggable={false}
            alt="partners"
            className="w-full h-auto pointer-events-none object-contain select-none"
            fetchPriority="high"
            quality={100}
            priority={true}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} ACGC Guest Communication. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


// function TextIcon({ text, icon }: { text: string, icon: React.ReactNode }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="bg-amber-500 p-2 rounded-full">
//         {icon}
//       </div>
//       <p className="text-foreground">{text}</p>
//     </div>
//   )
// }



