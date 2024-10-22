"use client";;
import { ScheduleList } from "@/components/schedule-list";
import { useQuery } from "@tanstack/react-query";
import { CalendarDaysIcon } from "lucide-react";
import React from "react";
import { getConferenceSchedule, getConferenceSettings } from "./actions/timeline";

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

const sections = ["about", "programme"];
// #ACGC4B, #Africaninhouse, #Generalcounselafrica, #Govtcounselafrica, #Corporatecounselafrica
// const hashTags = ["ACGC4B", "Africaninhouse", "Generalcounselafrica", "Govtcounselafrica", "Corporatecounselafrica"];
// const INTERVAL = 60000; // 1 minute
export default function Home() {
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
  // const { data: pageContent } = useQuery({
  //   queryKey: ['page-content'],
  //   queryFn: async () => await getPageContent(),
  //   refetchInterval: 90000, // 15 minutes
  // });

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
  // React.useEffect(() => {
  //   const element = document.getElementById("program");
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, []);

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
    <div className="min-h-screen">
      {/* Navbar */}
      {/* <header className="bg-white py-1 px-1.5 sticky z-30 top-0 backdrop-blur-sm bg-opacity-80 w-full">
        <div className="container mx-auto  max-w-5xl md:px-8 flex justify-between items-center">
          <Image src="/images/4dx/logo.png" width={400} height={400} alt="ACGC" className="w-16 h-auto object-cover rounded-xl" />
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
      </header> */}

      {/* Hero Section */}


      {/* Program Section */}
      <section id="programme" className="py-8 md:min-h-[10dvh] md:mx-40">
        <h1 className="text-center flex items-center justify-center text-secondary-main leading-normal tracking-tight text-4xl font-extrabold mb-8">
          <CalendarDaysIcon className="w-8 h-8 mr-4" />
          Program Outline
        </h1>
        {
          isLoading && <div className="text-center">
            <p>Loading...</p>
          </div>
        }
        {
          data &&
          <ScheduleList schedules={data} columns={settings?.columns} />
        }
      </section>
      {/* quick links */}
      {/* <section id="quick-links" className="py-16 bg-white">
        <PageQuickLinks
          pageContent={pageContent || {}}
          className={cn("container mx-auto max-w-5xl px-5 md:px-2")}
        />
      </section> */}
      {/* sponsors */}
      {/* <section id="sponsors" className="py-16 bg-white">
        <div className="mx-auto container max-w-5xl">
          <Image src="/images/sponsors.png" width={1000} height={200} alt="Sponsors" className="w-full h-auto object-contain" />
        </div>
      </section> */}
      {/* partners */}
      {/* <section id="partners" className="py-16 bg-white mx-auto">
        <div className="mx-auto container max-w-5xl">
          <Image src="/images/partners.png" width={1000} height={200} alt="partners" className="w-full h-auto object-contain" />
        </div>
      </section> */}

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



