"use client"

import { cn } from "@/lib/utils";
import { QuickLinkData } from "@/types";
import { ArrowUpRight, Link } from "lucide-react";
import { HeadingText } from "./heading-text";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function QuickLinks({ data, isLoading }: { data?: QuickLinkData, isLoading?: boolean }) {
    return (
        <div className="mx-auto w-full">
            <HeadingText text={data?.title || "Quick Links"}
                iconNode={<Link size={32} />}
            />
            {
                isLoading && <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Get Started Section */}
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4 mx-auto" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-12 w-40 mx-auto" />
                        </div>

                        {/* Customer Support Section */}
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4 mx-auto" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-12 w-48 mx-auto" />
                        </div>

                        {/* Exclusive Member Benefits Section */}
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4 mx-auto" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-12 w-40 mx-auto" />
                        </div>
                    </div>
                </div>
            }
            <div className="flex flex-wrap w-full justify-center gap-2">
                {data?.links?.map((link, index) => (
                    <Card key={index} className="w-full gap-0 space-y-2 flex-col flex md:w-[30%] shadow-none border-0">
                        <CardHeader className="p-0">
                            <h1 className={cn("text-center", data?.style?.title?.color, data?.style?.title?.fontWeights)}>{link.title}</h1>
                        </CardHeader>
                        {link?.description && <CardContent className="flex-1 p-0">
                            <CardDescription className="text-base p-0 text-center">
                                <p className="line-clamp-6">{link?.description}</p>
                            </CardDescription>
                        </CardContent>}
                        <CardFooter className="p-0 mt-1">
                            <a target="_blank" href={link?.link || "#"} className="w-full">
                                <Button
                                    style={{
                                        fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                                    }}
                                    variant={"outline"}
                                    className="p-8 w-full hover:bg-secondary-main hover:text-white group text-secondary-main font-extrabold border-secondary-main rounded-full">
                                    {link?.buttonLabel || "Visit"} <ArrowUpRight className="ml-2" size={16} />
                                </Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}