'use client'

import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function ScheduleListSkeleton({ columns = 1 }: { columns?: number }) {
    return (
        <Accordion type={'multiple'} className="mx-auto max-w-5xl">
            {/* Render 3 skeleton items */}
            {Array.from({ length: 4 }).map((_, index) => (
                <AccordionItem value={`skeleton-item-${index}`} key={index} className="my-1 border-none p-2">
                    <AccordionTrigger className="decoration-transparent rounded-md py-2 flex justify-start">
                        <div className={cn("flex gap-3 md:gap-5 w-full items-center flex-wrap p-2 justify-start bg-primary-purple/10 rounded-3xl md:rounded-full")}>
                            {/* Day skeleton */}
                            <div className="bg-gray-300 animate-pulse h-8 w-32 rounded-2xl md:rounded-full"></div>
                            {/* Title skeleton */}
                            <div className="bg-gray-300 animate-pulse h-6 flex-1 w-fit px-1.5 md:px-0 rounded"></div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex-col min-h-44">
                        <div className="bg-transparent p-8 py-4 mx-auto w-full">
                            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full", (columns === 1) && 'md:grid-cols-1')}>
                                {/* First column skeleton */}
                                <div className="w-full">
                                    {Array.from({ length: 4 }).map((_, itemIndex) => (
                                        <div key={itemIndex} className="flex flex-wrap w-full my-4 mt-0 rounded-2xl relative p-6 bg-white">
                                            {/* Timeline dot skeleton */}
                                            <div className="flex flex-col items-center absolute h-[calc(100%+2rem)] -top-[2rem]">
                                                <div className="bg-gray-300 animate-pulse w-8 h-8 z-10 rounded-full mt-[3.8rem]"></div>
                                                {itemIndex < 3 && <div className="flex-1 w-px bg-gray-200 z-auto absolute h-full mt-24"></div>}
                                            </div>
                                            <div className="ps-10 w-full">
                                                {/* Time skeleton */}
                                                <div className="bg-gray-300 animate-pulse h-3 w-16 mb-2 rounded"></div>
                                                {/* Title skeleton */}
                                                <div className="bg-gray-300 animate-pulse h-4 w-3/4 mb-2 rounded"></div>
                                                {/* Description skeleton */}
                                                <div className="space-y-2">
                                                    <div className="bg-gray-300 animate-pulse h-3 w-full rounded"></div>
                                                    <div className="bg-gray-300 animate-pulse h-3 w-5/6 rounded"></div>
                                                    <div className="bg-gray-300 animate-pulse h-3 w-4/5 rounded"></div>
                                                </div>
                                                {/* Speaker skeleton */}
                                                <div className="mt-4 space-y-2">
                                                    <div className="bg-gray-300 animate-pulse h-3 w-20 rounded"></div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-gray-300 animate-pulse w-16 h-16 rounded-full"></div>
                                                        <div className="space-y-2 flex-1">
                                                            <div className="bg-gray-300 animate-pulse h-3 w-3/4 rounded"></div>
                                                            <div className="bg-gray-300 animate-pulse h-3 w-1/2 rounded"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Second column skeleton (only if columns === 2) */}
                                {columns === 2 && (
                                    <div className="w-full">
                                        {Array.from({ length: 3 }).map((_, itemIndex) => (
                                            <div key={itemIndex} className="flex flex-wrap w-full my-4 mt-0 rounded-2xl relative p-6 bg-white">
                                                {/* Timeline dot skeleton */}
                                                <div className="flex flex-col items-center absolute h-[calc(100%+2rem)] -top-[2rem]">
                                                    <div className="bg-gray-300 animate-pulse w-8 h-8 z-10 rounded-full mt-[3.8rem]"></div>
                                                    {itemIndex < 2 && <div className="flex-1 w-px bg-gray-200 z-auto absolute h-full mt-24"></div>}
                                                </div>
                                                <div className="ps-10 w-full">
                                                    {/* Time skeleton */}
                                                    <div className="bg-gray-300 animate-pulse h-3 w-16 mb-2 rounded"></div>
                                                    {/* Title skeleton */}
                                                    <div className="bg-gray-300 animate-pulse h-4 w-3/4 mb-2 rounded"></div>
                                                    {/* Description skeleton */}
                                                    <div className="space-y-2">
                                                        <div className="bg-gray-300 animate-pulse h-3 w-full rounded"></div>
                                                        <div className="bg-gray-300 animate-pulse h-3 w-5/6 rounded"></div>
                                                    </div>
                                                    {/* Speaker skeleton */}
                                                    <div className="mt-4 space-y-2">
                                                        <div className="bg-gray-300 animate-pulse h-3 w-20 rounded"></div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-gray-300 animate-pulse w-16 h-16 rounded-full"></div>
                                                            <div className="space-y-2 flex-1">
                                                                <div className="bg-gray-300 animate-pulse h-3 w-3/4 rounded"></div>
                                                                <div className="bg-gray-300 animate-pulse h-3 w-1/2 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
