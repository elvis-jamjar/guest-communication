'use client';
import { ConferenceScheduleProps, Speaker } from "@/app/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

export default function AllSpeakerList({ isAdmin = false, schedules }: { isAdmin?: boolean, schedules: ConferenceScheduleProps[] }) {
    // const { data: speackers } = useQuery({
    //     queryKey: ['speakers'],
    //     queryFn: async () => await getSpeakers(),
    //     refetchInterval: 90000, // 1 minute 20 seconds
    // });
    const [speackers, setSpeackers] = useState<Speaker[]>([]);

    useEffect(() => {
        function onInit() {
            const speakers: Speaker[] = [];
            schedules.forEach((item) => {
                if (item.timeLineItems) {
                    item?.timeLineItems?.forEach((t) => {
                        if (t.speakers) {
                            t.speakers.forEach((s) => {
                                if (s.visibleOnPage && s?.name) {
                                    speakers.push(s);
                                }
                            });
                        }
                    });
                }
            });
            setSpeackers(speakers);
        }
        if (Number(schedules?.length) > 0) {
            onInit();
        }
    }, [schedules]);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4", isAdmin && "md:grid-cols-3")}>
            {
                speackers?.map((speaker, index) => (
                    <Card key={index} className="w-full h-full p-4 shadow-none border-0">
                        <CardContent className="flex flex-col items-center space-y-4">
                            <div className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden">
                                <Image
                                    src={speaker?.photo || ''}
                                    width={400}
                                    height={400}
                                    priority
                                    alt="speaker"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className=" space-y-0 flex-col">
                                <h2 className="text-primary-main text-lg text-center font-semibold">{speaker?.name?.replace(':', '')}</h2>
                                <p className="text-secondary-main text-md text-center">{speaker?.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}   