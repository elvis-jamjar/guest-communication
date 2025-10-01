"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, ChevronLeftCircle, XIcon, RefreshCw } from "lucide-react";
// import { MdClearAll } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/app/actions/timeline";

export default function NotificationUI() {
    const { data: notifications, refetch, isLoading, isError } = useQuery({
        queryKey: ['user-admin-notifications'],
        queryFn: async () => await getNotifications(),
        staleTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 1,
        refetchInterval: 15000, // Refetch every 15 seconds
        refetchIntervalInBackground: true,
    });

    const [isHovering, setIsHovering] = useState(false);
    const [collapseTimeout, setCollapseTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

    // Check if message should be truncated
    const shouldTruncateMessage = (message: string) => {
        return message.length > 100; // Truncate if longer than 100 characters
    };


    // Filter out dismissed notifications and only show ones that are showing
    const activeNotifications = notifications?.filter(notification =>
        !dismissedNotifications.has(notification.id) &&
        notification.isShowing
    ) || [];

    const hasMoreNotifications = activeNotifications.length > 1;

    // Expand notifications function
    const expandNotifications = () => {
        setIsExpanded(true);
    };

    // Collapse notifications function
    const collapseNotifications = useCallback(() => {
        setIsExpanded(false);
    }, []);

    // Dismiss notification function
    const dismiss = (notificationId: string) => {
        setDismissedNotifications(prev => new Set(Array.from(prev).concat(notificationId)));
    };

    // Handle mouse enter with delay
    const handleMouseEnter = () => {
        if (hasMoreNotifications) {
            setIsHovering(true);
            // Clear any pending collapse timeout
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
                setCollapseTimeout(null);
            }
            expandNotifications();
        }
    };

    // Handle mouse leave with delay
    const handleMouseLeave = () => {
        if (hasMoreNotifications) {
            setIsHovering(false);
            // Set a delay before collapsing
            const timeout = setTimeout(() => {
                if (!isHovering) {
                    collapseNotifications();
                }
            }, 1000); // 1 second delay
            setCollapseTimeout(timeout);
        }
    };

    // Add click outside listener
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            const notificationContainer = document.querySelector('[data-notification-container]');

            if (notificationContainer && !notificationContainer.contains(target)) {
                if (hasMoreNotifications && isExpanded) {
                    collapseNotifications();
                }
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isExpanded, hasMoreNotifications, collapseNotifications]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
            }
        };
    }, [collapseTimeout]);


    // Show loading state
    // if (isLoading) {
    //     return (
    //         <div className="fixed bottom-4 md:bottom-4 right-1/2 translate-x-1/2 z-50 w-full max-w-full p-4 md:p-2 md:max-w-md md:right-4 md:translate-x-0">
    //             <div className="bg-black border-l-primary-main border-l-4 text-white rounded-xl shadow-lg p-4">
    //                 <div className="flex items-center gap-2">
    //                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-main"></div>
    //                     <span className="text-sm">Loading notifications...</span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // Show error state
    // if (isError || error) {
    //     return (
    //         <div className="fixed bottom-4 md:bottom-4 right-1/2 translate-x-1/2 z-50 w-full max-w-full p-4 md:p-2 md:max-w-md md:right-4 md:translate-x-0">
    //             <div className="bg-red-900 border-l-red-500 border-l-4 text-white rounded-xl shadow-lg p-4">
    //                 <div className="flex items-center justify-between gap-2">
    //                     <span className="text-sm">Failed to load notifications</span>
    //                     <button
    //                         onClick={() => refetch()}
    //                         className="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded transition-colors"
    //                     >
    //                         Retry
    //                     </button>
    //                 </div>
    //                 {process.env.NODE_ENV === 'development' && (
    //                     <div className="mt-2 text-xs text-red-200">
    //                         Error: {error instanceof Error ? error.message : 'Unknown error'}
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     );
    // }

    if (!activeNotifications || activeNotifications.length === 0 || isLoading || isError) return null;


    // Animation variants
    const notificationVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.8,
            height: 0,
            marginBottom: 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            height: "auto",
            marginBottom: 4,
        },
        collapsed: {
            opacity: 1,
            y: 0,
            scale: 1,
            height: "auto",
            marginBottom: 0,
        },
        stacked: {
            opacity: 0.7,
            y: 0,
            scale: 0.92,
            height: "auto",
            marginBottom: 0,
        },
        exit: {
            opacity: 0,
            x: 300,
            scale: 0.8,
            height: 0,
            marginBottom: 0,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        },
    };

    const containerVariants = {
        hidden: {
            opacity: 0,
            height: 0,
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeOut",
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    // Show only the first notification when collapsed, all when expanded
    // const displayNotifications = isExpanded ? notifications : notifications.slice(0, 1);

    return (
        <div
            className={cn("fixed bottom-4 md:bottom-4 right-1/2 translate-x-1/2 z-50 w-full max-w-full p-4 md:p-2 md:max-w-md md:right-4 md:translate-x-0", isExpanded && "md:max-w-xl bg-primary-main/30 backdrop-blur-sm rounded-xl", activeNotifications.length === 1 && "md:max-w-xl bg-transparent")}
            data-notification-container
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* Clear all button - only show when expanded */}
            <div
                className={cn(
                    "transition-all flex justify-between items-center duration-500 ease-out transform",
                    isExpanded && activeNotifications.length > 1
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-8 scale-95 pointer-events-none"
                )}
                style={{
                    transitionDelay: isExpanded
                        ? `${activeNotifications.length * 150}ms`
                        : '0ms'
                }}
            >
                <h2 className="md:text-black text-white text-xl font-bold mb-2">Notifications</h2>
                <div className="flex justify-end gap-4 items-center">
                    {/* Refresh button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="bg-primary-main rounded-full flex items-center gap-1 hover:bg-primary-main/80 text-white p-2 text-xs transition-colors duration-200 disabled:opacity-50"
                        title="Refresh notifications"
                    >
                        <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    {/* minimize button */}
                    <button
                        onClick={collapseNotifications}
                        className="bg-primary-purple rounded-full flex items-center gap-1 hover:bg-primary-purple/80 text-white p-2 text-xs transition-colors duration-200"
                        title="Minimize notifications"
                    >
                        <ChevronLeftCircle className="size-4 -rotate-90" />
                    </button>
                </div>
            </div>
            <div className={cn(
                "w-full h-fit transition-all duration-500 ease-in-out",
                isExpanded
                    ? "max-h-[72dvh] overflow-y-auto no-scrollbar"
                    : "h-auto"
            )}>
                <div className={cn("h-full", !isExpanded && hasMoreNotifications ? "h-40" : "h-auto")}>
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            className={cn(
                                "relative w-full h-full",
                                isExpanded
                                    ? "flex flex-col-reverse space-y-reverse"
                                    : ""
                            )}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            {activeNotifications.map((notification, index) => {
                                // With flex-col-reverse, first notification (index 0) appears at bottom
                                const isFirstNotification = index === 0;
                                const isSecondNotification = index === 1;
                                const isThirdNotification = index === 2;
                                return (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        // if its first add:
                                        {...(isFirstNotification && {
                                            onMouseEnter: hasMoreNotifications ? expandNotifications : undefined,
                                            onTouchStart: hasMoreNotifications ? expandNotifications : undefined
                                        })}
                                        className={cn(
                                            "relative w-full",
                                            !isExpanded && hasMoreNotifications && "absolute top-0 left-0 right-0",
                                            isExpanded
                                                ? "opacity-100"
                                                : isFirstNotification
                                                    ? "opacity-100 z-30"
                                                    : isSecondNotification
                                                        ? "opacity-80 z-20"
                                                        : isThirdNotification
                                                            ? "opacity-60 z-10"
                                                            : "opacity-0 pointer-events-none z-0"
                                        )}
                                        variants={notificationVariants}
                                        initial="hidden"
                                        animate={
                                            isExpanded
                                                ? "visible"
                                                : isFirstNotification
                                                    ? "collapsed"
                                                    : isSecondNotification || isThirdNotification
                                                        ? "stacked"
                                                        : "hidden"
                                        }
                                        exit="exit"
                                        transition={{
                                            duration: 0.5,
                                            delay: isExpanded
                                                ? index * 0.1
                                                : isFirstNotification
                                                    ? 0
                                                    : (activeNotifications.length - index) * 0.1
                                        }}
                                        style={{
                                            // Stack cards with slight offset when collapsed
                                            transform: !isExpanded && hasMoreNotifications && !isFirstNotification
                                                ? `translateY(${-(index + 1) * 16}px) scale(${1 - index * 0.05})`
                                                : undefined
                                        }}
                                    >
                                        {/* Gradient border animation container */}
                                        <div className={cn(
                                            "relative p-0.5 group",
                                            !isExpanded && hasMoreNotifications && !isFirstNotification && "shadow-lg border border-gray-700/30",
                                            "hover:scale-[1.02] transition-transform duration-200"
                                        )}>
                                            {/* Rotating gradient border */}
                                            {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-main via-primary-purple to-primary-main smooth-rotate"></div> */}
                                            {/* Pulsing gradient overlay */}
                                            {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-purple via-primary-main to-primary-purple animate-pulse opacity-60"></div> */}
                                            {/* Static content container */}
                                            <div className={cn(
                                                "relative text-white rounded-xl shadow-lg p-4 border-l-4",
                                                !isExpanded && hasMoreNotifications && !isFirstNotification
                                                    ? "bg-gray-700 border-l-primary-main/50"
                                                    : "bg-black border-l-primary-main"
                                            )}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold line-clamp-1 text-base">{notification.title}</h3>
                                                        {/* Unread indicator */}
                                                        <div className="w-2 h-2 bg-primary-main rounded-full animate-pulse"></div>
                                                        {!isExpanded && hasMoreNotifications && isFirstNotification && (
                                                            <span className="bg-primary-main text-white text-xs px-2 py-1 rounded-full transition-all duration-300 ease-in-out">
                                                                +{activeNotifications.length - 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {/* <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="text-red-400 hover:text-red-300 text-xs p-1 rounded hover:bg-red-500/20 transition-colors"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="size-3" />
                                                        </button> */}
                                                        <button
                                                            onClick={() => dismiss(notification.id)}
                                                            className="text-gray-400 hover:text-white text-xs p-1 rounded hover:bg-gray-500/20 transition-colors"
                                                            title="Dismiss notification">
                                                            <XIcon className="size-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-300">
                                                        {!isExpanded && shouldTruncateMessage(notification.message) && activeNotifications.length > 1
                                                            ? `${notification.message.substring(0, 40)}...`
                                                            : notification.message
                                                        }
                                                    </p>
                                                    {/* {!isExpanded && shouldTruncateMessage(notification.message) && (
                                                        <button
                                                            onClick={() => toggleMessageExpansion(notification.id)}
                                                            className="text-primary-main text-xs mt-1 hover:text-primary-main/80 transition-colors"
                                                        >
                                                            {expandedMessages.has(notification.id) ? 'Read less' : 'Read more'}
                                                        </button>
                                                    )} */}
                                                </div>

                                                {/* Render notification links as buttons */}
                                                {notification.links && notification.links.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {notification.links.map((link, linkIndex) => (
                                                            <a
                                                                key={linkIndex}
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-primary-main flex-1 flex items-center justify-center gap-2 text-white group px-3 py-2 rounded-lg text-xs transition-colors hover:bg-primary-main/80"
                                                            >
                                                                {link.label}
                                                                <ArrowUpRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Notification metadata */}
                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                                                    {notification.priority && (
                                                        <span className={`px-2 py-1 capitalize rounded text-xs ${notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                            notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                            }`}>
                                                            {notification.priority} Priority
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
