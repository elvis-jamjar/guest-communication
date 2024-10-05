"use client"

import { ConferenceSchedule } from "@/components/conference-schedule";
import Image from "next/image";
import React from "react";
import { Separator } from "@/components/ui/separator"
import { Globe, Linkedin, Mail, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getConferenceSchedule } from "./actions/timeline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScheduleList } from "@/components/schedule-list";

const textIconData = [
  {
    text: 'www.acgc.africa',
    icon: <Globe className="w-4 h-4" />
  },
  {
    text: '@african_inhouse',
    // twitter icon
    icon: <Twitter className="w-4 h-4" />
  },
  {
    text: 'mail@acgc.africa',
    icon: <Mail className="w-4 h-4" />
  },
  {
    text: 'ACGC (African Corprate Government Counsel Forum)',
    icon: <Linkedin className="w-4 h-4" />
  }
]

const sections = ["about", "program", "sponsors", "partners"];
export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['conference-schedules'],
    queryFn: async () => await getConferenceSchedule(),
    staleTime: 1000 * 60 * 10 //  10 minutes
  });
  const [isSelectedSection, setIsSelectedSection] = React.useState<string | null>(null);
  // const [isClicked, setIsClicked] = React.useState<boolean>(false);
  function scrollToSection(id: string) {
    // setIsClicked(true);
    setIsSelectedSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // setTimeout(() => setIsClicked(false), 1000);
  }

  // scroll to program section on load
  React.useEffect(() => {
    const element = document.getElementById("program");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // listen for scroll events to update the selected section
  React.useEffect(() => {
    function handleScroll() {
      // check if the section is in view at least 20% to select it
      const selectedSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
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
      <header className="bg-white py-4 px-1.5 sticky z-30 top-0 backdrop-blur-sm bg-opacity-80 w-full">
        <div className="container mx-auto  max-w-5xl md:px-8 flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold">ACGC</h1> */}
          <Image src="/images/logo.png" width={60} height={60} alt="ACGC" className="w-16 md:w-24 h-12 object-contain rounded-xl" />
          <nav className="flex items-center gap-2">
            {
              sections?.map((section, index) => {
                return (
                  <Button
                    key={section}
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => scrollToSection(section)}
                    className={cn("px-2 py-1 text-xs font-semibold rounded-md hover:opacity-80 transition-all duration-500 hover:bg-primary-main hover:text-gray-100" + (isSelectedSection === section ? " bg-primary-main text-gray-100" : ""), (index > 2) && 'hidden md:flex')}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Button>
                )
              })
            }
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id={"about"} className="text-white bg-gray-50 h-fit w-full relative">
        <div className="max-w-5xl flex flex-col gap-6 mx-auto p-4">
          {/* Header Section */}
          <header className="flex items-center py-4">
            <div className="flex flex-wrap items-center md:px-8">
              <Image src="/images/logo.png" width={100} height={100} alt="ACGC Logo" className="w-64 h-auto rounded-xl" />
            </div>
          </header>
          {/* Conference Title */}
          <section className="flex-col flex-wrap w-full rounded-lg text-center mb-8 px-4">
            <div className="grid grid-cols-1 gap-0 space-y-0 w-fit md:px-9">
              <h2 className="bg-primary-main col-span-2 px-2 w-fit leading-relaxed font-extrabold text-2xl md:text-5xl">
                6th Annual
              </h2> <br />
              <h2 className="w-fit text-left px-2 leading-relaxed bg-primary-main font-extrabold text-2xl md:text-5xl">
                ACGC Conference
              </h2>
            </div>
            <div className="w-full flex flex-wrap justify-between gap-8">
              <div>
                <Image src="/images/ACGC_text.png" width={200} height={200} alt="ACGC Logo" className="w-[500px] h-auto rounded-xl" />
              </div>
              <Separator orientation="vertical" className="bg-slate-900 h-72 hidden md:flex" />
              <Separator orientation="horizontal" className="bg-slate-900 w-full my-4 flex md:hidden" />
              <div className="space-y-2 text-foreground">
                <h2 className="text-2xl font-bold">9th - 11th October, 2024</h2>
                <div className="py-2 flex flex-col w-fit">
                  {
                    ["Labadi Beach Hotel,", "1 Labadi By-Pass,", "Accra, Ghana."].map((line, index) => (
                      <p key={index} className="text-2xl text-left font-thin">{line}</p>
                    ))
                  }
                </div>
                <div className="pt-2">
                  <p className="text-xl text-left font-semibold">#ACGC4B</p>
                  <p className="text-xl text-left font-semibold">#AfricanInHouse</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-main flex rounded-bl-xl text-white top-0 right-0 h-44 md:h-64 w-6 md:w-16 absolute items-center justify-center">
              <p className="transform -rotate-90 text-sm md:text-xl whitespace-nowrap font-bold">
                Conference Programme
              </p>
            </div>
          </section>
          {/* social media */}
          <div className="mt-6 flex gap-10 flex-wrap justify-between px-4 md:px-8">
            {
              textIconData.map((social, index) => (
                <TextIcon key={index} text={social?.text} icon={social?.icon} />
              ))
            }
          </div>
        </div>

      </section>

      {/* Program Section */}
      <section id="program" className="py-20 bg-gray-100 md:min-h-[10dvh]">
        {
          isLoading && <div className="text-center">
            <p>Loading...</p>
          </div>
        }
        {
          data &&
          <ScheduleList schedules={data} columns={2} />
        }
      </section>
      {/* sponsors */}
      <section id="sponsors" className="py-16 bg-white">
        <div className="mx-auto container max-w-5xl">
          <Image src="/images/sponsors.png" width={1000} height={200} alt="Sponsors" className="w-full h-auto object-contain" />
        </div>
      </section>
      {/* partners */}
      <section id="partners" className="py-16 bg-white mx-auto">
        <div className="mx-auto container max-w-5xl">
          <Image src="/images/partners.png" width={1000} height={200} alt="partners" className="w-full h-auto object-contain" />
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


function TextIcon({ text, icon }: { text: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-amber-500 p-2 rounded-full">
        {icon}
      </div>
      <p className="text-foreground">{text}</p>
    </div>
  )
}

