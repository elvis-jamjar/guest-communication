"use client";

import { useNotifications } from "@/hooks/useNotification";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { MdClearAll } from "react-icons/md";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function PreviewPage() {
    const {
        notifications,
        isExpanded,
        expandNotifications,
        collapseNotifications,
        clear,
        clearAll
    } = useNotifications();

    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
    const [isHovering, setIsHovering] = useState(false);
    const [collapseTimeout, setCollapseTimeout] = useState<NodeJS.Timeout | null>(null);

    // Check if message should be truncated
    const shouldTruncateMessage = (message: string) => {
        return message.length > 100; // Truncate if longer than 100 characters
    };

    const hasMoreNotifications = notifications.length > 1;

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
            }, 2000); // 2 second delay
            setCollapseTimeout(timeout);
        }
    };

    // Toggle message expansion
    const toggleMessageExpansion = (notificationId: string) => {
        setExpandedMessages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });
    };

    // Clear all notifications
    const handleClearAll = () => {
        clearAll();
        setExpandedMessages(new Set());
    };

    // Don't render anything if no notifications
    if (notifications.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Mode</h1>
                    <p className="text-gray-600 mb-6">No preview notifications available</p>
                    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md">
                        <h3 className="font-semibold text-gray-900 mb-2">How to test notifications:</h3>
                        <ol className="text-sm text-gray-600 space-y-1 text-left">
                            <li>1. Go to the admin panel</li>
                            <li>2. Create a new notification</li>
                            <li>3. Set target audience to "Preview"</li>
                            <li>4. Publish the notification</li>
                            <li>5. It will appear here in preview mode</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Preview Mode</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Test how notifications will appear to users
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MdClearAll className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="max-w-4xl mx-auto px-6 py-6">
                <div className="space-y-4">
                    {notifications.map((notification, index) => {
                        const isFirstNotification = index === 0;
                        const isNotificationExpanded = isExpanded || isFirstNotification;
                        const isMessageExpanded = expandedMessages.has(notification.id);

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative"
                            >
                                <div
                                    className={cn(
                                        "relative text-white rounded-xl shadow-lg p-4",
                                        !isNotificationExpanded && !isFirstNotification
                                            ? "bg-gray-700"
                                            : "bg-black"
                                    )}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold line-clamp-1 text-base">{notification.title}</h3>
                                            {notification.isPreview && (
                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Preview
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => clear(notification.id)}
                                            className="text-gray-400 hover:text-white text-xs ml-2"
                                        >
                                            <XIcon className="size-4" />
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm text-white">
                                            {!isNotificationExpanded && shouldTruncateMessage(notification.message) && !isMessageExpanded
                                                ? `${notification.message.substring(0, 40)}...`
                                                : notification.message
                                            }
                                        </p>
                                        {!isNotificationExpanded && shouldTruncateMessage(notification.message) && (
                                            <button
                                                onClick={() => toggleMessageExpansion(notification.id)}
                                                className="text-primary-main text-xs mt-1 hover:text-primary-main/80 transition-colors"
                                            >
                                                {isMessageExpanded ? 'Read less' : 'Read more'}
                                            </button>
                                        )}
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
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}