"use client"

import { QuickLinkData } from "@/app/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Link } from "lucide-react";
import { HeadingText } from "./heading-text";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";

export function QuickLinks({ data }: { data?: QuickLinkData }) {
    return (
        <div>
            {/* <h1>{data?.title || "Quick Links"}</h1> */}
            <HeadingText text={data?.title || "Quick Links"}
                iconNode={<Link size={32} />}
            />
            <div className="flex flex-wrap justify-center gap-2 auto-rows-max">
                {data?.links?.map((link, index) => (
                    <Card key={index} className="w-full gap-0 space-y-0 flex-col flex md:w-[30%] shadow-none border-0">
                        <CardHeader className="">
                            <h1 className={cn("text-center", data?.style?.title?.color, data?.style?.title?.fontWeights)}>{link.title}</h1>
                        </CardHeader>
                        {link?.description && <CardContent className="flex-1">
                            <CardDescription className="text-base text-pretty text-center">
                                <p className="line-clamp-6">{link?.description}</p>
                            </CardDescription>
                        </CardContent>}
                        <CardFooter>
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