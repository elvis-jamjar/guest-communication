'use client';;
import { cn } from "@/lib/utils";
import { ConferenceScheduleProps } from "@/types";
import { ReusableAnimatedAccordion } from "./animated-accordion";
import { ConferenceSchedule } from "./conference-schedule";


export function ScheduleList(
    { schedules }: { schedules: ConferenceScheduleProps[], columns?: number }
) {

    return (
        <div className="border-primary-main border-2 rounded-[30px] mx-2 bg-white">
            <div className="bg-primary-main p-2 flex justify-center rounded-t-[28px]">
                <h3
                    style={{
                        fontSize: "clamp(1rem, 2vw, 2rem)"
                    }}
                    className="text-white font-extrabold">3rd - 6th November</h3>
            </div>

            <ReusableAnimatedAccordion
                items={
                    schedules?.map((schedule, index) => {
                        return {
                            title: <div className="flex w-full items-center gap-2">
                                <p className={cn("md:text-2xl font-extrabold text-lg mr-2  text-primary-main", schedule?.color?.day)}>
                                    {schedule.day}
                                </p>
                                <p className={cn("text-secondary-main md:text-lg text-sm font-thin", schedule?.color?.dayTitle)}>
                                    {schedule?.title}
                                </p>
                            </div>,
                            children: <div key={"main-" + index} className="flex flex-wrap md:flex-nowrap relative gap-4 ">
                                <div className="md:max-w-14 w-full hidden md:invisible md:grid">
                                    <h2 className={cn("text-2xl font-bold text-primary-main", schedule?.color?.day)}>
                                        {schedule?.day}
                                    </h2>
                                    <p className={cn("text-secondary-main font-semibold", schedule?.color?.dayTitle)}>
                                        {schedule?.title}
                                    </p>
                                </div>
                                <div
                                    className="flex-grow text-lg font-thin leading-snug tracking-tight text-balance md:p-8 md:px-14">
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
    )


}


