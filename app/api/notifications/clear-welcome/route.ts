import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/db";

export async function POST(_req: NextRequest) {
  try {
    // Get all recent notifications from Redis
    const recentNotificationsData = await redisClient.lrange(
      "recent_notifications",
      0,
      -1
    );

    if (recentNotificationsData && recentNotificationsData.length > 0) {
      // Parse and filter out welcome notifications
      const notifications = recentNotificationsData
        .map((notification) => {
          try {
            return JSON.parse(notification);
          } catch (error) {
            console.error("Error parsing stored notification:", error);
            return null;
          }
        })
        .filter((notification) => notification !== null);

      // Filter out welcome notifications
      const filteredNotifications = notifications.filter(
        (notification) =>
          !notification.title?.toLowerCase().includes("welcome") &&
          !notification.message?.toLowerCase().includes("welcome")
      );

      // Clear the existing list
      await redisClient.del("recent_notifications");

      // Add back only the non-welcome notifications
      if (filteredNotifications.length > 0) {
        await redisClient.lpush(
          "recent_notifications",
          ...filteredNotifications.map((n) => JSON.stringify(n))
        );
        await redisClient.ltrim("recent_notifications", 0, 9); // Keep only last 10
      }

      return NextResponse.json({
        success: true,
        message: `Removed ${
          notifications.length - filteredNotifications.length
        } welcome notifications`,
        remainingNotifications: filteredNotifications.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: "No notifications found to clear",
      remainingNotifications: 0,
    });
  } catch (error) {
    console.error("Error clearing welcome notifications:", error);
    return NextResponse.json(
      { error: "Failed to clear welcome notifications" },
      { status: 500 }
    );
  }
}
