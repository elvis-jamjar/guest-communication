
'use server'
import { cn } from "@/lib/utils";
import { ArrowDownButton } from "./arrowdown";
import { HeroCard } from "./hero-card";

export default async function Hero() {
    return (
        <section
            id="hero-section"
            className={cn("text-white bg-center md:p-0 p-2 bg-cover bg-repeat w-full h-screen flex items-center justify-center relative")}
            style={{
                backgroundImage: "url('/images/4dx/background.png')",
                backgroundSize: '97%'
            }}>
            <HeroCard />
            <ArrowDownButton />
        </section>
    )
}