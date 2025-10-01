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
    console.log("Fetching recent notifications from Redis");

    // Fetch both admin notifications and recent notifications
    const [adminNotificationsData, recentNotificationsData] = await Promise.all(
      [
        redisClient.lrange("admin_notifications", 0, -1),
        redisClient.lrange("recent_notifications", 0, -1),
      ]
    );

    console.log(
      `Found ${adminNotificationsData?.length || 0} admin notifications and ${
        recentNotificationsData?.length || 0
      } recent notifications in Redis`
    );

    let notifications: Notification[] = [];

    // Process admin notifications
    if (adminNotificationsData && adminNotificationsData.length > 0) {
      const adminNotifications = adminNotificationsData
        .map((notification, index) => {
          try {
            const parsed = JSON.parse(notification);
            console.log(
              `Parsed admin notification ${index}:`,
              parsed.title,
              "isShowing:",
              parsed.isShowing
            );
            return parsed;
          } catch (error) {
            console.error("Error parsing admin notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null)
        .filter((notification) => {
          const isShowing = notification.isShowing === true;
          console.log(
            `Admin notification "${notification.title}" isShowing: ${isShowing}`
          );
          return isShowing;
        });

      notifications = [...notifications, ...adminNotifications];
    }

    // Process recent notifications
    if (recentNotificationsData && recentNotificationsData.length > 0) {
      const recentNotifications = recentNotificationsData
        .map((notification, index) => {
          try {
            const parsed = JSON.parse(notification);
            console.log(
              `Parsed recent notification ${index}:`,
              parsed.title,
              "isShowing:",
              parsed.isShowing
            );
            return parsed;
          } catch (error) {
            console.error("Error parsing recent notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null)
        .filter((notification) => {
          const isShowing = notification.isShowing !== false; // Include if undefined or true
          console.log(
            `Recent notification "${notification.title}" isShowing: ${isShowing}`
          );
          return isShowing;
        });

      notifications = [...notifications, ...recentNotifications];
    }

    // Remove duplicates by ID
    notifications = deduplicateNotifications(notifications);
    console.log(`After deduplication: ${notifications.length} notifications`);

    console.log(`Returning ${notifications.length} notifications to client`);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification from both admin and recent notifications
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

    console.log(`Deleting notification with ID: ${id}`);

    // Delete from admin notifications
    const adminNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let adminNotifications = adminNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    adminNotifications = deduplicateNotifications(adminNotifications);

    // Filter out the notification to delete
    const filteredAdminNotifications = adminNotifications.filter(
      (n) => n.id !== id
    );

    // Update admin notifications Redis - clear and rebuild to prevent duplicates
    await redisClient.del("admin_notifications");
    if (filteredAdminNotifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...filteredAdminNotifications.map((n) => JSON.stringify(n))
      );
    }

    // Delete from recent notifications
    const recentNotificationsData = await redisClient.lrange(
      "recent_notifications",
      0,
      -1
    );
    let recentNotifications = recentNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    recentNotifications = deduplicateNotifications(recentNotifications);

    // Filter out the notification to delete
    const filteredRecentNotifications = recentNotifications.filter(
      (n) => n.id !== id
    );

    // Update recent notifications Redis - clear and rebuild to prevent duplicates
    await redisClient.del("recent_notifications");
    if (filteredRecentNotifications.length > 0) {
      await redisClient.lpush(
        "recent_notifications",
        ...filteredRecentNotifications.map((n) => JSON.stringify(n))
      );
    }

    console.log(
      `Successfully deleted notification ${id} from both admin and recent notifications`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        error: "Failed to delete notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
