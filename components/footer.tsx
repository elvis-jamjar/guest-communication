'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathName = usePathname();
    return (
        <footer

            className={cn("text-white bg-primary-main", pathName?.includes('/admin') && 'hidden')}>
            <div className="bg-secondary-main mx-auto py-6 px-2">
                <p className="text-white text-2xl text-center text-pretty tracking-wide font-extrabold">Send inquiries to info@jamjargh.com</p>
            </div>
            <div className="container py-20 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
                <div className="flex flex-wrap gap-5 justify-center items-center">
                    <div className="flex items-center rounded-full p-5 bg-white">
                        <Image
                            src="/images/4dx/logo.png"
                            width={600}
                            height={600}
                            priority
                            alt="4dx"
                            className="w-24 h-24 object-contain"
                        />
                    </div>
                    <p className="text-left text-[0.9rem] max-w-xs">
                        4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community.
                    </p>
                </div>
                <div className="flex gap-6 flex-col items-center justify-center">
                    <div className="flex gap-4">
                        <Image src="/images/4dx/linkedin.png" width={200} height={200} alt="linkedin" className="w-12 h-12 object-contain" />
                        <Image src="/images/4dx/globe.png" width={200} height={200} alt="twitter" className="w-12 h-12 object-contain" />
                    </div>
                    <p className="w-fit text-lg font-medium">&copy; {new Date().getFullYear()} 4DX Ventures</p>
                </div>
            </div>
            <Image
                src="/images/4dx/background.png"
                width={1000}
                height={400}
                alt="4dx"
                className="w-full h-12 object-cover bg-white"
            />
        </footer>
    )
}