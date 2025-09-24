import { NextRequest, NextResponse } from "next/server";

// Vercel Cron Job - Process scheduled notifications
// This endpoint is called by Vercel Cron every minute
export async function GET(req: NextRequest) {
  try {
    // Verify this is a cron request (optional security check)
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Cron job triggered at:", new Date().toISOString());
    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });

    // Call our schedule processing endpoint
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/notifications/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Schedule processing failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Cron job completed:", result);

    return NextResponse.json({
      success: true,
      message: "Cron job completed successfully",
      processed: result.processed || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
