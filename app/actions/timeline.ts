"use server";
import {
  ConferenceScheduleProps,
  PageContent,
  Settings,
  Speaker,
  TimelineItemProps,
} from "@/app/types";
import { redis } from "@/lib/db";

/**
 * create new timeline item
 * @param item
 * @returns
 */
export async function createTimelineItem(item: TimelineItemProps) {
  const items = await getTimelineItems();
  items.push(item);
  await redis.set("4dx-timeline-items", JSON.stringify(items));
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
  await redis.set("4dx-timeline-items", JSON.stringify(items));
}

// create update or create shedules
export async function createConferenceSchedules(
  schedules: ConferenceScheduleProps[]
) {
  try {
    await redis.set("4dx-conference-schedules", JSON.stringify(schedules));
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

export async function getConferenceSchedule(): Promise<
  ConferenceScheduleProps[]
> {
  try {
    const schedules = await redis.get("4dx-conference-schedules");
    if (!schedules) return [];
    return JSON.parse(schedules) as ConferenceScheduleProps[];
  } catch (error) {
    console.log("Error fetchign schedules", error);
    throw Error("Failed to fetch schedules");
  }
}

// get all speakers from timeline items
export async function getSpeakers(): Promise<Speaker[]> {
  const items = await getConferenceSchedule(); // get all
  const speakers: Speaker[] = [];
  items.forEach((item) => {
    if (item.timeLineItems) {
      item?.timeLineItems?.forEach((t) => {
        if (t.speakers) {
          t.speakers.forEach((s) => {
            speakers.push(s);
          });
        }
      });
    }
  });
  return speakers;
}

export async function getTimelineItems(): Promise<TimelineItemProps[]> {
  const items = await redis.get("4dx-timeline-items");
  if (!items) return [];
  return JSON.parse(items);
}

// create setting for the conference
export async function createConferenceSettings(settings: Settings) {
  await redis.set("4dx-conference-settings", JSON.stringify(settings));
}

// get settings for the conference
export async function getConferenceSettings(): Promise<Settings> {
  const settings = await redis.get("4dx-conference-settings");
  if (!settings)
    return {
      columns: 1,
    };
  return JSON.parse(settings);
}

// page content PageContent
export async function createPageContent(content: PageContent) {
  await redis.set("4dx-page-content", JSON.stringify(content));
}

// get page content
export async function getPageContent(): Promise<PageContent> {
  const content = await redis.get("4dx-page-content");
  if (!content) return {};
  return JSON.parse(content);
}
