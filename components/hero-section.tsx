import { Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AboutDescription } from "./page-content-display";
import { useQuery } from "@tanstack/react-query";
import { getPageContent } from "@/app/actions/timeline";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const textIconData = [
    {
        text: 'www.acgc.africa',
        icon: <Globe className="size-3" />
    },
    {
        text: '@african_inhouse',
        // twitter icon
        icon: <Twitter className="size-3" />
    },
    {
        text: 'mail@acgc.africa',
        icon: <Mail className="size-3" />
    },
    {
        text: 'ACGC (African Corprate Government Counsel Forum)',
        icon: <Linkedin className="size-3" />
    }
]

export default function HeroSection() {
    const isMobile = useMobile()
    // get page content
    const { data: pageContent } = useQuery({
        queryKey: ['page-content'],
        queryFn: async () => await getPageContent(),
        refetchInterval: 90000, // 15 minutes
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isMenuOpen && !target.closest('.mobile-menu-container')) {
                setIsMenuOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMenuOpen]);

    return (
        <div
            className="h-full w-full">
            {/* Overlay for better text contrast */}
            {/* Content container */}
            <div className="relative w-full z-10 flex flex-col h-full min-h-screen">
                {/* Header with logo, conference info, and navigation */}
                <div className={`fixed top-0 left-0 right-0 z-50 flex items-start justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'px-4 py-2 backdrop-blur-sm pb-0 md:px-5 md:py-2 md:pb-0 bg-white opacity-95 shadow-sm' : 'px-2 py-8 md:px-16 md:pb-0 pb-0 bg-white/90 md:bg-transparent'}`}>
                    {/* Logo and conference badge */}
                    <div className={`flex flex-1 justify-around items-center transition-all duration-300 ease-in-out ${isScrolled ? 'gap-4 p-1 max-w-xs md:max-w-sm' : 'gap-5 p-5 max-w-xs md:max-w-xl md:bg-[#f5f1e8]'} md:rounded-br-[3rem]`}>
                        <Image
                            src="/images/logo.png"
                            alt="ACGC Logo"
                            width={isScrolled ? 80 : isMobile ? 100 : 140}
                            height={isScrolled ? 80 : isMobile ? 100 : 140}
                            className="object-contain transition-all duration-300 ease-in-out"
                        />
                        <div className="flex flex-col">
                            <div className={`text-gray-600 font-medium transition-all duration-300 ease-in-out ${isScrolled ? 'text-base' : 'text-lg md:text-xl'}`}>7th Annual</div>
                            <div className={`text-gray-800 font-bold transition-all duration-300 ease-in-out ${isScrolled ? 'text-xl' : 'text-lg md:text-3xl'}`}>ACGC Conference</div>
                            <div className={`bg-primary-main mt-2 transition-all duration-300 ease-in-out ${isScrolled ? 'w-10 h-1' : 'w-16 h-1.5'}`}></div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="relative mobile-menu-container">
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 bg-primary-main/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary-main">
                            <a href="#about" className="text-white hover:text-white/80 transition-colors font-medium text-lg">
                                About
                            </a>
                            <a href="#programme" className="text-white hover:text-white/80 transition-colors font-medium text-lg">
                                Programme
                            </a>
                            <a href="#sponsors" className="text-white hover:text-white/80 transition-colors font-medium text-lg">
                                Sponsors
                            </a>
                            <a href="#partners" className="text-white hover:text-white/80 transition-colors font-medium text-lg">
                                Partners
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden bg-[#f5f1e8]/90 backdrop-blur-sm rounded-lg p-3 border border-[#e8dcc6]"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center items-center">
                                <span className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                                <span className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
                            </div>
                        </button>

                        {/* Mobile Menu Dropdown */}
                        <div className={`md:hidden absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <div className="py-2">
                                <a href="#about" onClick={toggleMenu} className="block px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
                                    About
                                </a>
                                <a href="#programme" onClick={toggleMenu} className="block px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
                                    Programme
                                </a>
                                <a href="#sponsors" onClick={toggleMenu} className="block px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
                                    Sponsors
                                </a>
                                <a href="#partners" onClick={toggleMenu} className="block px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
                                    Partners
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className={cn("flex-1 flex flex-col justify-center pt-32 md:pt-40")}>
                    {/* Gradient overlay for text content */}
                    <div className="absolute backdrop-blur-[1px] hidden md:block z-0 inset-0 bg-gradient-to-tr from-black/60 from-30% via-black/60 via-30% to-black/0 pointer-events-none"></div>
                    <div className="px-8 md:px-16 relative z-10 py-10">
                        {/* Main heading */}
                        <h1 className="text-white font-semibold text-center md:text-left text-5xl md:text-6xl xl:text-8xl leading-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            From Bridges
                            <br />
                            to Breakthroughs
                        </h1>

                        {/* Subtitle with gradient background */}
                        <div className="inline-block w-full md:w-auto p-0.5 bg-gradient-to-r from-white to-primary-main rounded-full mb-16 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            <div className="inline-block w-full bg-gradient-to-r from-primary-purple to-primary-main  px-8 py-3 rounded-full">
                                <span className="text-xl md:text-2xl text-white font-bold">
                                    In-house counsel as catalysts
                                </span>
                            </div>
                        </div>

                        {/* Date and location */}
                        <div className="text-white space-y-4 mb-12">
                            <div className="text-3xl font-bold text-primary-main">
                                Wed 1st - Fri 3rd October, 2025
                            </div>
                            <div className="text-lg md:text-xl font-normal">
                                @ The David Livingstone Safari Lodge & Spa,
                                <br />
                                Riverside Dr, Off Sichango Rd, Livingstone, Zambia
                            </div>
                            {/* Social and contact info */}
                            <div className="flex flex-wrap items-center gap-4 text-white text-sm">
                                {/* social media */}
                                {
                                    textIconData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-base">
                                            <div className="size-6 bg-primary-main rounded-full flex items-center justify-center text-black">
                                                {item.icon}
                                            </div>
                                            <span>{item.text}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {/* about us description */}
                        <AboutDescription className="text-white" aboutSection={pageContent?.aboutSection || ''} />

                    </div>

                </div>
            </div>
        </div>
    );
}
