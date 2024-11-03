'use client';
import { ConferenceScheduleProps, Speaker } from "@/app/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HeadingText } from "./heading-text";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function AllSpeakerList({ isAdmin = false, schedules, isLoading }: { isAdmin?: boolean, schedules: ConferenceScheduleProps[], isLoading: boolean }) {
    const [isOpen, setIsOpen] = useState(true);
    const [speackers, setSpeackers] = useState<Speaker[]>([]);

    useEffect(() => {
        function onInit() {
            let speakers: Speaker[] = [];
            schedules.forEach((item) => {
                if (item.timeLineItems) {
                    item?.timeLineItems?.forEach((t) => {
                        if (t?.speakers) {
                            t?.speakers?.forEach((s) => {
                                if (s?.visibleOnPage && s?.name) {
                                    speakers.push(s);
                                }
                            });
                        }
                        if (t?.moderators) {
                            t?.moderators.forEach((s) => {
                                if (s?.visibleOnPage && s?.name) {
                                    // replace  Moderated by: with empty string
                                    const _name = s?.name?.replace('Moderated by:', '').replaceAll(':', '')?.trim();
                                    speakers.push({ ...s, name: _name });
                                }
                            });
                        }
                    });
                }
            });
            setSpeackers([...speakers]);
        }
        if (Number(schedules?.length) > 0) {
            onInit();
        }
    }, [schedules]);


    return (
        // <div>
        //     <HeadingText text="Speakers" iconNode={<Users2 className="text-secondary-main w-12 h-12" />} />
        // </div>
        <div className="rounded-2xl">
            {/* <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle speakers</span>
            </Button> */}
            <motion.button
                className="flex justify-center hover:bg-secondary-main/10 rounded-2xl w-full gap-4 mb-4 items-center p-2 md:px-16 text-center focus:outline-none"
                initial={false}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls={`accordion-content`}>
                <HeadingText
                    containerClassName={cn("w-fit py-0 md:py-0 p-0 m-0")}
                    text="Speakers" iconNode={<Users className="text-secondary-main size-8 md:size-12" />} />
                {/* <div className="flex items-center gap-4">
                    <Users className="text-secondary-main size-8" />
                    <span className="text-secondary-main text-2xl text-pretty font-semibold">Speakers</span>
                </div> */}
                <motion.span
                    animate={{
                        rotate: isOpen ? 180 : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="size-8 text-secondary-main" aria-hidden="true" />
                </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
                {
                    isOpen && isLoading && <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
                        {Array.from({ length: 8 })?.map((_, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-3 w-36" />
                            </div>
                        ))}
                    </div>
                }
                {isOpen && !isLoading && <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}>
                    <motion.div
                        variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
                        transition={{ duration: 0.4 }}
                        className={cn(`grid grid-cols-2 pb-4 md:grid-cols-4 gap-4 justify-center items-center`, isAdmin && "md:grid-cols-3")}>
                        {
                            speackers?.map((speaker, index) => {
                                return (
                                    <Card key={index} className={cn("w-full h-full p-0 md:p-2 shadow-none border-0")}>
                                        <CardContent className="flex flex-col p-0 items-center space-y-4">
                                            <div className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={speaker?.photo || ''}
                                                    width={400}
                                                    height={400}
                                                    priority
                                                    fetchPriority="high"
                                                    loading="eager"
                                                    alt="speaker"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="w-full space-y-0 flex-col font-semibold text-pretty leading-snug">
                                                <p className="text-primary-main text-base text-center font-semibold">{speaker?.name?.replace(':', '')}</p>
                                                <p className="text-secondary-main text-base text-pretty text-center">{speaker?.title?.split(',')?.at(0)}</p>
                                                <p className="text-secondary-main text-base text-pretty text-center">{speaker?.title?.split(',')?.at(1)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                )
                            })
                        }
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}   