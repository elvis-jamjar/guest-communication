import { NextRequest, NextResponse } from "next/server";
import { redisPublisher, redisClient } from "@/lib/db";
import { Notification } from "@/app/types";

// POST - Publish a notification
export async function POST(req: NextRequest) {
  try {
    const {
      notificationId,
      targetAudience = "all",
      notificationData,
    } = await req.json();
    console.log("Publishing notification:", {
      notificationId,
      targetAudience,
      hasNotificationData: !!notificationData,
    });

    if (!notificationId) {
      console.error("No notification ID provided");
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    let notification;

    // If notification data is provided, use it directly (for updated notifications)
    if (notificationData) {
      console.log("Using provided notification data for publishing");
      notification = notificationData;
    } else {
      // Otherwise, fetch from Redis (for existing notifications)
      console.log("Fetching notification from Redis");
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
      console.log(
        "Found notification at index:",
        notificationIndex,
        "Total notifications:",
        notifications.length
      );

      if (notificationIndex === -1) {
        console.error("Notification not found:", notificationId);
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      notification = notifications[notificationIndex];
    }

    console.log("Publishing notification:", notification.title);

    // Check if this is a scheduled notification
    const isScheduled = notification.isScheduled && notification.scheduledFor;
    const scheduledTime = isScheduled
      ? new Date(notification.scheduledFor)
      : null;
    const now = new Date();

    if (isScheduled && scheduledTime && scheduledTime > now) {
      // This is a scheduled notification that's not ready yet
      notification.status = "scheduled";
      notification.targetAudience = targetAudience;
      console.log(`Notification scheduled for ${scheduledTime.toISOString()}`);
    } else {
      // Publish immediately
      notification.status = "active";
      notification.publishedAt = new Date().toISOString();
      notification.targetAudience = targetAudience;
      notification.isScheduled = false;
    }

    // Update the notification in Redis
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    const allNotifications = allNotificationsData.map((n) => JSON.parse(n));

    const notificationIndex = allNotifications.findIndex(
      (n) => n.id === notificationId
    );

    if (notificationIndex !== -1) {
      // Update existing notification
      allNotifications[notificationIndex] = notification;
    } else {
      // Add new notification (for cases where notificationData was provided but not yet in Redis)
      allNotifications.push(notification);
    }

    // Update Redis with the complete list
    await redisClient.del("admin_notifications");
    if (allNotifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...allNotifications.map((n) => JSON.stringify(n))
      );
    }

    // Only publish to SSE if not scheduled (immediate publishing)
    if (!isScheduled || !scheduledTime || scheduledTime <= now) {
      // Create notification for SSE (without analytics fields)
      const sseNotification: Notification = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        links: notification.links,
        timestamp: notification.timestamp,
        expiresAt: notification.expiresAt,
        priority: notification.priority,
        isPreview: targetAudience === "preview",
      };

      // Publish to SSE subscribers
      await redisPublisher.publish(
        "notifications",
        JSON.stringify(sseNotification)
      );

      // Store in recent notifications for new connections
      await redisClient.lpush(
        "recent_notifications",
        JSON.stringify(sseNotification)
      );
      await redisClient.ltrim("recent_notifications", 0, 9); // Keep only last 10
    }

    return NextResponse.json({
      success: true,
      notification: {
        id: notification.id,
        title: notification.title,
        status: notification.status,
        scheduledFor: notification.scheduledFor,
        isScheduled: notification.isScheduled,
      },
    });
  } catch (error) {
    console.error("Error publishing notification:", error);
    return NextResponse.json(
      { error: "Failed to publish notification" },
      { status: 500 }
    );
  }
}

// PUT - Archive a notification
export async function PUT(req: NextRequest) {
  try {
    const { notificationId } = await req.json();

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

    // Update notification status
    notification.status = "archived";
    notification.archivedAt = new Date().toISOString();

    // Update the notification in Redis
    notifications[notificationIndex] = notification;
    await redisClient.del("admin_notifications");
    if (notifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...notifications.map((n) => JSON.stringify(n))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error archiving notification:", error);
    return NextResponse.json(
      { error: "Failed to archive notification" },
      { status: 500 }
    );
  }
}
