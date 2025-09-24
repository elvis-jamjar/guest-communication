"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    Users,
    Eye,
    TrendingUp,
    Calendar,
    Target,
    Activity,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
    summary: {
        totalNotifications: number;
        totalImpressions: number;
        totalUniqueRecipients: number;
        uniqueIPs: number;
        averageImpressionsPerNotification: number;
    };
    statusDistribution: Record<string, number>;
    priorityDistribution: Record<string, number>;
    dailyImpressions: Array<{
        date: string;
        impressions: number;
    }>;
    topNotifications: Array<{
        id: string;
        title: string;
        impressions: number;
        uniqueRecipients: number;
        status: string;
    }>;
    timeRange: string;
}

interface AnalyticsDashboardProps {
    notificationId?: string;
    onRefresh?: () => void;
}

export default function AnalyticsDashboard({ notificationId, onRefresh }: AnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("7d");
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                timeRange,
                ...(notificationId && { notificationId })
            });

            const response = await fetch(`/api/notifications/analytics?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch analytics");
            }

            const data = await response.json();
            setAnalytics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching analytics:", err);
        } finally {
            setIsLoading(false);
        }
    }, [timeRange, notificationId]);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange, notificationId, fetchAnalytics]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    const getTimeRangeLabel = (range: string) => {
        switch (range) {
            case "1d": return "Last 24 hours";
            case "7d": return "Last 7 days";
            case "30d": return "Last 30 days";
            case "all": return "All time";
            default: return "Last 7 days";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchAnalytics} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analytics) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <p className="text-gray-600">No analytics data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary-purple">Analytics Dashboard</h2>
                    <p className="text-gray-600">
                        {notificationId ? "Notification Analytics" : "Overall Performance"} • {getTimeRangeLabel(timeRange)}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1d">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                    </Select>

                    {onRefresh && (
                        <Button onClick={onRefresh} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                                <p className="text-2xl font-bold text-primary-purple">
                                    {formatNumber(analytics.summary.totalNotifications)}
                                </p>
                            </div>
                            <div className="p-3 bg-primary-purple/10 rounded-full">
                                <BarChart3 className="w-6 h-6 text-primary-purple" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatNumber(analytics.summary.totalImpressions)}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Recipients</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatNumber(analytics.summary.totalUniqueRecipients)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique IPs</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatNumber(analytics.summary.uniqueIPs)}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Target className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Performance Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg. Impressions per Notification</span>
                            <span className="font-semibold">{analytics.summary.averageImpressionsPerNotification}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Engagement Rate</span>
                            <span className="font-semibold">
                                {analytics.summary.totalImpressions > 0
                                    ? ((analytics.summary.totalUniqueRecipients / analytics.summary.totalImpressions) * 100).toFixed(1) + "%"
                                    : "0%"
                                }
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Daily Impressions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {analytics.dailyImpressions.map((day, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        {new Date(day.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-main h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(100, (day.impressions / Math.max(...analytics.dailyImpressions.map(d => d.impressions), 1)) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium w-12 text-right">{day.impressions}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {status}
                                        </Badge>
                                    </div>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Priority Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
                                <div key={priority} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${priority === 'high' ? 'border-red-200 text-red-700' :
                                                priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                                    'border-blue-200 text-blue-700'
                                                }`}
                                        >
                                            {priority}
                                        </Badge>
                                    </div>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Notifications */}
            {analytics.topNotifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Top Performing Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topNotifications.map((notification, index) => (
                                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-purple/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary-purple">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium line-clamp-1">{notification.title}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{notification.impressions} impressions</span>
                                                <span>{notification.uniqueRecipients} recipients</span>
                                                <Badge className="text-xs">
                                                    {notification.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
