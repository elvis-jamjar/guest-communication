import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    console.log("Test notifications endpoint called");

    // Test Redis connection
    const testKey = "test-notification-key";
    await redisClient.set(testKey, "test-value");
    const testValue = await redisClient.get(testKey);
    await redisClient.del(testKey);

    if (testValue !== "test-value") {
      throw new Error("Redis connection test failed");
    }

    console.log("Redis connection test passed");

    // Test publishing a notification
    const testNotification = {
      id: `test-${Date.now()}`,
      title: "Test Notification",
      message:
        "This is a test notification to verify the polling system is working",
      timestamp: new Date().toISOString(),
      isShowing: true,
      priority: "medium",
    };

    console.log("Storing test notification:", testNotification);

    // Store in recent notifications for polling system
    await redisClient.lpush(
      "recent_notifications",
      JSON.stringify(testNotification)
    );
    await redisClient.ltrim("recent_notifications", 0, 19); // Keep only last 20

    // Check both admin and recent notifications
    const [adminNotifications, recentNotifications] = await Promise.all([
      redisClient.lrange("admin_notifications", 0, -1),
      redisClient.lrange("recent_notifications", 0, -1),
    ]);

    console.log(
      `Found ${adminNotifications.length} admin notifications and ${recentNotifications.length} recent notifications`
    );

    return NextResponse.json({
      success: true,
      message: "Test notification stored successfully",
      redisConnection: "OK",
      adminNotificationsCount: adminNotifications.length,
      recentNotificationsCount: recentNotifications.length,
      testNotification: testNotification,
    });
  } catch (error) {
    console.error("Test notifications error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
