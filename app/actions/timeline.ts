"use server";
import { ConferenceScheduleProps, PageContent, Settings } from "@/app/types";
import { redis } from "@/lib/db";

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
