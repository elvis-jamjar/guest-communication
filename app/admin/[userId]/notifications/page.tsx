"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    BarChart3,
    Bell,
    RefreshCw,
    Eye,
    ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import NotificationForm from "@/components/NotificationForm";
import NotificationList from "@/components/NotificationList";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Notification } from "@/app/types";
import {
    createNotification,
    updateNotification,
    deleteNotification,
    publishNotification,
    archiveNotification,
    getNotifications
} from "@/app/actions/timeline";

export default function NotificationManagementPage({ params }: { params: { userId: string } }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const [activeTab, setActiveTab] = useState("list");

    // Fetch notifications using React Query
    const { data: notifications = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async () => await getNotifications(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Create notification mutation
    const createNotificationMutation = useMutation({
        mutationFn: createNotification,
        onSuccess: (newNotification) => {
            queryClient.setQueryData(['admin-notifications'], (old: Notification[] = []) => [newNotification, ...old]);
            setEditingNotification(null);
            setActiveTab("list");
            toast.success("Notification created successfully");
        },
        onError: (error) => {
            console.error("Error creating notification:", error);
            toast.error("Failed to create notification");
        }
    });

    // Update notification mutation
    const updateNotificationMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Notification, 'id' | 'timestamp' | 'impressions' | 'uniqueRecipients' | 'recipientIPs'>> }) =>
            updateNotification(id, data),
        onSuccess: (updatedNotification, variables) => {
            queryClient.setQueryData(['admin-notifications'], (old: Notification[] = []) =>
                old.map(n => n.id === variables.id ? updatedNotification : n)
            );
            setEditingNotification(null);
            setActiveTab("list");
            toast.success("Notification updated successfully");
        },
        onError: (error) => {
            console.error("Error updating notification:", error);
            toast.error("Failed to update notification");
        }
    });

    // Delete notification mutation
    const deleteNotificationMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: (_, notificationId) => {
            queryClient.setQueryData(['admin-notifications'], (old: Notification[] = []) =>
                old.filter(n => n.id !== notificationId)
            );
            toast.success("Notification deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting notification:", error);
            toast.error("Failed to delete notification");
        }
    });

    // Publish notification mutation
    const publishNotificationMutation = useMutation({
        mutationFn: ({ notificationId, targetAudience }: { notificationId: string; targetAudience: string }) =>
            publishNotification(notificationId, targetAudience),
        onSuccess: (updatedNotification) => {
            queryClient.setQueryData(['admin-notifications'], (old: Notification[] = []) =>
                old.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
            toast.success("Notification published successfully");
        },
        onError: (error) => {
            console.error("Error publishing notification:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to publish notification";
            toast.error(errorMessage);
        }
    });

    // Archive notification mutation
    const archiveNotificationMutation = useMutation({
        mutationFn: archiveNotification,
        onSuccess: (updatedNotification) => {
            queryClient.setQueryData(['admin-notifications'], (old: Notification[] = []) =>
                old.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
            toast.success("Notification archived successfully");
        },
        onError: (error) => {
            console.error("Error archiving notification:", error);
            toast.error("Failed to archive notification");
        }
    });

    // Handler functions that use the mutations
    const handleCreateNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'impressions' | 'uniqueRecipients' | 'recipientIPs'>) => {
        return createNotificationMutation.mutateAsync(notificationData);
    };

    const handleUpdateNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'impressions' | 'uniqueRecipients' | 'recipientIPs'>, _clearForm = true) => {
        if (!editingNotification) throw new Error("No notification being edited");

        const result = await updateNotificationMutation.mutateAsync({
            id: editingNotification.id,
            data: notificationData
        });

        return result;
    };

    const handleDeleteNotification = async (notificationId: string) => {
        return deleteNotificationMutation.mutateAsync(notificationId);
    };

    const handlePublishNotification = async (notificationId: string, targetAudience: string) => {
        await publishNotificationMutation.mutateAsync({ notificationId, targetAudience });
    };

    const handleArchiveNotification = async (notificationId: string) => {
        await archiveNotificationMutation.mutateAsync(notificationId);
    };

    // Handle edit
    const handleEditNotification = (notification: Notification) => {
        setEditingNotification(notification);
        setActiveTab("create");
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingNotification(null);
        setActiveTab("list");
    };

    // Handle create new
    const handleCreateNew = () => {
        setEditingNotification(null);
        setActiveTab("create");
    };

    return (
        <div className="min-h-screen relative bg-gray-50">
            {/* Header Section */}
            <div className="bg-white/60 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => router.push(`/admin/${params.userId}`)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Admin
                            </Button>
                            <div className="h-8 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Create, manage, and analyze notifications for your application
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => refetch()}
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <Button
                                onClick={handleCreateNew}
                                className="bg-primary-purple hover:bg-primary-purple/90 text-white flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Notification
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white sticky top-24 rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Navigation</h3>
                                <p className="text-sm text-gray-500">Manage your notifications</p>
                            </div>
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("list")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === "list"
                                        ? "bg-primary-purple text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="font-medium">All Notifications</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("create")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === "create"
                                        ? "bg-primary-purple text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">{editingNotification ? "Edit Notification" : "Create New"}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("analytics")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === "analytics"
                                        ? "bg-primary-purple text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    <span className="font-medium">Analytics</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === "preview"
                                        ? "bg-primary-purple text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Eye className="w-5 h-5" />
                                    <span className="font-medium">Preview</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Content Header */}
                        <div className="mb-2">
                            {activeTab === "list" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">All Notifications</h2>
                                    <p className="text-sm text-gray-600">Manage and monitor your notification campaigns</p>
                                </div>
                            )}
                            {/* {activeTab === "create" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {editingNotification ? "Edit Notification" : "Create New Notification"}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {editingNotification ? "Update your notification details" : "Design and schedule your notification"}
                                    </p>
                                </div>
                            )} */}
                            {activeTab === "analytics" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
                                    <p className="text-sm text-gray-600">Track performance and engagement metrics</p>
                                </div>
                            )}
                            {activeTab === "preview" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Live Preview</h2>
                                    <p className="text-sm text-gray-600">See how notifications appear to your users</p>
                                </div>
                            )}
                        </div>

                        {/* Content based on active tab */}
                        <div className="space-y-6">
                            {activeTab === "list" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <NotificationList
                                        notifications={notifications}
                                        onEdit={handleEditNotification}
                                        onDelete={handleDeleteNotification}
                                        onPublish={handlePublishNotification}
                                        onArchive={handleArchiveNotification}
                                        onRefresh={() => refetch()}
                                        isLoading={isLoading}
                                    />
                                </div>
                            )}

                            {activeTab === "create" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <NotificationForm
                                        onSave={editingNotification ? handleUpdateNotification : handleCreateNotification}
                                        initialData={editingNotification || undefined}
                                        isEditing={!!editingNotification}
                                        onCancel={handleCancelEdit}
                                        onSuccess={() => {
                                            // This will be called after successful save
                                            // The form will already be cleared and tab switched in the handlers above
                                        }}
                                    />
                                </div>
                            )}

                            {activeTab === "analytics" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <AnalyticsDashboard onRefresh={() => refetch()} />
                                </div>
                            )}

                            {activeTab === "preview" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <Card className="border-0 shadow-none">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Eye className="w-5 h-5" />
                                                Live Preview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <p className="text-gray-600 mb-6">
                                                    This preview shows how notifications will appear to users in real-time.
                                                </p>
                                                <div className="bg-black rounded-xl p-4 text-white max-w-md">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-base">Live Preview</h3>
                                                            <span className="bg-primary-purple text-white text-xs px-2 py-1 rounded-full">
                                                                Live
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-sm text-white">
                                                            This is how your notifications will appear to users.
                                                            The notification system uses Server-Sent Events (SSE) for real-time delivery.
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                                        <span>Real-time delivery</span>
                                                        <span>SSE enabled</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 space-y-4">
                                                    <h4 className="font-semibold text-gray-800">Features:</h4>
                                                    <ul className="space-y-2 text-sm text-gray-600">
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Real-time delivery via Server-Sent Events
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Analytics tracking for impressions and unique recipients
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Priority-based display and expiration support
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Action links and rich content support
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Preview mode for testing before publishing
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
