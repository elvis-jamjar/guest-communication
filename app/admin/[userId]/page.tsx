"use client";;
import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { QuickLinks } from "@/components/quick-links-section";
import { ScheduleList } from "@/components/schedule-list";
import { ScreenSimulator } from "@/components/screen-simulation";
import AllSpeakerList from "@/components/speaker-list";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createConferenceSchedules, getConferenceSchedule } from "../../actions/timeline";
import { ConferenceScheduleData } from "../../types";
// import { getConferenceSchedule } from "@/app/actions/timeline";
// import { useQuery } from "@tanstack/react-query";

export default function Home() {
    // const [columns, setColumns] = useState<number>(2);
    const pathName = usePathname();
    const { data, refetch } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        staleTime: 1000 * 60 * 10 // 
    });

    const [scheduleData, setScheduleData] = useState<ConferenceScheduleData>();
    const mutate = useMutation({
        mutationFn: createConferenceSchedules,
        onSuccess: () => {
            refetch();
        }
    });

    useEffect(() => {
        if (data) {
            // alert("Data fetched")
            setScheduleData(data);
        }
    }, [data]);

    useEffect(() => {
        if (pathName) {
            // hide hero-section
            document.getElementById('hero-section')?.classList.add('hidden');
        }
    }, [pathName]);



    async function mutateSchedules() {
        try {
            await mutate.mutateAsync(scheduleData as ConferenceScheduleData)
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
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] h-screen max-w-full rounded-lg border md:min-w-[450px]">
            <ResizablePanel defaultSize={20} minSize={20}>
                <ScrollArea className="h-[99dvh]">
                    <ConferenceScheduleForms scheduleData={scheduleData as ConferenceScheduleData} onChange={setScheduleData} />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={60}
                minSize={40}>
                <div className=" bg-gray-100 relative flex p-4 flex-col gap-2">
                    <div className=" px-2 flex justify-between bg-gray-100 items-center sticky top-0 z-20 w-full">
                        <Button
                            onClick={mutateSchedules}
                            size={"sm"}
                            variant={"default"}
                            disabled={!scheduleData || mutate?.isPending}
                            className="bg-secondary-main text-white rounded-lg">
                            <Save className="w-4 h-4 mr-2 " />
                            {mutate?.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                    <ScreenSimulator
                        desktopContent={<ScheduleList schedules={scheduleData?.schedule || []} />}
                        desktopSecondContent={<AllSpeakerList isAdmin={true} schedules={scheduleData?.schedule || []} isLoading={false} />}
                        mobileContent={<QuickLinks data={scheduleData?.quickLinkData} />}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
