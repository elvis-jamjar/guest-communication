import { NextRequest } from "next/server";
import { redisSubscriber, redisClient } from "@/lib/db";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let isControllerClosed = false;

      // Helper function to safely enqueue data
      const safeEnqueue = (data: Uint8Array) => {
        try {
          if (!isControllerClosed) {
            controller.enqueue(data);
          }
        } catch (error) {
          console.log("Controller is closed, stopping enqueue operations");
          isControllerClosed = true;
        }
      };

      // Helper function to track impression
      const trackImpression = async (
        notificationId: string,
        ipAddress: string,
        userAgent: string
      ) => {
        try {
          await fetch(
            `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/api/notifications/analytics`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                notificationId,
                ipAddress,
                userAgent,
              }),
            }
          );
        } catch (error) {
          console.error("Error tracking impression:", error);
        }
      };

      // Get client IP and user agent
      const ipAddress =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = req.headers.get("user-agent") || "unknown";

      // Subscribe to Redis notifications channel
      await redisSubscriber.subscribe("notifications");

      // Set up message handler
      redisSubscriber.on("message", async (channel, message) => {
        console.log("Redis message received:", { channel, message });
        if (channel === "notifications" && !isControllerClosed) {
          console.log("Sending notification to client:", message);
          try {
            const notification = JSON.parse(message);
            // Track impression for analytics
            if (notification.id) {
              await trackImpression(notification.id, ipAddress, userAgent);
            }
          } catch (error) {
            console.error("Error parsing notification for tracking:", error);
          }
          safeEnqueue(encoder.encode(`data: ${message}\n\n`));
        }
      });

      // Keep alive
      const interval = setInterval(() => {
        if (!isControllerClosed) {
          safeEnqueue(encoder.encode(`: keepalive\n\n`));
        } else {
          clearInterval(interval);
        }
      }, 20000);

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        console.log("Client disconnected, cleaning up SSE connection");
        isControllerClosed = true;
        clearInterval(interval);
        redisSubscriber.unsubscribe("notifications");
        try {
          controller.close();
        } catch (error) {
          // Controller might already be closed
        }
      });

      // Handle stream close
      req.signal.addEventListener("close", () => {
        console.log("Stream closed, cleaning up");
        isControllerClosed = true;
        clearInterval(interval);
        redisSubscriber.unsubscribe("notifications");
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
