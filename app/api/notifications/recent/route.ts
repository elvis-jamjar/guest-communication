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

export async function GET(_req: NextRequest) {
  try {
    // Fetch admin notifications from Redis
    const adminNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    ); // Get all admin notifications

    let notifications: Notification[] = [];

    if (adminNotificationsData && adminNotificationsData.length > 0) {
      // Parse the stored notifications and filter for isShowing: true
      notifications = adminNotificationsData
        .map((notification) => {
          try {
            return JSON.parse(notification);
          } catch (error) {
            console.error("Error parsing stored notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null)
        .filter((notification) => notification.isShowing === true);

      // Remove duplicates by ID
      notifications = deduplicateNotifications(notifications);
    } else {
      // No admin notifications exist - return empty array
      notifications = [];
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin notifications" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification from admin notifications
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Get all admin notifications
    const adminNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let adminNotifications = adminNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    adminNotifications = deduplicateNotifications(adminNotifications);

    // Filter out the notification to delete
    const filteredNotifications = adminNotifications.filter((n) => n.id !== id);

    // Update Redis - clear and rebuild to prevent duplicates
    await redisClient.del("admin_notifications");
    if (filteredNotifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...filteredNotifications.map((n) => JSON.stringify(n))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification from admin:", error);
    return NextResponse.json(
      { error: "Failed to delete notification from admin" },
      { status: 500 }
    );
  }
}
