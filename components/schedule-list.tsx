'use client';;
import { ConferenceScheduleProps } from "@/app/types";
import { cn } from "@/lib/utils";
import { ReusableAnimatedAccordion } from "./animated-accordion";
import { ConferenceSchedule } from "./conference-schedule";
// import { useParams } from "next/navigation";
// import { useParams } from "next/navigation";


export function ScheduleList(
    { schedules }: { schedules: ConferenceScheduleProps[], columns?: number }
) {

    // const { userId } = useParams<{ userId?: string }>();
    // const isSingle = userId ? 'single' : 'multiple';
    // const defaultValue = userId ? [`item-0`] : ["item-0"];
    return (
        //     // <Accordion type={'multiple'} className="mx-auto max-w-5xl">
        //     //     {schedules?.map((schedule, index) => (
        //     //         <AccordionItem value={`item-${index}`} key={index} className="my-1 border-none p-2">
        //     //             <AccordionTrigger className="decoration-transparent rounded-md py-1 flex justify-start">
        //     //                 <div className={cn("flex gap-3 md:gap-5 w-full items-center flex-wrap p-2 justify-start bg-secondary-main/10 rounded-3xl md:rounded-full")}>
        //     //                     <h2 className="font-bold text-lg text-white w-full md:w-fit py-2 px-6 rounded-2xl md:rounded-full bg-primary-main">{schedule?.day}</h2>
        //     //                     <span className="text-secondary-main w-fit px-1.5 md:px-0 text-left text-xl font-bold">{schedule?.title}</span>
        //     //                 </div>
        //     //             </AccordionTrigger>
        //     //             <AccordionContent className="flex-col min-h-44">
        //     //                 <ConferenceSchedule
        //     //                     key={index}
        //     //                     {...schedule}
        //     //                     columns={columns}
        //     //                 />
        //     //             </AccordionContent>
        //     //         </AccordionItem>
        //     //     ))}
        //     // </Accordion>

        <div className="border-primary-main border-2 rounded-[30px] mx-2 bg-white">
            <div className="bg-primary-main p-2 flex justify-center rounded-t-[28px]">
                <h3
                    style={{
                        fontSize: "clamp(1rem, 2vw, 2rem)"
                    }}
                    className="text-white font-semibold">3rd - 6th November</h3>
            </div>

            <div className="md:py-4 md:pb-1 space-y-8">
                <ReusableAnimatedAccordion
                    items={
                        schedules?.map((schedule, index) => {
                            return {
                                title: <div className="flex w-full items-center gap-2">
                                    <h2 className={cn("md:text-2xl text-lg mr-2 font-bold text-primary-main", schedule?.color?.day)}>
                                        {schedule.day}
                                    </h2>
                                    <p className={cn("text-secondary-main md:text-lg text-sm font-semibold", schedule?.color?.dayTitle)}>
                                        {schedule?.title}
                                    </p>
                                </div>,
                                children: <div key={"main-" + index} className="flex flex-wrap md:flex-nowrap relative gap-4 ">
                                    <div className="md:max-w-28 w-full">
                                        <h2 className={cn("text-2xl font-bold text-primary-main", schedule?.color?.day)}>
                                            {schedule.day}
                                        </h2>
                                        <p className={cn("text-secondary-main font-semibold", schedule?.color?.dayTitle)}>
                                            {schedule?.title}
                                        </p>
                                    </div>
                                    <div
                                        className="flex-grow text-lg font-thin leading-snug tracking-tight text-balance">
                                        <ConferenceSchedule
                                            {...schedule}
                                        />
                                    </div>
                                </div>
                            }
                        }) || []
                    }

                />


            </div>

        </div>
    )


}


