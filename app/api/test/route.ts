// app/api/test/route.ts
import { getConferenceSchedule } from "@/app/actions/timeline";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  // Simulate some data fetching or processing
  const data = {
    message: "This is a GET request",
    timestamp: new Date().toISOString(),
  };

  // Optionally, you can add a delay to simulate processing time
  //   await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
  const schedules = await getConferenceSchedule();

  return NextResponse.json(schedules);
}
