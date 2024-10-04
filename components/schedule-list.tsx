'use client'

import { ConferenceScheduleProps } from "@/app/types";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ConferenceSchedule } from "./conference-schedule";


export function ScheduleList(
    { schedules, columns = 2 }: { schedules: ConferenceScheduleProps[], columns?: number }
) {

    return (
        <Accordion type="multiple" defaultValue={["item-0"]} className="mx-auto max-w-5xl">
            {schedules?.map((schedule, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="my-1 border-none">
                    <AccordionTrigger className="decoration-transparent rounded-md py-1 px-8 flex justify-start">
                        <div className={cn("text-white text-lg w-full flex justify-start font-bold py-2 px-4 rounded-full", schedule?.day && 'bg-primary-main')}>
                            {schedule?.day}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex-col min-h-44">
                        <h1 className="text-primary-purple px-14 text-left mt-4 text-xl font-bold">{schedule?.title}</h1>
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