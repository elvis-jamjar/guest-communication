import { NextResponse } from "next/server";

// Test endpoint to manually trigger the cron job
export async function GET() {
  try {
    console.log("Manual cron test triggered at:", new Date().toISOString());

    // Call the cron job endpoint
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    console.log("Calling cron job at:", `${baseUrl}/api/cron/notifications`);

    const response = await fetch(`${baseUrl}/api/cron/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cron job failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Cron job result:", result);

    return NextResponse.json({
      success: true,
      message: "Cron job test completed",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Cron test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
