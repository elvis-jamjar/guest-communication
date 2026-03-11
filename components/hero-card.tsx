'use client'

import { getConferenceSchedule } from "@/app/actions/timeline"
import { FormattedText } from "@/components/formatted-text"
import { ConferenceScheduleData } from "@/types"
import { mergePageContent } from "@/utils/default-page-content"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface HeroCardProps {
    /** When provided (e.g. in admin preview), use this instead of fetching */
    previewData?: ConferenceScheduleData | null;
}

export function HeroCard({ previewData }: HeroCardProps = {}) {
    const { data: fetchedData, isLoading } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        enabled: previewData === undefined,
    })
    const data = previewData !== undefined ? previewData : fetchedData
    const content = mergePageContent(data?.pageContent)

    return (
        <Card
            style={{
                boxShadow: "0px 0px 10px rgb(177, 177, 177)",
            }}
            className="md:w-[85%] md:max-w-[1000px] flex justify-center items-center m-2 md:mx-auto w-full min-h-fit md:p-12 p-4 py-10 md:py-12 shadow-2xl rounded-[1.8rem] border-none">
            <CardContent className="p-0 flex items-center justify-center py-0 px-0 min-w-0">
                <div className="flex flex-wrap md:flex-nowrap w-full justify-center items-center gap-5 md:gap-12 min-w-0">
                    <div className="flex flex-1 min-w-0 flex-col justify-center items-center md:basis-0">
                        <Image
                            src={"/images/4dx/new/stacked w venue_4dx summit logo.png"}
                            width={600}
                            height={600}
                            priority
                            alt="4dx"
                            className="md:size-80 size-60 object-contain"
                        />
                    </div>
                    <div className="w-full md:w-auto md:shrink-0 md:py-8 flex justify-center self-stretch">
                        <Separator orientation="vertical" className="h-full min-h-[120px] w-px mx-2 hidden md:block bg-gray-400" />
                        <Separator orientation="horizontal" className="w-full h-px md:hidden bg-gray-300" />
                    </div>
                    <div className="flex flex-col transition-all duration-700 w-full min-w-0 flex-1 md:basis-0 justify-center gap-5 items-center">
                        <div className={cn("flex flex-col font-semibold text-md md:text-lg text-pretty items-center text-center")}>
                            {/* <span>Welcome to the 4DX CEO Summit,</span>
                            <span>an exclusive annual event hosted</span>
                            <span>by 4DX Ventures.</span> */}
                            <h1 className="text-center max-w-md">
                                <FormattedText text={content.hero?.title ?? "Welcome to the 4DX CEO Summit website. We look forward to engaging sessions with you. Thank you for attending."} />
                            </h1>
                        </div>
                        {!isLoading && !data?.isEventStarted && <div className="flex-col flex gap-4">
                            <p className="text-secondary-main text-center pb-2 text-sm md:text-xl font-extrabold"><FormattedText text={content.hero?.actionButtons?.title ?? "Click below to complete your registration"} /></p>
                            <div className="flex flex-col items-center space-y-5 md:px-16">
                                <a target="_blank" rel="noreferrer" href={content.hero?.actionButtons?.button1?.link ?? "#"} className="w-full">
                                    <Button
                                        style={{
                                            fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                                        }}
                                        variant={"outline"}
                                        className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                                    ><FormattedText text={content.hero?.actionButtons?.button1?.text ?? "Already in Johannesburg"} /></Button>
                                </a>
                                <a target="_blank" rel="noreferrer" href={content.hero?.actionButtons?.button2?.link ?? "#"} className="w-full">
                                    <Button
                                        style={{
                                            fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                                        }}
                                        variant={"outline"}
                                        className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                                    ><FormattedText text={content.hero?.actionButtons?.button2?.text ?? "Flying to Johannesburg"} /></Button>
                                </a>
                            </div>

                        </div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}