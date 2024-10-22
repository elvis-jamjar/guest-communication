"use client"

import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export function ArrowDownButton() {
    function scrollToProgram() {
        // scroll to program id
        const program = document.getElementById("programme");
        program?.scrollIntoView({ behavior: "smooth" });
    }
    return (
        <Button
            onClick={scrollToProgram}
            className="absolute bottom-0 hover:bg-secondary-main hover:text-white bg-secondary-main rounded-full h-16 w-16 duration-1000 delay-700 animate-bounce"
        >
            <ArrowDown className="w-10 h-10 " />
        </Button>
    )
}