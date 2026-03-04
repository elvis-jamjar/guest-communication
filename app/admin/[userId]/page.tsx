"use client";
import { ConferenceScheduleForms } from "@/components/conference-schedule-form";
import { LandingPageContent } from "@/components/landing-page-content";
import { ScreenSimulator } from "@/components/screen-simulation";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { ExternalLink, History, Redo2, Save, Send, Undo2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ConferenceScheduleData } from "../../../types";
import {
    getActivityLog,
    getConferenceSchedule,
    getDraft,
    publishDraft,
    rollbackToSnapshot,
    saveDraft,
} from "../../actions/timeline";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

type PreviewMode = "live" | "draft" | "edits";

export default function Home() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [previewingTimestamp, setPreviewingTimestamp] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<PreviewMode>("edits");

    const { data, refetch } = useQuery({
        queryKey: ['conference-schedules'],
        queryFn: async () => await getConferenceSchedule(),
        staleTime: 1000 * 60 * 10,
    });

    const { data: draftData, refetch: refetchDraft } = useQuery({
        queryKey: ['draft'],
        queryFn: getDraft,
        staleTime: 1000 * 60,
    });

    const defaultData: ConferenceScheduleData = { schedule: [] };
    const undoRedo = useUndoRedo<ConferenceScheduleData>(defaultData);
    const scheduleData = undoRedo.value;
    const { data: activityLog, refetch: refetchActivityLog, isLoading: isActivityLogLoading } = useQuery({
        queryKey: ["activity-log"],
        queryFn: () => getActivityLog(),
        enabled: isHistoryOpen,
    });
    const saveDraftMutation = useMutation({
        mutationFn: saveDraft,
        onSuccess: () => {
            refetchDraft();
        }
    });
    const publishMutation = useMutation({
        mutationFn: publishDraft,
        onSuccess: async (result) => {
            if (result?.success) {
                const res = await refetch();
                refetchDraft();
                if (res.data) undoRedo.reset(res.data);
            }
        }
    });
    const rollbackMutation = useMutation({
        mutationFn: rollbackToSnapshot,
        onSuccess: (restored) => {
            if (restored) {
                undoRedo.reset(restored);
                refetch();
                refetchActivityLog();
                setIsHistoryOpen(false);
            }
        }
    });

    useEffect(() => {
        if (data) {
            undoRedo.reset(data);
        }
    }, [data, undoRedo.reset]);

    const handleUndo = useCallback(() => undoRedo.undo(), [undoRedo]);
    const handleRedo = useCallback(() => undoRedo.redo(), [undoRedo]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleUndo, handleRedo]);



    async function handleSaveDraft() {
        try {
            const payload: ConferenceScheduleData = {
                ...scheduleData,
                schedule: scheduleData?.schedule ?? [],
            };
            await saveDraftMutation.mutateAsync(payload);
            alert("Draft saved successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to save draft");
        }
    }

    async function handlePublish() {
        try {
            const payload: ConferenceScheduleData = {
                ...scheduleData,
                schedule: scheduleData?.schedule ?? [],
            };
            await saveDraftMutation.mutateAsync(payload);
            const result = await publishMutation.mutateAsync();
            if (result?.success) {
                alert("Published successfully");
            } else {
                alert(result?.error ?? "Failed to publish");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to publish");
        }
    }

    const previewContent = (() => {
        switch (previewMode) {
            case "live":
                return data ?? defaultData;
            case "draft":
                return draftData ?? scheduleData ?? defaultData;
            case "edits":
            default:
                return scheduleData ?? defaultData;
        }
    })();

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] h-screen max-w-full rounded-lg border md:min-w-[450px]">
            <ResizablePanel defaultSize={20} minSize={20}>
                <ScrollArea className="h-[99dvh]">
                    <div className="space-y-2 p-4">
                        <ConferenceScheduleForms
                            scheduleData={(scheduleData ?? { schedule: [] }) as ConferenceScheduleData}
                            onChange={undoRedo.set}
                        />
                    </div>
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={60}
                minSize={40}>
                <div className=" bg-gray-100 relative flex p-4 flex-col gap-2">
                    <div className="px-2 flex flex-col sm:flex-row justify-between gap-2 bg-gray-100 items-start sm:items-center sticky top-0 z-20 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUndo}
                                disabled={!undoRedo.canUndo}
                                className="rounded-lg"
                                title="Undo (Ctrl+Z)">
                                <Undo2 className="w-4 h-4 mr-2" />
                                Undo
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRedo}
                                disabled={!undoRedo.canRedo}
                                className="rounded-lg"
                                title="Redo (Ctrl+Shift+Z)">
                                <Redo2 className="w-4 h-4 mr-2" />
                                Redo
                            </Button>
                            <Button
                                onClick={handleSaveDraft}
                                size="sm"
                                variant="outline"
                                disabled={!scheduleData || saveDraftMutation.isPending}
                                className="rounded-lg">
                                <Save className="w-4 h-4 mr-2" />
                                {saveDraftMutation.isPending ? "Saving..." : "Save draft"}
                            </Button>
                            <Button
                                onClick={handlePublish}
                                size="sm"
                                variant="default"
                                disabled={!scheduleData || publishMutation.isPending}
                                className="bg-secondary-main text-white rounded-lg">
                                <Send className="w-4 h-4 mr-2" />
                                {publishMutation.isPending ? "Publishing..." : "Publish"}
                            </Button>
                            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsHistoryOpen(true)}
                                    className="rounded-lg">
                                    <History className="w-4 h-4 mr-2" />
                                    History
                                </Button>
                                <SheetContent side="right" className="w-full sm:max-w-md">
                                    <SheetHeader>
                                        <SheetTitle>Activity log</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
                                        {isActivityLogLoading && (
                                            <p className="text-sm text-muted-foreground py-4">Loading...</p>
                                        )}
                                        {!isActivityLogLoading && activityLog?.length === 0 && (
                                            <p className="text-sm text-muted-foreground py-4">
                                                No history yet. Save changes to create snapshots.
                                            </p>
                                        )}
                                        <ul className="space-y-2">
                                            {activityLog?.map((snapshot) => (
                                                <li
                                                    key={snapshot.timestamp}
                                                    className="rounded-lg border p-3 text-sm space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-muted-foreground">
                                                            {new Date(snapshot.timestamp).toLocaleString()}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 px-2 text-xs"
                                                                onClick={() =>
                                                                    setPreviewingTimestamp(
                                                                        previewingTimestamp === snapshot.timestamp
                                                                            ? null
                                                                            : snapshot.timestamp
                                                                    )
                                                                }>
                                                                {previewingTimestamp === snapshot.timestamp ? "Hide JSON" : "Preview JSON"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                disabled={rollbackMutation.isPending}
                                                                onClick={() => {
                                                                    const date = new Date(snapshot.timestamp).toLocaleString();
                                                                    if (window.confirm(`Restore to snapshot from ${date}? This will replace your current data.`)) {
                                                                        rollbackMutation.mutate(snapshot.timestamp);
                                                                    }
                                                                }}>
                                                                {rollbackMutation.isPending ? "Rolling back..." : "Rollback"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {previewingTimestamp === snapshot.timestamp && (
                                                        <ScrollArea className="h-[200px] rounded-md border bg-muted/50 p-3">
                                                            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                                                {JSON.stringify(snapshot.data, null, 2)}
                                                            </pre>
                                                        </ScrollArea>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                            <Tabs
                                value={previewMode}
                                onValueChange={(v) => setPreviewMode(v as PreviewMode)}
                                className="ml-auto">
                                <TabsList className="h-8">
                                    <TabsTrigger value="edits" className="text-xs px-2">
                                        Edits
                                    </TabsTrigger>
                                    <TabsTrigger value="draft" className="text-xs px-2">
                                        Draft
                                    </TabsTrigger>
                                    <TabsTrigger value="live" className="text-xs px-2">
                                        Live
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Button variant="outline" size="sm" className="rounded-lg" asChild>
                                <Link href="/?preview=true" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open preview
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <ScreenSimulator
                        previewLabel={
                            previewMode === "live"
                                ? "Live preview"
                                : previewMode === "draft"
                                    ? "Draft preview"
                                    : "Edits preview"
                        }
                        landingPageContent={
                            <LandingPageContent
                                data={previewContent}
                                visibilityConfig={previewContent?.visibilityConfig}
                                isLoading={false}
                                isPreview={true}
                            />
                        }
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
