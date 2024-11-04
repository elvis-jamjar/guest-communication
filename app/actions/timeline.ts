"use server";
import { redis } from "@/lib/db";
import { ConferenceScheduleData } from "@/types";

const DATA_KEY = "4dx-conference-schedules-lts";
const OLD_DATA_KEY = "4dx-conference-schedules";

// create update or create shedules
export async function createConferenceSchedules(
  schedules: ConferenceScheduleData
) {
  try {
    await redis.set(DATA_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

export async function getConferenceSchedule(): Promise<ConferenceScheduleData> {
  try {
    const schedules = await redis.get(DATA_KEY);
    if (!schedules) return { schedule: [] };
    return JSON.parse(schedules) as ConferenceScheduleData;
  } catch (error) {
    console.log("Error fetchign schedules", error);
    throw Error("Failed to fetch schedules");
  }
}

// copy data from old key to new key
// export async function moveData() {
//   const schedules = await redis.get(OLD_DATA_KEY);
//   if (!schedules) return;
//   const data: ConferenceScheduleData = {
//     schedule: JSON.parse(schedules),
//     quickLinkData: {},
//     settings: {},
//     pageContent: {},
//   };
//   await redis.set(DATA_KEY, JSON.stringify(data));
// }
