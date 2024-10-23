'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface AccordionItem {
    title: string | React.ReactNode,
    className?: string,
    children: React.ReactNode | string
}

interface AnimatedAccordionProps {
    items: AccordionItem[]
}

export function ReusableAnimatedAccordion({ items }: AnimatedAccordionProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 768);
        }
        // onpage resize listen to window size
        window.addEventListener('resize', () => {
            setIsMobile(window.innerWidth < 768);
        });
    }, []);
    const toggleItem = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    return (
        <div className="w-full space-y-2">
            {items.map((item, index, arr) => (
                <div key={index} className={cn("border-2 border-x-[0.0px] border-t-0 border-primary-main rounded-b-3xl overflow-hidden", ((arr?.length - 1) == index) && 'border-0 border-transparent')}>
                    <motion.button
                        className="flex justify-between items-center w-full px-4 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => toggleItem(index)}
                        initial={false}
                        aria-expanded={expandedIndex === index}
                        aria-controls={`accordion-content-${index}`}
                    >
                        {/* <span className={cn("font-medium text-gray-900", item?.className)}></span> */}
                        {item.title}
                        <motion.span
                            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
                        </motion.span>
                    </motion.button>
                    <AnimatePresence initial={false}>
                        {expandedIndex === index && (
                            <motion.div
                                id={`accordion-content-${index}`}
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                                variants={{
                                    expanded: { opacity: 1, maxHeight: isMobile ? "4000px" : "200dvh" },
                                    collapsed: { opacity: 0, maxHeight: "0px" }
                                }}
                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                className="overflow-auto"
                            >
                                {/* <div className="px-4 py-3 text-gray-700 bg-gray-50 h-[200px] overflow-y-auto">
                                    x
                                    </div> */}
                                <div className="px-4 py-3">{item.children}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

