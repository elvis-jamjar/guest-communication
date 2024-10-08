"use client";

import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { useEffect, useState } from "react";
import { ConferenceScheduleProps, PageContent } from "../../types";
import { Button } from "@/components/ui/button";
import { Grid2X2, Rows3, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createConferenceSchedules, createConferenceSettings, createPageContent, getConferenceSchedule, getConferenceSettings, getPageContent } from "../../actions/timeline";
import { ScheduleList } from "@/components/schedule-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React from "react";
import { PageContentDisplayComponent } from "@/components/page-content-display";
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
            className="min-h-[200px] h-screen max-w-full rounded-lg border md:min-w-[450px]"
        >
            <ResizablePanel defaultSize={40} minSize={20}>
                <ScrollArea className="h-[99dvh]">
                    <ConferenceScheduleForms schedules={schedules || []} onChange={setSchedules}
                        pageContent={pageContent || {}} onPageContentChange={setPageContent}
                    />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={60}
                minSize={60}
            >
                <ScrollArea className="h-[99dvh] bg-gray-100 relative">
                    <div className="px-8 flex justify-between bg-gray-100 items-center sticky top-0 z-20 w-full">
                        <div className="flex items-center gap-4">
                            <h1 className="text-primary-purple text-xl font-bold p-4">Preview</h1>
                            {/* toggle 2 column and 1 */}
                            <div className="flex gap-0 ring-1 ring-primary-main rounded-md p-0.5">
                                <Button size="sm" variant={columns === 2 ? "default" : "secondary"}
                                    onClick={toggleColumns} className="">
                                    <Grid2X2 className="w-4 h-4 " />
                                </Button>
                                <Button size="sm" variant={columns === 1 ? "default" : "secondary"}
                                    onClick={toggleColumns} className="">
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
                    <hr className="border-t border-gray-300" />
                    <div className="px-8 flex justify-between bg-gray-100 items-center sticky top-0 z-20 w-full">
                        <div className="flex items-center gap-4">
                            <h1 className="text-primary-purple text-xl font-bold p-4">Page content Preview</h1>
                        </div>
                        <Button
                            onClick={mutatePageContentData}
                            size={"sm"}
                            variant={"default"}
                            disabled={!schedules?.length || mutate?.isPending}
                            className="bg-primary-main text-white rounded-lg">
                            <Save className="w-4 h-4 mr-2 " />
                            {mutatePageContent.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                    <PageContentDisplayComponent {...pageContent} />
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
