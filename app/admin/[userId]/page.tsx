"use client";

import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { useEffect, useMemo, useState } from "react";
import { ConferenceScheduleProps, LargeBanner, PageContent } from "../../types";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Eye, Grid2X2, Rows3, Save, Send, Bell } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateAllData, getData, publishData } from "../../actions/timeline";
import { ScheduleList } from "@/components/schedule-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React from "react";
import { PageContentDisplayComponent } from "@/components/page-content-display";
import { toast } from "sonner";
import { hasChanges } from "@/lib/utils";
import { AllPartnerAndSponsors } from "@/components/AllPartnerAndSponsors";
import Confirmation from "@/components/Confirmation";
import { DataHistory } from "@/components/DataHistory";
import Link from "next/link";

export default function Home({ params }: { params: { userId: string } }) {
    const { data, refetch } = useQuery({
        queryKey: ['admin-data'],
        queryFn: async () => await getData(),
        staleTime: 1000 * 60 * 10 // 
    });
    const [columns, setColumns] = useState<number>(Number(data?.settings.columns || 1));

    const [schedules, setSchedules] = useState<ConferenceScheduleProps[]>([]);
    const [pageContent, setPageContent] = useState<PageContent | undefined>(data?.pageContent || {});
    const [allSponsorsBanner, setAllSponsorsBanner] = useState<LargeBanner | undefined>(data?.allSponsorsBanner);
    const [allPartnersBanner, setAllPartnersBanner] = useState<LargeBanner | undefined>(data?.allPartnersBanner);

    const mutate = useMutation({
        mutationFn: updateAllData,
        onSuccess: () => {
            refetch();
            toast.success("Data saved successfully");
        },
        onError: (error) => {
            toast.error("Failed to save data");
            console.log(error);
        }
    });

    const handlePublishData = async () => {
        // save if data is changed
        if (isDataChanged) {
            await handleUpdateAllData();
        }
        await publishData()
    }

    // preview button
    const handlePreview = async () => {
        if (isDataChanged) {
            await handleUpdateAllData();
        }
        window.open("/preview", "_blank");
    }

    const publishMutation = useMutation({
        mutationFn: handlePublishData,
        onSuccess: () => {
            toast.success("Data published successfully");
        },
        onError: (error) => {
            toast.error("Failed to publish data");
            console.log(error);
        }
    });

    const previewMutation = useMutation({
        mutationFn: handlePreview,
        onSuccess: () => {
            toast.success("Preview opened successfully");
        },
        onError: (error) => {
            toast.error("Failed to open preview");
            console.log(error);
        }
    });

    useEffect(() => {
        if (data) {
            // alert("Data fetched")
            setSchedules(data.schedules);
            setColumns(Number(data.settings.columns || 1));
            setPageContent(data.pageContent);
            setAllSponsorsBanner(data.allSponsorsBanner);
            setAllPartnersBanner(data.allPartnersBanner);
        }
    }, [data]);

    const isDataChanged = useMemo(() => {
        return hasChanges(data, {
            ...data,
            schedules,
            pageContent: pageContent || {},
            settings: {
                ...data?.settings,
                columns
            },
            allSponsorsBanner: allSponsorsBanner || { image: "" },
            allPartnersBanner: allPartnersBanner || { image: "" }
        })
    }, [schedules, pageContent, columns, allSponsorsBanner, allPartnersBanner])


    const handleUpdateAllData = async () => {
        const dataToSave = {
            ...data,
            schedules,
            pageContent: pageContent || {},
            settings: {
                ...data?.settings,
                columns
            },
            allSponsorsBanner: allSponsorsBanner || data?.allSponsorsBanner,
            allPartnersBanner: allPartnersBanner || data?.allPartnersBanner
        }
        await mutate.mutateAsync(JSON.parse(JSON.stringify(dataToSave)));
    }




    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] h-screen max-w-full rounded-lg border md:min-w-[450px]"
        >
            <ResizablePanel defaultSize={30} minSize={28}>
                <ScrollArea className="h-[98dvh]">
                    <ConferenceScheduleForms
                        schedules={schedules || []}
                        onChange={setSchedules}
                        pageContent={pageContent || {}}
                        onPageContentChange={setPageContent}
                        onAllSponsorsBannerChange={setAllSponsorsBanner}
                        onAllPartnersBannerChange={setAllPartnersBanner}
                    />
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={60}
                minSize={60}>
                <ScrollArea className="h-[99dvh] bg-gray-100 pb-2 relative">
                    <div className="px-8 flex gap-2 justify-between bg-gray-100 items-center sticky top-0 z-20 w-full">
                        <div className="flex flex-1 items-center gap-4">
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
                        <div className="flex gap-2">
                            <DataHistory onRestored={() => refetch()} />
                            <Link href={`/admin/${params.userId}/notifications`}>
                                <Button
                                    size={"sm"}
                                    variant={"outline"}
                                    className="border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                            </Link>
                            <Button
                                onClick={handleUpdateAllData}
                                size={"sm"}
                                variant={"default"}
                                disabled={!schedules?.length || mutate?.isPending || !isDataChanged}
                                className="bg-primary-main text-white rounded-lg">
                                <Save className="w-4 h-4 mr-2 " />
                                {mutate.isPending ? "Saving..." : "Save changes"}
                            </Button>
                            <Button
                                onClick={() => previewMutation.mutateAsync()}
                                disabled={previewMutation.isPending}
                                size={"sm"}
                                variant={"default"}
                                className="bg-primary-main text-white rounded-lg">
                                <Eye className="w-4 h-4 mr-2 " />
                                Preview
                                <ArrowUpRight className="w-4 h-4 mr-2 " />
                            </Button>
                            <Confirmation
                                title="Publish Data"
                                description="Are you sure you want to publish the data?"
                                onConfirm={() => publishMutation.mutateAsync()}
                                trigger={<Button
                                    size={"sm"}
                                    variant={"default"}
                                    disabled={publishMutation.isPending}
                                    className="bg-primary-main text-white rounded-lg">
                                    <Send className="w-4 h-4 mr-2 " />
                                    {publishMutation.isPending ? "Publishing..." : "Publish"}
                                </Button>}
                            />

                        </div>
                    </div>
                    <ScheduleList schedules={schedules} columns={columns} />
                    <hr className="border-t my-4 border-gray-300" />
                    <div className="px-6 py-0">
                        <h2 className="text-primary-purple text-center text-xl font-bold p-4">Page content Preview</h2>
                        <PageContentDisplayComponent {...pageContent} className="py-0 max-w-5xl mx-auto" />
                    </div>
                    <hr className="border-t my-4 hidden border-gray-300" />
                    <div className="px-6 py-0">
                        <h2 className="text-primary-purple text-xl text-center font-bold p-6">Sponsors Preview</h2>
                        <AllPartnerAndSponsors image={allSponsorsBanner?.image || ""} alt="Sponsors" className="mx-auto container max-w-5xl px-2 md:px-0 rounded-sm" />
                    </div>
                    {/* <hr className="border-t border-gray-300" /> */}
                    <div className="px-6 py-0 pb-5">
                        <h2 className="text-primary-purple text-xl text-center font-bold p-6">Partners Preview</h2>
                        <AllPartnerAndSponsors image={allPartnersBanner?.image || ""} alt="Partners" className="mx-auto container max-w-5xl px-2 md:px-0 rounded-sm" />
                    </div>
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
