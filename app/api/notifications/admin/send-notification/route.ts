import { NextRequest, NextResponse } from "next/server";
import { redisPublisher, redisClient } from "@/lib/db";
import { Notification } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const notificationData: Notification = await req.json();
    console.log("Sending notification:", notificationData);

    const jsonData = JSON.stringify(notificationData);
    console.log("Publishing to Redis:", jsonData);

    // Publish to SSE subscribers
    await redisPublisher.publish("notifications", jsonData);

    // Store in Redis for recent notifications (with timestamp and ID)
    const notificationWithTimestamp = {
      ...notificationData,
      id: notificationData.id || Date.now().toString(),
      timestamp: notificationData.timestamp || new Date().toISOString(),
    };

    // Store in a list of recent notifications (keep last 20)
    await redisClient.lpush(
      "recent_notifications",
      JSON.stringify(notificationWithTimestamp)
    );
    await redisClient.ltrim("recent_notifications", 0, 19); // Keep only last 20

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
