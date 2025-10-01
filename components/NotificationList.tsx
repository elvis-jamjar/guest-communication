"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Eye,
    Edit,
    Trash2,
    Send,
    Archive,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    Users,
    BarChart3,
    Clock,
    AlertTriangle,
    EyeOff
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/app/types";
import { toast } from "sonner";

interface NotificationListProps {
    notifications: Notification[];
    onEdit: (notification: Notification) => void;
    onDelete: (notificationId: string) => Promise<void>;
    onPublish: (notificationId: string, targetAudience: string) => Promise<void>;
    onArchive: (notificationId: string) => Promise<void>;
    onRefresh: () => void;
    isLoading?: boolean;
}

export default function NotificationList({
    notifications,
    onEdit,
    onDelete,
    onPublish,
    onArchive,
    onRefresh,
    isLoading = false
}: NotificationListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [targetAudienceFilter, setTargetAudienceFilter] = useState("all");
    const [sortBy, setSortBy] = useState("timestamp");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Dialog state management
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const filteredNotifications = notifications
        .filter(notification => {
            const matchesSearch =
                notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
            const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
            const matchesTarget = targetAudienceFilter === "all" || notification.targetAudience === targetAudienceFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesTarget;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
                case "priority":
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
                        (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
                    break;
                case "impressions":
                    comparison = (b.impressions || 0) - (a.impressions || 0);
                    break;
                case "timestamp":
                default:
                    comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "draft": return "bg-yellow-100 text-yellow-800";
            case "scheduled": return "bg-blue-100 text-blue-800";
            case "archived": return "bg-gray-100 text-gray-800";
            case "expired": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800";
            case "medium": return "bg-yellow-100 text-yellow-800";
            case "low": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleAction = async (action: string, notification: Notification) => {
        switch (action) {
            case "edit":
                onEdit(notification);
                break;
            case "delete":
                setSelectedNotification(notification);
                setShowDeleteDialog(true);
                break;
            case "publish":
                setSelectedNotification(notification);
                setShowPublishDialog(true);
                break;
            case "archive":
                try {
                    await onArchive(notification.id);
                    toast.success("Notification archived successfully");
                } catch (error) {
                    toast.error("Failed to archive notification");
                    console.error(error);
                }
                break;
        }
    };

    const handleTogglePublish = async (notification: Notification) => {
        try {
            await onPublish(notification.id, notification.targetAudience || "all");
            // const action = notification.isShowing ? "unpublished" : "published";
            // toast.success(`Notification ${action} successfully`);
        } catch (error) {
            const action = notification.isShowing ? "unpublish" : "publish";
            toast.error(`Failed to ${action} notification`);
            console.error(error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedNotification) return;

        setIsActionLoading(true);
        try {
            await onDelete(selectedNotification.id);
            toast.success("Notification deleted successfully");
            setShowDeleteDialog(false);
            setSelectedNotification(null);
        } catch (error) {
            toast.error("Failed to delete notification");
            console.error(error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleConfirmPublish = async () => {
        if (!selectedNotification) return;

        setIsActionLoading(true);
        try {
            await onPublish(selectedNotification.id, selectedNotification.targetAudience || "all");
            const action = selectedNotification.isShowing ? "unpublished" : "published";
            toast.success(`Notification ${action} successfully`);
            setShowPublishDialog(false);
            setSelectedNotification(null);
        } catch (error) {
            const action = selectedNotification.isShowing ? "unpublish" : "publish";
            toast.error(`Failed to ${action} notification`);
            console.error(error);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="search"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Select value={targetAudienceFilter} onValueChange={setTargetAudienceFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Audiences</SelectItem>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="preview">Preview Only</SelectItem>
                                    <SelectItem value="public">Public Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Label>Sort by:</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="timestamp">Date</SelectItem>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="priority">Priority</SelectItem>
                                        <SelectItem value="impressions">Impressions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </Button>
                        </div>

                        <Button onClick={onRefresh} variant="outline" size="sm">
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">No notifications found</p>
                                <p className="text-sm text-gray-500">
                                    {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || targetAudienceFilter !== "all"
                                        ? "Try adjusting your filters"
                                        : "Create your first notification to get started"
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card key={notification.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                                            <Badge className={getStatusColor(notification.status || "draft")}>
                                                {notification.status || "draft"}
                                            </Badge>
                                            <Badge className={getPriorityColor(notification.priority || "medium")}>
                                                {notification.priority || "medium"}
                                            </Badge>
                                            {notification.targetAudience && (
                                                <Badge variant="outline">
                                                    {notification.targetAudience}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-gray-600 line-clamp-2">{notification.message}</p>

                                        {notification.links && notification.links.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {notification.links.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary-main hover:text-primary-purple flex items-center gap-1"
                                                    >
                                                        {link.label}
                                                        <span className="text-xs">↗</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(notification.timestamp)}
                                            </div>

                                            {notification.status === "scheduled" && notification.scheduledFor && (
                                                <div className="flex items-center gap-1 text-blue-600 whitespace-nowrap">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-xs">Scheduled: {formatDateShort(notification.scheduledFor)} {formatTime(notification.scheduledFor)}</span>
                                                </div>
                                            )}

                                            {notification.impressions !== undefined && (
                                                <div className="flex items-center gap-1 whitespace-nowrap">
                                                    <Eye className="w-4 h-4" />
                                                    {notification.impressions} impressions
                                                </div>
                                            )}

                                            {notification.uniqueRecipients !== undefined && (
                                                <div className="flex items-center gap-1 whitespace-nowrap">
                                                    <Users className="w-4 h-4" />
                                                    {notification.uniqueRecipients} recipients
                                                </div>
                                            )}

                                            {notification.expiresAt && (
                                                <div className="flex items-center gap-1 whitespace-nowrap">
                                                    <span className="text-orange-600 text-xs">
                                                        Expires: {formatDateShort(notification.expiresAt)} {formatTime(notification.expiresAt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(notification)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        {/* Toggle Publish/Unpublish Switch */}
                                        <div className="flex w-32 items-center gap-2">
                                            <Switch
                                                checked={notification.isShowing}
                                                onCheckedChange={() => handleTogglePublish(notification)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <span className="text-sm text-gray-600">
                                                {notification.isShowing ? "Published" : "Draft"}
                                            </span>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleAction("publish", notification)}>
                                                    {notification.isShowing ? <EyeOff className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                                    {
                                                        notification.isShowing ? "Unpublish" : "Publish"
                                                    }
                                                </DropdownMenuItem>
                                                {/* {notification.status === "scheduled" && (
                                                    <DropdownMenuItem onClick={() => handleAction("publish", notification)}>
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Publish Now
                                                    </DropdownMenuItem>
                                                )} */}
                                                {notification.status === "active" && (
                                                    <DropdownMenuItem onClick={() => handleAction("archive", notification)}>
                                                        <Archive className="w-4 h-4 mr-2" />
                                                        Archive
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem
                                                    onClick={() => handleAction("delete", notification)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Summary */}
            {filteredNotifications.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Showing {filteredNotifications.length} of {notifications.length} notifications
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="w-4 h-4" />
                                    Total impressions: {notifications.reduce((sum, n) => sum + (n.impressions || 0), 0)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Total recipients: {notifications.reduce((sum, n) => sum + (n.uniqueRecipients || 0), 0)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Delete Notification
                        </DialogTitle>
                        <DialogDescription>
                            {`Are you sure you want to delete "${selectedNotification?.title}"? This action cannot be undone.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isActionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish/Unpublish Confirmation Dialog */}
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedNotification?.isShowing ? (
                                <EyeOff className="w-5 h-5 text-orange-500" />
                            ) : (
                                <Send className="w-5 h-5 text-blue-500" />
                            )}
                            {selectedNotification?.isShowing ? "Unpublish" : "Publish"} Notification
                        </DialogTitle>
                        <DialogDescription>
                            {selectedNotification?.isShowing
                                ? `Are you sure you want to unpublish "${selectedNotification?.title}"? This will hide the notification from users.`
                                : `Are you sure you want to publish "${selectedNotification?.title}"? This will send the notification to ${selectedNotification?.targetAudience || "all"} users.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPublishDialog(false)}
                            disabled={isActionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmPublish}
                            disabled={isActionLoading}
                            className={selectedNotification?.isShowing ? "bg-orange-600 hover:bg-orange-700" : ""}
                        >
                            {isActionLoading
                                ? (selectedNotification?.isShowing ? "Unpublishing..." : "Publishing...")
                                : (selectedNotification?.isShowing ? "Unpublish" : "Publish")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
