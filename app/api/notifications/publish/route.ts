import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/db";
import { Notification } from "@/app/types";

// Helper function to deduplicate notifications by ID
function deduplicateNotifications(
  notifications: Notification[]
): Notification[] {
  const seen = new Set<string>();
  return notifications.filter((notification) => {
    if (seen.has(notification.id)) {
      return false;
    }
    seen.add(notification.id);
    return true;
  });
}

// POST - Publish a notification
export async function POST(req: NextRequest) {
  try {
    const { notificationId, targetAudience = "all" } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Get all notifications from Redis
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let notifications = allNotificationsData.map((n) =>
      JSON.parse(n)
    ) as Notification[];

    // Remove duplicates before processing
    notifications = deduplicateNotifications(notifications);
    console.log("notifications", notifications);

    // Find the notification to update
    // const notificationIndex = notifications.findIndex(
    //   (n) => n.id === notificationId
    // );
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Update only the status and publishedAt fields
    // notifications[notificationIndex] = {
    //   ...notifications[notificationIndex],
    //   status: "active",
    //   publishedAt: new Date().toISOString(),
    // };

    // Update Redis with the modified notifications
    // await redisClient.del("admin_notifications"); //
    if (notifications.length > 0) {
      // remove the notification from the list
      //   const updatedNotifications = notifications.splice(notificationIndex, 1);
      // Remove the notification from the Redis list by value (stringified)
      const index = notifications.findIndex((n) => n.id === notification.id);
      await redisClient.lrem(
        "admin_notifications",
        index, // index of the notification to remove
        JSON.stringify(notification)
      );

      // add the notification back to the list with toggled isShowing field
      await redisClient.lpush(
        "admin_notifications",
        JSON.stringify({
          ...notification,
          isShowing: !notification.isShowing,
          publishedAt: new Date().toISOString(),
        })
      );
    }

    // Store the published notification in recent_notifications for polling
    const publishedNotification: Notification = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      links: notification.links,
      timestamp: notification.timestamp,
      expiresAt: notification.expiresAt,
      priority: notification.priority,
      isPreview: targetAudience === "preview",
      status: "active",
      targetAudience: targetAudience,
      publishedAt: notification.publishedAt,
      isShowing: !notification.isShowing,
    };

    // Store in recent notifications for polling system
    await redisClient.lpush(
      "recent_notifications",
      JSON.stringify(publishedNotification)
    );
    await redisClient.ltrim("recent_notifications", 0, 19); // Keep only last 20

    return NextResponse.json({
      success: true,
      notification: {
        id: notificationId,
        isShowing: !notification.isShowing,
        publishedAt: notification.publishedAt,
        targetAudience: targetAudience,
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
    let notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    notifications = deduplicateNotifications(notifications);

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

    // Update the notification in Redis - clear and rebuild to prevent duplicates
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
