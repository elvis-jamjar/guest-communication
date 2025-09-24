import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    // Fetch recent notifications from Redis
    const recentNotificationsData = await redisClient.lrange(
      "recent_notifications",
      0,
      5
    ); // Get last 5

    let recentNotifications = [];

    if (recentNotificationsData && recentNotificationsData.length > 0) {
      // Parse the stored notifications
      recentNotifications = recentNotificationsData
        .map((notification) => {
          try {
            return JSON.parse(notification);
          } catch (error) {
            console.error("Error parsing stored notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null);
    } else {
      // No recent notifications exist - return empty array
      recentNotifications = [];
    }

    return NextResponse.json({ notifications: recentNotifications });
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent notifications" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification from recent notifications
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

    // Get all recent notifications
    const recentNotificationsData = await redisClient.lrange(
      "recent_notifications",
      0,
      -1
    );
    const recentNotifications = recentNotificationsData.map((n) =>
      JSON.parse(n)
    );

    // Filter out the notification to delete
    const filteredNotifications = recentNotifications.filter(
      (n) => n.id !== id
    );

    // Update Redis
    await redisClient.del("recent_notifications");
    if (filteredNotifications.length > 0) {
      await redisClient.lpush(
        "recent_notifications",
        ...filteredNotifications.map((n) => JSON.stringify(n))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification from recent:", error);
    return NextResponse.json(
      { error: "Failed to delete notification from recent" },
      { status: 500 }
    );
  }
}
