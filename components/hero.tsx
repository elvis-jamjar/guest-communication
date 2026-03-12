
'use server'
import { cn } from "@/lib/utils";
import { ArrowDownButton } from "./arrowdown";
import { HeroCard } from "./hero-card";

export default async function Hero() {
    return (
        <section
            id="hero-section"
            className={cn("text-white bg-center md:p-0 p-1 bg-cover bg-no-repeat w-full h-screen flex items-center justify-center relative")}
            style={{
                backgroundImage: "url('/images/4dx/26/1920x1080_final_01.jpeg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <HeroCard />
            <ArrowDownButton />
        </section>
    )
}