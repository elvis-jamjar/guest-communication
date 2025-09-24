import { NextRequest, NextResponse } from "next/server";
import { redisClient, redisPublisher } from "@/lib/db";
import { Notification } from "@/app/types";

// GET - Get scheduled notifications that are ready to be published
export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    console.log("Checking for scheduled notifications at:", now.toISOString());

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    const notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Find scheduled notifications that are ready to be published
    const readyToPublish = notifications.filter((notification) => {
      return (
        notification.status === "scheduled" &&
        notification.scheduledFor &&
        new Date(notification.scheduledFor) <= now
      );
    });

    console.log(
      `Found ${readyToPublish.length} notifications ready to publish`
    );

    return NextResponse.json({
      readyToPublish: readyToPublish.length,
      notifications: readyToPublish,
    });
  } catch (error) {
    console.error("Error checking scheduled notifications:", error);
    return NextResponse.json(
      { error: "Failed to check scheduled notifications" },
      { status: 500 }
    );
  }
}

// POST - Process scheduled notifications (called by cron job)
export async function POST(req: NextRequest) {
  try {
    const now = new Date();
    console.log("Processing scheduled notifications at:", now.toISOString());

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    const notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Find scheduled notifications that are ready to be published
    const readyToPublish = notifications.filter((notification) => {
      return (
        notification.status === "scheduled" &&
        notification.scheduledFor &&
        new Date(notification.scheduledFor) <= now
      );
    });

    console.log(`Processing ${readyToPublish.length} scheduled notifications`);

    const publishedNotifications: Notification[] = [];

    for (const notification of readyToPublish) {
      try {
        // Update notification status
        notification.status = "active";
        notification.publishedAt = new Date().toISOString();
        notification.isScheduled = false;

        // Create notification for SSE (without analytics fields)
        const sseNotification: Notification = {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          links: notification.links,
          timestamp: notification.timestamp,
          expiresAt: notification.expiresAt,
          priority: notification.priority,
          isPreview: false,
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

        publishedNotifications.push(notification);
        console.log(`Published scheduled notification: ${notification.title}`);
      } catch (error) {
        console.error(
          `Error publishing notification ${notification.id}:`,
          error
        );
      }
    }

    // Update all notifications in Redis
    const updatedNotifications = notifications.map((n) => {
      const published = publishedNotifications.find((p) => p.id === n.id);
      return published || n;
    });

    await redisClient.del("admin_notifications");
    if (updatedNotifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...updatedNotifications.map((n) => JSON.stringify(n))
      );
    }

    return NextResponse.json({
      success: true,
      processed: publishedNotifications.length,
      notifications: publishedNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        publishedAt: n.publishedAt,
      })),
    });
  } catch (error) {
    console.error("Error processing scheduled notifications:", error);
    return NextResponse.json(
      { error: "Failed to process scheduled notifications" },
      { status: 500 }
    );
  }
}
