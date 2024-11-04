'use client'

import { getConferenceSchedule } from "@/app/actions/timeline"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export function HeroCard() {
    const { data, isLoading } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        // staleTime: 1000 * 60 * 10 // 
    })
    return (
        <Card
            style={{
                boxShadow: "0px 0px 10px rgb(177, 177, 177)",
            }}
            className="md:w-[60.5%] flex justify-center items-center m-2 md:mx-auto w-full md:h-fit lg:min-h-[440px] h-fit md:p-12 p-4 py-10 md:py-12 shadow-2xl rounded-[1.8rem] border-none">
            <CardContent className="p-0 flex items-centerjustify-center py-0 px-0">
                <div className="flex flex-wrap w-full justify-center  items-center h-full gap-5 md:gap-12">
                    <div className="flex flex-1 min-w-[200px] h-full w-full flex-col justify-center  items-center">
                        <Image
                            src={"/images/4dx/new/stacked w venue_4dx summit logo.png"}
                            width={600}
                            height={600}
                            priority
                            alt="4dx"
                            className="md:size-80 size-60 object-contain"
                        />
                    </div>
                    <div className="w-full col-span-1 md:w-2 md:h-80 md:py-8 flex justify-center">
                        <Separator orientation="vertical" className="h-full ml-2 border-[0.2px] hidden md:block" />
                        <Separator orientation="horizontal" className="w-full border-[0.2px] md:hidden" />
                    </div>
                    <div className="flex-col transition-all duration-700 w-full h-full flex-1 justify-center gap-5 flex items-center">
                        <div className={cn("flex flex-col font-semibold text-md md:text-lg text-pretty items-center text-center")}>
                            {/* <span>Welcome to the 4DX CEO Summit,</span>
                            <span>an exclusive annual event hosted</span>
                            <span>by 4DX Ventures.</span> */}
                            <h1 className="text-center max-w-xs">
                                Welcome to the 4DX CEO Summit, an exclusive annual event hosted by 4DX Ventures.
                            </h1>
                        </div>
                        {!isLoading && !data?.isEventStarted && <div className="flex-col flex gap-4">
                            <p className="text-secondary-main text-center pb-2 text-sm md:text-xl font-extrabold">Click below to complete your registration</p>
                            <div className="flex flex-col items-center space-y-5 md:px-16">
                                <a target="_blank" href="https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1" className="w-full">
                                    <Button
                                        style={{
                                            fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                                        }}
                                        variant={"outline"}
                                        className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                                    >Already in Johannesburg</Button>
                                </a>
                                <a target="_blank" href="https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC" className="w-full">
                                    <Button
                                        style={{
                                            fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                                        }}
                                        variant={"outline"}
                                        className="p-8 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                                    >Flying to Johannesburg</Button>
                                </a>
                            </div>

                        </div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}