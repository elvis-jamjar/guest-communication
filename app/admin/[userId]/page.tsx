"use client";;
import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { ScheduleList } from "@/components/schedule-list";
import { ScreenSimulator } from "@/components/screen-simulation";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { createConferenceSchedules, createConferenceSettings, createPageContent, getConferenceSchedule, getConferenceSettings, getPageContent } from "../../actions/timeline";
import { ConferenceScheduleProps, PageContent } from "../../types";
// import { getConferenceSchedule } from "@/app/actions/timeline";
// import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const [columns, setColumns] = useState<number>(2);

    const { data, refetch } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        staleTime: 1000 * 60 * 10 // 
    });
    const { data: settings, refetch: refetchSettings } = useQuery({
        queryKey: ['conference-settings'],
        queryFn: async () => await getConferenceSettings(),
        staleTime: 1000 * 60 * 10 // 
    });
    const { data: remotePageContent, refetch: refetchPageContent } = useQuery({
        queryKey: ['page-content'],
        queryFn: async () => await getPageContent(),
        staleTime: 1000 * 60 * 10 // 
    });

    const [schedules, setSchedules] = useState<ConferenceScheduleProps[]>([]);
    const [pageContent, setPageContent] = useState<PageContent | undefined>(remotePageContent);
    const mutate = useMutation({
        mutationFn: createConferenceSchedules,
        onSuccess: () => {
            refetch();
        }
    });
    const mutateSettings = useMutation({
        mutationFn: createConferenceSettings,
        onSuccess: () => {
            refetchSettings();
        }
    });
    const mutatePageContent = useMutation({
        mutationFn: createPageContent,
        onSuccess: () => {
            refetchPageContent();
        }
    });
    useEffect(() => {
        if (data) {
            // alert("Data fetched")
            setSchedules(data);
        }
    }, [data]);

    useEffect(() => {
        if (settings) {
            // alert(`Settings fetched ${settings?.columns}`)
            setColumns(settings?.columns || 2);
        }
    }, [settings]);

    // set page content
    useEffect(() => {
        if (remotePageContent) {
            setPageContent(remotePageContent);
        }
    }, [remotePageContent]);


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

    async function mutatePageContentData() {
        try {
            if (!pageContent) return;
            await mutatePageContent.mutateAsync(pageContent)
                .then(() => {
                    alert("Page content saved successfully")
                })
                .catch((error) => {
                    console.log(error);
                    alert("Failed to save page content")
                })
        } catch (error) {
            console.log(error);
        }
    }

    function toggleColumns() {
        setColumns(columns === 2 ? 1 : 2);
        mutateSettings.mutateAsync({ columns: columns === 2 ? 1 : 2 })
            .then(() => {
                // alert("Settings saved successfully")
            })
            .catch((error) => {
                console.log(error);
                // alert("Failed to save settings")
            });
    }

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] h-screen max-w-full rounded-lg border md:min-w-[450px]">
            <ResizablePanel defaultSize={20} minSize={20}>
                <ScrollArea className="h-[99dvh]">
                    <ConferenceScheduleForms schedules={schedules || []} onChange={setSchedules}
                        pageContent={pageContent || {}} onPageContentChange={setPageContent}
                    />
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
                            disabled={!schedules?.length || mutate?.isPending}
                            className="bg-secondary-main text-white rounded-lg">
                            <Save className="w-4 h-4 mr-2 " />
                            {mutate.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                    <ScreenSimulator
                        desktopContent={<ScheduleList schedules={schedules} />}
                    // desktopSecondContent={<ScheduleList schedules={schedules} />}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
