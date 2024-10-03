"use client";

import { ConferenceSchedule } from "@/components/conference-schedule";
import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { useEffect, useState } from "react";
import { ConferenceScheduleProps } from "../types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createConferenceSchedules, getConferenceSchedule } from "../actions/timeline";

// import { getConferenceSchedule } from "@/app/actions/timeline";
// import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const { data, refetch } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        staleTime: 1000 * 60 * 10 // 
    });
    const [schedules, setSchedules] = useState<ConferenceScheduleProps[]>([]);

    const mutate = useMutation({
        mutationFn: createConferenceSchedules,
        onSuccess: () => {
            refetch();
        }
    })
    useEffect(() => {
        if (data) {
            // alert("Data fetched")
            setSchedules(data);
        }
    }, [data]);

    async function mutateSchedules() {
        try {
            await mutate.mutateAsync(schedules)
                .then(() => {
                    alert("Schedules saved successfully")
                })
                .catch((error) => {
                    console.log(error);
                    alert("Failed to save schedules")
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
            <div>
                <ConferenceScheduleForms schedules={schedules || []} onChange={setSchedules} />
            </div>
            <div className="sticky top-6 h-fit bg-gray-100">
                <div className="px-8 flex justify-between items-center sticky z-20 top-0 bg-white w-full">
                    <h1 className="text-primary-purple text-xl font-bold p-4">Preview</h1>
                    <Button
                        onClick={mutateSchedules}
                        size={"sm"}
                        variant={"default"}
                        disabled={!schedules?.length || mutate?.isPending}
                        className="bg-primary-main text-white rounded-lg">
                        <Save className="w-4 h-4 mr-2 " />
                        {mutate.isPending ? "Saving..." : "Save changes"}
                    </Button>
                </div>
                {/* time line preview */}
                <div className="p-4 flex-col">
                    {schedules?.map((schedule, index) => (
                        <ConferenceSchedule
                            key={index}
                            {...schedule}
                        />
                    ))}
                </div>
                {/* save button */}
                {/* <div className="p-4 flex justify-center">
                    <Button
                        onClick={mutateSchedules}
                        size={"lg"}
                        variant={"default"}
                        disabled={!schedules?.length || mutate?.isPending}
                        className="w-full" type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {mutate.isPending ? "Saving..." : "Save changes"}
                    </Button>
                </div> */}
            </div>
        </div>
    )
}
