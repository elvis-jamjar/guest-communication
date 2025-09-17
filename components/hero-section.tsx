import { Globe, Linkedin, Mail, Twitter, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AboutDescription } from "./page-content-display";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { PageContent } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useSectionRoute } from "@/hooks/useSectionRoute";

// Loading skeleton component for AboutDescription
function AboutDescriptionSkeleton({ className }: { className?: string }) {
    return (
        <section className={cn("bg-transparent mt-8 text-white rounded-lg", className)}>
            <div className="max-w-5xl space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-white/20 rounded-lg animate-pulse w-32"></div>

                {/* Paragraph skeletons */}
                <div className="space-y-3">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                </div>

                <div className="space-y-3">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-2/3"></div>
                </div>

                <div className="space-y-3">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-4/5"></div>
                </div>
            </div>
        </section>
    );
}

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
        text: 'ACGC (African Corporate Government Counsel Forum)',
        icon: <Linkedin className="size-3" />
    }
]

export default function HeroSection({ pageContent, isLoading }: { pageContent: PageContent, isLoading?: boolean }) {
    const isMobile = useMobile()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const { scrollToSection } = useSectionRoute();
    const hasScrolledToHashRef = useRef(false);
    const sections = ["about", "programme", "sponsors", "partners"];
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
        const updateHeaderHeight = () => {
            const currentHeight = headerRef.current?.offsetHeight ?? 0;
            setHeaderHeight(currentHeight);
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        let resizeObserver: ResizeObserver | null = null;
        if (headerRef.current && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => updateHeaderHeight());
            resizeObserver.observe(headerRef.current);
        }

        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [isScrolled]);

    // Scroll to section if URL contains a hash (on load) and when hash changes
    useEffect(() => {
        const scrollToHash = () => {
            const rawHash = window.location.hash;
            if (!rawHash) return;
            const sectionId = decodeURIComponent(rawHash.replace(/^#/, ''));
            const offsetValue = (headerRef.current?.offsetHeight ?? headerHeight ?? 0) + 20;
            const element = document.getElementById(sectionId);
            if (!element) return;

            const duration = 350;
            scrollToSection(sectionId, { offset: offsetValue, behavior: "smooth", duration });

            // Clear the hash after the scroll finishes
            window.setTimeout(() => {
                if (window.location.hash) {
                    const newUrl = window.location.pathname + window.location.search;
                    window.history.replaceState(null, '', newUrl);
                }
            }, duration + 50);
        };

        // Initial load: ensure header height is known before first scroll
        if (!hasScrolledToHashRef.current && window.location.hash) {
            // Defer to next tick to allow layout to settle
            setTimeout(() => {
                scrollToHash();
                hasScrolledToHashRef.current = true;
            }, 0);
        }

        window.addEventListener('hashchange', scrollToHash);
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, [headerHeight, scrollToSection]);

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

    const handleScrollToSection = (section: string) => {
        scrollToSection(section, { offset: 160, behavior: "smooth", inline: "start" })
        // close menu
        setIsMenuOpen(false);
    };

    return (
        <div id="about"
            className="h-full w-full">
            {/* Overlay for better text contrast */}
            {/* Content container */}
            <div className="relative w-full z-10 flex flex-col h-full min-h-screen">
                {/* Header with logo, conference info, and navigation */}
                <div ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 gap-2 flex items-center md:items-start justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'px-4 py-2 backdrop-blur-sm pb-0 md:px-5 md:py-2 md:pb-0 bg-white/90 shadow-sm' : 'px-2 md:py-8 md:px-16 md:pb-0 bg-white/90 md:bg-transparent'}`}>
                    {/* Logo and conference badge */}
                    <div className={`flex flex-1 overflow-hidden md:justify-around items-center transition-all duration-300 ease-in-out ${isScrolled ? 'gap-4 p-1 max-w-xs md:max-w-sm' : 'gap-5 p-5 max-w-xs md:max-w-xl md:bg-[#f5f1e8]'} md:rounded-br-[3rem]`}>
                        <Image
                            src="/images/logo.png"
                            alt="ACGC Logo"
                            width={isScrolled ? 80 : isMobile ? 90 : 140}
                            height={isScrolled ? 80 : isMobile ? 90 : 140}
                            className="object-contain transition-all duration-300 ease-in-out"
                        />
                        <div className="flex flex-col">
                            <div className={`text-gray-600 font-medium transition-all duration-300 ease-in-out ${isScrolled ? 'text-base' : 'text-lg md:text-xl'}`}>7th Annual</div>
                            <div className={`text-gray-800 font-bold transition-all duration-300 ease-in-out ${isScrolled ? 'text-base md:text-xl' : 'text-sm md:text-3xl'}`}>ACGC Conference</div>
                            <div className={`bg-primary-main mt-2 transition-all duration-300 ease-in-out ${isScrolled ? 'w-10 h-1' : 'w-16 h-1.5'}`}></div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="relative mobile-menu-container">
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 bg-primary-main/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary-main">
                            {
                                sections.map((section) => (
                                    <button key={`desktop-${section}`} onClick={() => scrollToSection(section, { offset: 160, behavior: "smooth", inline: "start" })} className="text-white capitalize hover:text-white/80 transition-colors font-medium text-lg">
                                        {section}
                                    </button>
                                ))
                            }

                            {/* <a href="#about" className="text-white hover:text-white/80 transition-colors font-medium text-lg">
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
                            </a> */}
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="bg-white group rounded-full font-bold text-primary-main hover:text-white border-white hover:bg-primary-purple"
                            >
                                <a href="https://acgc2025conference.rsvpify.com/" target="_blank" rel="noopener noreferrer">
                                    Register Now
                                    <ArrowUpRight className="ml-3 size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden backdrop-blur-sm rounded-lg p-2 border"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center items-center">
                                <span className={`bg-primary-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                                <span className={`bg-primary-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`bg-primary-main block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
                            </div>
                        </button>

                        {/* Mobile Menu Dropdown */}
                        <div className={`md:hidden absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl border border-gray-200 rounded-lg transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <div className="py-2">
                                {
                                    sections.map((section) => (
                                        <button key={`mobile-${section}`} onClick={() => handleScrollToSection(section)} className="w-full text-left capitalize px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
                                            {section}
                                        </button>
                                    ))
                                }
                                {/* <a href="#about" onClick={toggleMenu} className="block px-4 py-3 text-gray-800 hover:bg-primary-main hover:text-white transition-colors font-medium">
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
                                </a> */}
                                <div className="px-4 py-3">
                                    <Button
                                        asChild
                                        className="w-full bg-primary-main group rounded-xl text-white font-bold hover:bg-primary-purple"
                                    >
                                        <a href="https://acgc2025conference.rsvpify.com/" target="_blank" rel="noopener noreferrer">
                                            Register Now
                                            <ArrowUpRight className="ml-3 size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className={cn("flex-1 flex flex-col justify-center")} style={{ marginTop: headerHeight }}>
                    {/* Gradient overlay for text content */}
                    <div className="absolute backdrop-blur-[1px] hidden md:block z-0 inset-0 bg-gradient-to-tr from-black/60 from-30% via-black/60 via-30% to-black/0 pointer-events-none"></div>
                    <div className="px-4 md:px-16 relative z-10 py-8">
                        {/* Main heading */}
                        <h1 className="text-white hidden md:block font-semibold text-center md:text-left text-5xl md:text-7xl 2xl:text-8xl md:leading-tighter mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            From Bridges
                            <br className="hidden md:block" />
                            {" to Breakthroughs"}
                        </h1>
                        <h1 className="text-white md:hidden font-semibold text-center md:text-left text-5xl md:text-7xl 2xl:text-8xl leading-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            From  Bridges
                            <br className="block" />
                            {"to Breakthroughs"}
                        </h1>
                        {/* Subtitle with gradient background */}
                        <div className="inline-block w-full md:w-fit p-0.5 bg-gradient-to-r from-white to-primary-main rounded-full overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                            <div className="inline-flex flex-row items-center gap-4 w-full bg-gradient-to-r from-primary-purple to-primary-main rounded-full px-3 py-3">
                                <span className="text-lg pl-2 md:text-2xl text-white font-bold">
                                    In-house counsel as catalysts
                                </span>
                                <Button
                                    asChild
                                    className="text-xl hidden md:flex w-full md:w-60 ml-2  h-full bg-white group rounded-full text-primary-main font-bold hover:bg-primary-purple hover:text-white">
                                    <a href="https://acgc2025conference.rsvpify.com/" target="_blank" rel="noopener noreferrer">
                                        Register Now
                                        <ArrowUpRight className="ml-3 size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                                    </a>
                                </Button>
                            </div>

                        </div>
                        {/* Primary CTA */}
                        <div className="relative inline-flex w-full mt-4 justify-center md:hidden">
                            <Button
                                asChild
                                size="lg"
                                className="relative animate-pulse transition-all repeat-[2] delay-1000 duration-700 ease-in-out border-2 border-primary-main h-12 group w-auto bg-white text-primary-main hover:text-primary-purple text-xl md:text-2xl font-semibold rounded-full hover:bg-primary-main/90 shadow-xl shadow-black/30 focus-visible:ring-4 focus-visible:ring-primary-main/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                            >
                                <a href="https://acgc2025conference.rsvpify.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                    Register now
                                    <ArrowUpRight className="ml-3 size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </div>

                        {/* Date and location */}
                        <div className="text-white space-y-6 mt-14">
                            <div className="text-2xl text-center md:text-left md:text-4xl font-bold text-primary-main">
                                Wed 1st - Fri 3rd October, 2025
                            </div>
                            <div className="text-sm md:text-xl font-medium text-left">
                                @ The David Livingstone Safari Lodge & Spa,
                                <br className="hidden md:block" />
                                {" Riverside Dr, Off Sichango Rd, Livingstone, Zambia"}
                            </div>
                            {/* Social and contact info */}
                            <div className="grid md:flex flex-wrap items-center gap-4 text-white text-sm">
                                {/* social media */}
                                {
                                    textIconData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                                            <div className="min-w-6 min-h-6 bg-primary-main rounded-full flex items-center justify-center text-black">
                                                {item.icon}
                                            </div>
                                            <span>{item.text}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {/* about us description */}
                        {isLoading ? (
                            <AboutDescriptionSkeleton className="text-white" />
                        ) : (
                            <AboutDescription className="text-white" aboutSection={pageContent?.aboutSection || ''} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
