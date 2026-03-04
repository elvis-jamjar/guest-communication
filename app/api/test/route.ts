// app/api/test/route.ts
import { getConferenceSchedule } from "@/app/actions/timeline";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const schedules = await getConferenceSchedule();

  return NextResponse.json(schedules);
}
