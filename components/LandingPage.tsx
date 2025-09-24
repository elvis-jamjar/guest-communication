"use client"

import { PageQuickLinks } from "@/components/page-content-display";
import { ScheduleList } from "@/components/schedule-list";
import { ScheduleListSkeleton } from "@/components/schedule-list-skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
// import { Globe, Linkedin, Mail, Twitter, MessageCircle } from "lucide-react";
// import Image from "next/image";
import React from "react";
import { getPublishedData } from "@/app/actions/timeline";
// import Link from "next/link";
import HeroSection from "@/components/hero-section";
import { useMobile } from "@/hooks/use-mobile";
import { AllPartnerAndSponsors } from "./AllPartnerAndSponsors";

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
export default function LandingPage({ isPreview = false }: { isPreview?: boolean }) {
    const isMobile = useMobile();

    const { data, isLoading } = useQuery({
        queryKey: ['published-data', isPreview],
        queryFn: async () => await getPublishedData(isPreview),
        refetchInterval: isPreview ? false : 65000, // 1 minute 5 seconds
    });

    const [_isSelectedSection, setIsSelectedSection] = React.useState<string | null>(null);

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
            {/* preview banner */}
            {isPreview && <div className="bg-red-500 fixed top-0 left-0 right-0 z-50 text-white text-center py-1">
                <p>Preview Mode</p>
            </div>}
            {/* Hero Section */}
            <section className=" w-full relative h-auto"
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
                <HeroSection pageContent={data?.pageContent || {}} isLoading={isLoading} />
            </section>

            {/* <section id="about" className="py-20 bg-gray-100">
                <h2 className="text-2xl md:text-4xl font-semibold  text-primary-purple mb-4 text-center">About Us</h2>
                <AboutDescription className="text-black mx-auto container max-w-5xl text-justify px-2 md:px-0" aboutSection={data?.pageContent?.aboutSection || ''} />
            </section> */}

            {/* Program Section */}
            <section className="py-20 bg-gray-100 md:min-h-0">
                <h2 id="programme" className="text-2xl md:text-4xl font-semibold text-primary-purple mb-5 text-center">Programme</h2>
                {
                    isLoading && <ScheduleListSkeleton columns={1} />
                }
                {
                    data &&
                    <ScheduleList schedules={data.schedules || []} columns={data.settings?.columns} />
                }
            </section>
            {/* quick links */}
            <section id="quick-links" className="py-16 bg-white">
                <PageQuickLinks
                    pageContent={data?.pageContent || {}}
                    className={cn("container mx-auto max-w-5xl px-5 md:px-2")}
                />
            </section>
            {/* sponsors */}
            <section id="sponsors" className="py-16 px-4 bg-white">
                {/* <div className="mx-auto container max-w-5xl px-2 md:px-0 rounded-sm">
                    <Image
                        src="/images/sponsors_25.png"
                        width={1000}
                        height={500}
                        draggable={false}
                        fetchPriority="high"
                        quality={100}
                        priority={true}
                        alt="Sponsors"
                        className="w-full h-auto rounded-sm pointer-events-none object-contain select-none" />
                </div> */}
                <AllPartnerAndSponsors image={data?.allSponsorsBanner?.image || "/images/sponsors_25.png"} alt="Sponsors" className="mx-auto container max-w-5xl px-2 md:px-0 rounded-sm" />
            </section>
            {/* partners */}
            <section id="partners" className="py-16 px-2 bg-white mx-auto">
                {/* <div className="mx-auto container max-w-5xl rounded-sm">
                    <Image
                        src="/images/partners_25.png"
                        width={1000}
                        height={500}
                        draggable={false}
                        alt="partners"
                        className="w-full h-auto rounded-sm pointer-events-none object-contain select-none"
                        fetchPriority="high"
                        quality={100}
                        priority={true}
                    />
                </div> */}
                <AllPartnerAndSponsors image={data?.allPartnersBanner?.image || "/images/partners_25.png"} alt="Partners" className="mx-auto container max-w-5xl rounded-sm" />
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



