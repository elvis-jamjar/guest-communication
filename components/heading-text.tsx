import { cn } from "@/lib/utils";
import Image from "next/image";

export function HeadingText({ text, icon, iconNode, containerClassName, className }: { text: string, icon?: string, className?: string, iconNode?: React.ReactNode, containerClassName?: string }) {
    return (
        <div
            // style={{
            //   fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)"
            // }}
            className={cn("flex text-secondary-main gap-4 items-center w-full justify-center mb-8", containerClassName)}>
            {icon && <Image src={icon} width={100} height={100} alt="icon" className={cn("size-8 md:size-12 object-contain", className)} />}
            {iconNode && iconNode}
            <h1
                className="text-center text-2xl leading-tight md:text-4xl lg:text-5xl items-center justify-center text-secondary-main font-extrabold ">
                {text}
            </h1>
        </div>
    )
}