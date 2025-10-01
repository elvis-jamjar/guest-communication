import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/app/actions/timeline";

export async function GET(req: NextRequest) {
  try {
    const notifications = await getNotifications();

    // Return notifications with their impression data
    const notificationsWithImpressions = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      impressions: notification.impressions || 0,
      uniqueRecipients: notification.uniqueRecipients || 0,
      recipientIPs: notification.recipientIPs || [],
      isShowing: notification.isShowing,
    }));

    return NextResponse.json({
      success: true,
      notifications: notificationsWithImpressions,
      totalNotifications: notifications.length,
      totalImpressions: notifications.reduce(
        (sum, n) => sum + (n.impressions || 0),
        0
      ),
      totalUniqueRecipients: notifications.reduce(
        (sum, n) => sum + (n.uniqueRecipients || 0),
        0
      ),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
