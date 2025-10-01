import { NextRequest, NextResponse } from "next/server";
import { updateImpressions } from "@/app/actions/timeline";

export async function POST(req: NextRequest) {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Extract IP address from request
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfConnectingIp = req.headers.get("cf-connecting-ip");

    // Get IP from various headers (for different proxy configurations)
    let userIp =
      forwarded?.split(",")[0]?.trim() ||
      realIp ||
      cfConnectingIp ||
      req.ip ||
      "127.0.0.1";

    // Clean up the IP address (remove port if present)
    userIp = userIp.split(":")[0];

    // Update impressions
    await updateImpressions(notificationId, userIp);

    return NextResponse.json({
      success: true,
      message: "Impression tracked successfully",
      ip: userIp,
    });
  } catch (error) {
    console.error("Error tracking impression:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track impression",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
