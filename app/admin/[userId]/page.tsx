"use client";

import { ConferenceSchedule } from "@/components/conference-schedule";
import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { useEffect, useState } from "react";
import { ConferenceScheduleProps } from "../../types";
import { Button } from "@/components/ui/button";
import { Flag, Grid2X2, Rows3, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createConferenceSchedules, getConferenceSchedule } from "../../actions/timeline";
import { Toggle } from "@/components/ui/toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScheduleList } from "@/components/schedule-list";
import { ScrollArea } from "@/components/ui/scroll-area";

// import { getConferenceSchedule } from "@/app/actions/timeline";
// import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const [columns, setColumns] = useState<number>(2);
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
            <ScrollArea className="h-screen">
                <ConferenceScheduleForms schedules={schedules || []} onChange={setSchedules} />
            </ScrollArea>
            <ScrollArea className="h-screen bg-gray-100 relative">
                <div className="px-8 flex justify-between bg-gray-100 items-center sticky top-0 z-20 w-full">
                    <div className="flex items-center gap-4">
                        <h1 className="text-primary-purple text-xl font-bold p-4">Preview</h1>
                        {/* toggle 2 column and 1 */}
                        <div className="flex gap-0 ring-1 ring-primary-main rounded-md p-0.5">
                            <Button size="sm" variant={columns === 2 ? "default" : "secondary"}
                                onClick={() => setColumns(2)} className="">
                                <Grid2X2 className="w-4 h-4 " />
                            </Button>
                            <Button size="sm" variant={columns === 1 ? "default" : "secondary"}
                                onClick={() => setColumns(1)} className="">
                                <Rows3 className="w-4 h-4 " />
                            </Button>
                        </div>
                    </div>
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
                <ScheduleList schedules={schedules} columns={columns} />
            </ScrollArea>
        </div>
    )
}
