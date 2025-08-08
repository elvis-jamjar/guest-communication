"use client";

import { useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getHistoryData, updateAllData } from "@/app/actions/timeline";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw } from "lucide-react";
import type { DataType } from "@/app/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


export function DataHistory({ onRestored }: { onRestored?: () => void }) {
    const [open, setOpen] = useState(false);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-data-history", open],
        queryFn: async () => await getHistoryData(),
        staleTime: 1000,
        enabled: open,
    });

    const historyList = useMemo(() => {
        const entries = Object.entries(data || {}) as Array<[
            string,
            DataType
        ]>;
        // sort by timestamp desc (keys are formatted "YYYY-MM-DD HH:mm:ss")
        return entries.sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0));
    }, [data]);

    const restoreMutation = useMutation({
        mutationFn: async (payload: DataType) => await updateAllData(payload),
        onSuccess: () => {
            toast.success("Snapshot restored");
            onRestored?.();
        },
        onError: () => toast.error("Failed to restore snapshot"),
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    History
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
                <div className="p-6 pb-2">
                    <SheetHeader>
                        <SheetTitle>Data history</SheetTitle>
                        <SheetDescription>
                            View and restore previous snapshots. A snapshot is created each
                            time you save changes.
                        </SheetDescription>
                    </SheetHeader>
                </div>
                <div className="px-6 pb-4 text-sm text-muted-foreground">
                    {isLoading && <div>Loading history…</div>}
                    {isError && <div>Failed to load history</div>}
                    {!isLoading && !isError && historyList.length === 0 && (
                        <div>No snapshots yet.</div>
                    )}
                </div>
                <ScrollArea className="h-[85vh]">
                    <ul className="px-2 pb-6 space-y-2">
                        {historyList.map(([timestamp, snapshot]) => {
                            const schedulesCount = snapshot?.schedules?.length || 0;
                            const columns = snapshot?.settings?.columns ?? 1;
                            const quickLinksCount = snapshot?.pageContent?.quickLinks?.length || 0;
                            const hasAbout = Boolean(snapshot?.pageContent?.aboutSection);

                            return (
                                <li
                                    key={timestamp}
                                    className={cn(
                                        "rounded-md border bg-background",
                                        "p-4 flex items-center justify-between gap-3"
                                    )}
                                >
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{timestamp}</div>
                                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                                            <span>Schedules: {schedulesCount}</span>
                                            <span>Columns: {columns}</span>
                                            <span>Quick links: {quickLinksCount}</span>
                                            <span>About: {hasAbout ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <Button
                                            size="sm"
                                            onClick={() => restoreMutation.mutate(snapshot)}
                                            disabled={restoreMutation.isPending}
                                            className="gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            {restoreMutation.isPending ? "Restoring…" : "Restore"}
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}