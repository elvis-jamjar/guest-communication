import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/db";

// GET - Get analytics for notifications
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");
    const timeRange = searchParams.get("timeRange") || "7d"; // 1d, 7d, 30d, all

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    const notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Get analytics data
    const analyticsData = await redisClient.lrange(
      "notification_analytics",
      0,
      -1
    );
    const analytics = analyticsData.map((a) => JSON.parse(a));

    // Filter by notification ID if provided
    let filteredNotifications = notifications;
    if (notificationId) {
      filteredNotifications = notifications.filter(
        (n) => n.id === notificationId
      );
    }

    // Calculate time range filter
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    // Filter notifications by time range
    const timeFilteredNotifications = filteredNotifications.filter(
      (n) => new Date(n.timestamp) >= startDate
    );

    // Calculate total analytics
    const totalImpressions = timeFilteredNotifications.reduce(
      (sum, n) => sum + (n.impressions || 0),
      0
    );
    const totalUniqueRecipients = timeFilteredNotifications.reduce(
      (sum, n) => sum + (n.uniqueRecipients || 0),
      0
    );

    // Get unique IPs across all notifications
    const allIPs = new Set<string>();
    timeFilteredNotifications.forEach((n) => {
      if (n.recipientIPs) {
        n.recipientIPs.forEach((ip: string) => allIPs.add(ip));
      }
    });

    // Calculate status distribution
    const statusDistribution = timeFilteredNotifications.reduce((acc, n) => {
      acc[n.status || "draft"] = (acc[n.status || "draft"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate priority distribution
    const priorityDistribution = timeFilteredNotifications.reduce((acc, n) => {
      acc[n.priority || "medium"] = (acc[n.priority || "medium"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate daily impressions (last 7 days)
    const dailyImpressions = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dayImpressions = timeFilteredNotifications
        .filter((n) => n.timestamp.startsWith(dateStr))
        .reduce((sum, n) => sum + (n.impressions || 0), 0);

      dailyImpressions.push({
        date: dateStr,
        impressions: dayImpressions,
      });
    }

    // Get top performing notifications
    const topNotifications = timeFilteredNotifications
      .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        title: n.title,
        impressions: n.impressions || 0,
        uniqueRecipients: n.uniqueRecipients || 0,
        status: n.status,
      }));

    return NextResponse.json({
      summary: {
        totalNotifications: timeFilteredNotifications.length,
        totalImpressions,
        totalUniqueRecipients,
        uniqueIPs: allIPs.size,
        averageImpressionsPerNotification:
          timeFilteredNotifications.length > 0
            ? Math.round(totalImpressions / timeFilteredNotifications.length)
            : 0,
      },
      statusDistribution,
      priorityDistribution,
      dailyImpressions,
      topNotifications,
      timeRange,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST - Record an impression (when notification is viewed)
export async function POST(req: NextRequest) {
  try {
    const { notificationId, ipAddress, userAgent } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    const notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Find the notification
    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId
    );
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const notification = notifications[notificationIndex];

    // Update impressions
    notification.impressions = (notification.impressions || 0) + 1;

    // Add IP to recipient list if not already present
    if (ipAddress && !notification.recipientIPs?.includes(ipAddress)) {
      notification.recipientIPs = [
        ...(notification.recipientIPs || []),
        ipAddress,
      ];
      notification.uniqueRecipients = (notification.uniqueRecipients || 0) + 1;
    }

    // Update the notification
    notifications[notificationIndex] = notification;

    // Update Redis
    await redisClient.del("admin_notifications");
    if (notifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...notifications.map((n) => JSON.stringify(n))
      );
    }

    // Record analytics event
    const analyticsEvent = {
      notificationId,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      type: "impression",
    };

    await redisClient.lpush(
      "notification_analytics",
      JSON.stringify(analyticsEvent)
    );
    await redisClient.ltrim("notification_analytics", 0, 9999); // Keep last 10k events

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording impression:", error);
    return NextResponse.json(
      { error: "Failed to record impression" },
      { status: 500 }
    );
  }
}
