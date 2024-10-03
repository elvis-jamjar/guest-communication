"use server";
import { redis } from "@/lib/db";
import { ConferenceScheduleProps, TimelineItemProps } from "@/app/types";

/**
 * create new timeline item
 * @param item
 * @returns
 */
export async function createTimelineItem(item: TimelineItemProps) {
  const items = await getTimelineItems();
  items.push(item);
  await redis.set("timeline-items", JSON.stringify(items));
}

/**
 * update timeline item
 * @param item
 * @returns
 */
export async function updateTimelineItem(item: TimelineItemProps) {
  const items = await getTimelineItems();
  if (!items) return;
  const index = items.findIndex((i) => i.id === item.id);
  if (index === -1) return;
  items[index] = item;
  await redis.set("timeline-items", JSON.stringify(items));
}

// create update or create shedules
export async function createConferenceSchedules(
  schedules: ConferenceScheduleProps[]
) {
  try {
    await redis.set("conference-schedules", JSON.stringify(schedules));
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

export async function getConferenceSchedule(): Promise<
  ConferenceScheduleProps[]
> {
  try {
    const schedules = await redis.get("conference-schedules");
    if (!schedules) return [];
    return JSON.parse(schedules) as ConferenceScheduleProps[];
  } catch (error) {
    console.log("Error fetchign schedules", error);
    throw Error("Failed to fetch schedules");
  }
}

export async function getTimelineItems(): Promise<TimelineItemProps[]> {
  const items = await redis.get("timeline-items");
  if (!items) return [];
  return JSON.parse(items);
}
