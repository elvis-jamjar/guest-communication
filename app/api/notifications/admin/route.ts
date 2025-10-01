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

// GET - Fetch all notifications for admin management
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const targetAudience = searchParams.get("targetAudience");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get all notifications from Redis
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );

    let notifications: Notification[] = [];

    if (allNotificationsData && allNotificationsData.length > 0) {
      notifications = allNotificationsData
        .map((notification) => {
          try {
            return JSON.parse(notification);
          } catch (error) {
            console.error("Error parsing notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null);

      // Remove duplicates by ID
      notifications = deduplicateNotifications(notifications);
    }

    // Apply filters
    let filteredNotifications = notifications;

    if (status) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.status === status
      );
    }

    if (targetAudience) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.targetAudience === targetAudience
      );
    }

    // Sort by timestamp (newest first)
    filteredNotifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination
    const paginatedNotifications = filteredNotifications.slice(
      offset,
      offset + limit
    );

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      hasMore: offset + limit < filteredNotifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Create a new notification
export async function POST(req: NextRequest) {
  try {
    const notificationData: Omit<
      Notification,
      "id" | "timestamp" | "impressions" | "uniqueRecipients" | "recipientIPs"
    > = await req.json();

    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: notificationData.status || "draft",
      targetAudience: notificationData.targetAudience || "all",
      impressions: 0,
      uniqueRecipients: 0,
      recipientIPs: [],
      createdBy: notificationData.createdBy || "admin",
    };

    // Store in Redis
    await redisClient.lpush(
      "admin_notifications",
      JSON.stringify(notification)
    );

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PUT - Update a notification
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updateData }: Notification = await req.json();

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    notifications = deduplicateNotifications(notifications);

    // Find and update the notification
    const notificationIndex = notifications.findIndex((n) => n.id === id);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updatedNotification = {
      ...notifications[notificationIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    };

    notifications[notificationIndex] = updatedNotification;

    // Update Redis - clear and rebuild to prevent duplicates
    await redisClient.del("admin_notifications");
    if (notifications.length > 0) {
      await redisClient.lpush(
        "admin_notifications",
        ...notifications.map((n) => JSON.stringify(n))
      );
    }

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification
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

    // Get all notifications
    const allNotificationsData = await redisClient.lrange(
      "admin_notifications",
      0,
      -1
    );
    let notifications = allNotificationsData.map((n) => JSON.parse(n));

    // Remove duplicates before processing
    notifications = deduplicateNotifications(notifications);

    // Filter out the notification to delete
    const filteredNotifications = notifications.filter((n) => n.id !== id);

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
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
