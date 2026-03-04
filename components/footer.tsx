'use client'
import { getConferenceSchedule } from "@/app/actions/timeline";
import { useSectionVisibility } from "@/lib/visibility-provider";
import { mergePageContent } from "@/utils/default-page-content";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Footer() {
    const showFooter = useSectionVisibility("footer");
    const { data } = useQuery({
        queryKey: ["conference-schedules"],
        queryFn: getConferenceSchedule,
        staleTime: 1000 * 60 * 5,
    });
    const content = mergePageContent(data?.pageContent);

    return (
        <footer
            className={cn("text-white bg-primary-main", !showFooter && "hidden")}>
            <div className="bg-secondary-main mx-auto py-6 px-2">
                <p className="text-white text-2xl text-center text-pretty tracking-wide font-extrabold">{content.footer?.inquiryText ?? "Send inquiries to info@jamjargh.com"}</p>
            </div>
            <div className="py-20 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                    <div className="flex items-center rounded-full p-5 bg-white">
                        <Image
                            src="/images/4dx/new/4dx_logo.png"
                            width={600}
                            height={600}
                            priority
                            alt="4dx"
                            className="size-28 object-contain"
                        />
                    </div>
                    <p className="text-left text-sm leading-relaxed max-w-xs">
                        {content.footer?.description ?? "4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community."}
                    </p>
                </div>
                <div className="flex gap-6 flex-col items-center justify-center">
                    <div className="flex gap-4">
                        <a href={content.footer?.linkedinUrl ?? "https://www.linkedin.com/company/4dx-ventures/"} target="_blank" rel="noreferrer">
                            <Image src="/images/4dx/linkedin.png" width={200} height={200} alt="linkedin" className="w-12 h-12 object-contain" />
                        </a>
                        <a href={content.footer?.websiteUrl ?? "https://www.4dxventures.com/"} target="_blank" rel="noreferrer">
                            <Image src="/images/4dx/globe.png" width={200} height={200} alt="twitter" className="w-12 h-12 object-contain" />
                        </a>
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
    )
}