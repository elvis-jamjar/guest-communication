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
