"use client"
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AllPartnerAndSponsors({ image, alt, className }: { image: string, alt: string, className?: string }) {

    return (
        <div className={cn("mx-auto container max-w-5xl px-2 md:px-0 rounded-sm", className)}>
            <Image
                src={image}
                width={1000}
                height={500}
                draggable={false}
                fetchPriority="high"
                quality={100}
                priority={true}
                alt={alt || "Sponsors"}
                className="w-full h-auto rounded-sm pointer-events-none object-contain select-none" />
        </div>
    )
}