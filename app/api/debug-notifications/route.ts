import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/db";
import { DATABASE_KEYS } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    // Check Redis connection
    const pingResult = await redis.ping();

    // Check if notifications key exists
    const notificationsKey = DATABASE_KEYS.NOTIFICATIONS;
    const exists = await redis.exists(notificationsKey);

    // Get raw notifications data
    const rawData = await redis.get(notificationsKey);

    // Try to parse the data
    let parsedData = null;
    let parseError = null;

    if (rawData) {
      try {
        parsedData = JSON.parse(rawData);
      } catch (error) {
        parseError =
          error instanceof Error ? error.message : "Unknown parse error";
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics: {
        redis: {
          ping: pingResult,
          connected: pingResult === "PONG",
        },
        notifications: {
          key: notificationsKey,
          exists: exists === 1,
          hasData: !!rawData,
          dataLength: rawData ? rawData.length : 0,
          parseError,
          parsedCount: parsedData ? parsedData.length : 0,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isLocal: process.env.isLocal,
        },
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
