'use client'

import { ConferenceScheduleProps } from "@/app/types";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ConferenceSchedule } from "./conference-schedule";
// import { useParams } from "next/navigation";
// import { useParams } from "next/navigation";


export function ScheduleList(
    { schedules, columns = 1 }: { schedules: ConferenceScheduleProps[], columns?: number }
) {
    // const { userId } = useParams<{ userId?: string }>();
    // const isSingle = userId ? 'single' : 'multiple';
    // const defaultValue = userId ? [`item-0`] : ["item-0"];
    return (
        <Accordion type={'multiple'} className="mx-auto max-w-5xl">
            {schedules?.map((schedule, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="my-1 border-none p-2">
                    <AccordionTrigger className="decoration-transparent rounded-md py-1 flex justify-start">
                        <div className={cn("flex gap-3 md:gap-5 w-full items-center flex-wrap p-2 justify-start bg-primary-purple/10 rounded-3xl md:rounded-full")}>
                            <h2 className="font-bold text-lg text-white w-full md:w-fit py-2 px-6 rounded-2xl md:rounded-full bg-primary-main">{schedule?.day}</h2>
                            <span className="text-primary-purple w-fit px-1.5 md:px-0 text-left text-xl font-bold">{schedule?.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex-col min-h-44">
                        <ConferenceSchedule
                            key={index}
                            {...schedule}
                            columns={columns}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}