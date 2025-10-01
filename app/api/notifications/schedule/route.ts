import { NextResponse } from "next/server";
import { redisClient, redisPublisher } from "@/lib/db";
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

// Process scheduled notifications (works for both GET and POST)
async function processScheduledNotifications() {
  try {
    const now = new Date();
    console.log("Checking for scheduled notifications at:", now.toISOString());

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    notifications = deduplicateNotifications(notifications);

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

    const publishedNotifications: Notification[] = [];

    for (const notification of readyToPublish) {
      try {
        // Update notification status
        notification.status = "active";
        notification.publishedAt = new Date().toISOString();
        notification.isScheduled = false;

        // Create SSE notification (without preview flag for scheduled notifications)
        const sseNotification: Notification = {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          links: notification.links,
          timestamp: notification.timestamp,
          expiresAt: notification.expiresAt,
          priority: notification.priority,
          isPreview: false, // Scheduled notifications are always public
        };

        // Publish to SSE
        await redisPublisher.publish(
          "notifications",
          JSON.stringify(sseNotification)
        );

        // Add to recent notifications
        await redisClient.lpush(
          "recent_notifications",
          JSON.stringify(sseNotification)
        );
        await redisClient.ltrim("recent_notifications", 0, 9);

        publishedNotifications.push(notification);
        console.log(`Published scheduled notification: ${notification.title}`);
      } catch (error) {
        console.error(
          `Error publishing notification ${notification.id}:`,
          error
        );
      }
    }

    // Update the main admin_notifications list in Redis - clear and rebuild to prevent duplicates
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

    return {
      success: true,
      processed: readyToPublish.length,
      published: publishedNotifications.length,
      publishedIds: publishedNotifications.map((n) => n.id),
    };
  } catch (error) {
    console.error("Error in scheduled notifications processing:", error);
    throw error;
  }
}

// GET - Get scheduled notifications that are ready to be published
export async function GET() {
  try {
    const result = await processScheduledNotifications();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in scheduled notifications cron job:", error);
    return NextResponse.json(
      { error: "Failed to process scheduled notifications" },
      { status: 500 }
    );
  }
}

// POST - Process scheduled notifications (called by cron job)
export async function POST() {
  try {
    const result = await processScheduledNotifications();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in scheduled notifications processing:", error);
    return NextResponse.json(
      { error: "Failed to process scheduled notifications" },
      { status: 500 }
    );
  }
}
