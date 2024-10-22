"use client";;
import Image from "next/image";

export function ArrowDownButton() {
    function scrollToProgram() {
        // scroll to program id
        const program = document.getElementById("programme");
        program?.scrollIntoView({ behavior: "smooth" });
    }
    return (
        <div
            // style={{
            //     padding: "10px",
            //     borderRadius: "50%",
            //     marginTop: "30px",
            //     width: "max(40px, 70%)",
            //     height: "max(40px, 3vh)"
            // }}
            onClick={scrollToProgram}
            className="absolute bottom-8 cursor-pointer flex justify-center items-center rounded-full p-4 w-[3.8rem] h-[3.8rem] hover:bg-secondary-main hover:text-white bg-secondary-main duration-1000 delay-700 animate-bounce"
        >
            <Image src="/images/4dx/arrow_down.png" width={100} height={100} alt="arrow down" className="w-10 h-10 object-contain" />
        </div>
    )
}