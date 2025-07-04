"use server";
import { redis } from "@/lib/db";
import {
  ConferenceScheduleProps,
  PageContent,
  Settings,
  // TimelineItemProps,
} from "@/app/types";
import { DATABASE_KEYS } from "@/lib/db";
import { formatDateTime } from "@/utils/date";

/**
 * create new timeline item
 * @param item
 * @returns
 */
// export async function createTimelineItem(item: TimelineItemProps) {
//   const items = await getTimelineItems();
//   items.push(item);
//   await redis.set(DATABASE_KEYS.TIMELINE_ITEMS, JSON.stringify(items));
// }

/**
 * update timeline item
 * @param item
 * @returns
 */
// export async function updateTimelineItem(item: TimelineItemProps) {
//   const items = await getTimelineItems();
//   if (!items) return;
//   const index = items.findIndex((i) => i.id === item.id);
//   if (index === -1) return;
//   items[index] = item;
//   await redis.set(DATABASE_KEYS.TIMELINE_ITEMS, JSON.stringify(items));
// }

// update history
// export async function updateHistory(content: any) {
//   const dateKey = formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss");
//   const history = await redis.get(DATABASE_KEYS.HISTORY);
//   if (!history) {
//     await redis.set(
//       DATABASE_KEYS.HISTORY,
//       JSON.stringify({
//         [dateKey]: content,
//       })
//     );
//   } else {
//     const historyData = JSON.parse(history);
//     historyData[dateKey] = content;
//     await redis.set(DATABASE_KEYS.HISTORY, JSON.stringify(historyData));
//   }
// }

// create update or create shedules
export async function createConferenceSchedules(
  schedules: ConferenceScheduleProps[]
) {
  try {
    // await updateHistory(schedules);
    await backupData();
    await redis.set(
      DATABASE_KEYS.CONFERENCE_SCHEDULES,
      JSON.stringify(schedules)
    );
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

export async function getConferenceSchedule(): Promise<
  ConferenceScheduleProps[]
> {
  try {
    const schedules = await redis.get(DATABASE_KEYS.CONFERENCE_SCHEDULES);
    if (!schedules) return [];
    console.log("schedules type", typeof schedules);
    return JSON.parse(schedules) as ConferenceScheduleProps[];
  } catch (error) {
    console.log("Error fetchign schedules", error);
    throw Error("Failed to fetch schedules");
  }
}

// export async function getTimelineItems(): Promise<TimelineItemProps[]> {
//   const items = await redis.get(DATABASE_KEYS.TIMELINE_ITEMS);
//   if (!items) return [];
//   return JSON.parse(items);
// }

// create setting for the conference
export async function createConferenceSettings(settings: Settings) {
  // await updateHistory(settings);
  await backupData();
  await redis.set(DATABASE_KEYS.CONFERENCE_SETTINGS, JSON.stringify(settings));
}

// get settings for the conference
export async function getConferenceSettings(): Promise<Settings> {
  const settings = await redis.get(DATABASE_KEYS.CONFERENCE_SETTINGS);
  if (!settings)
    return {
      columns: 1,
    };
  return JSON.parse(settings);
}

// page content PageContent
export async function createPageContent(content: PageContent) {
  // await updateHistory(content);
  await backupData();
  await redis.set(DATABASE_KEYS.PAGE_CONTENT, JSON.stringify(content));
}

// get page content
export async function getPageContent(): Promise<PageContent> {
  const content = await redis.get(DATABASE_KEYS.PAGE_CONTENT);
  if (!content) return {};
  return JSON.parse(content);
}

// backup data
export async function backupData() {
  const conferenceSchedules = await redis.get(
    DATABASE_KEYS.CONFERENCE_SCHEDULES
  );
  const conferenceSettings = await redis.get(DATABASE_KEYS.CONFERENCE_SETTINGS);
  const pageContent = await redis.get(DATABASE_KEYS.PAGE_CONTENT);

  // GET PREVIOUS BACKUP
  const previousBackup = await redis.get(DATABASE_KEYS.BACKUP);
  const previousBackupData = JSON.parse(previousBackup || "{}");

  // use current time as key
  const currentTime = formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss");
  const newBackupData = {
    [currentTime]: {
      conferenceSchedules: JSON.parse(conferenceSchedules || "{}"),
      conferenceSettings: JSON.parse(conferenceSettings || "{}"),
      pageContent: JSON.parse(pageContent || "{}"),
    },
  };

  // merge new backup data with previous backup data
  const mergedBackupData = { ...newBackupData, ...previousBackupData };

  // save backup data
  await redis.set(DATABASE_KEYS.BACKUP, JSON.stringify(mergedBackupData));
}

// migrate data from old database to new database using old keys to new keys
// export async function migrateData() {
//   // const oldTimelineItems = await redis.get(DATABASE_KEYS.OLD_TIMELINE_ITEMS);
//   const oldConferenceSchedules = await redis.get(
//     DATABASE_KEYS.OLD_CONFERENCE_SCHEDULES
//   );
//   const oldConferenceSettings = await redis.get(
//     DATABASE_KEYS.OLD_CONFERENCE_SETTINGS
//   );
//   const oldPageContent = await redis.get(DATABASE_KEYS.OLD_PAGE_CONTENT);

//   // if (oldTimelineItems) {
//   //   await redis.set(DATABASE_KEYS.TIMELINE_ITEMS, oldTimelineItems);
//   // }
//   if (oldConferenceSchedules) {
//     await redis.set(DATABASE_KEYS.CONFERENCE_SCHEDULES, oldConferenceSchedules);
//   }
//   if (oldConferenceSettings) {
//     await redis.set(DATABASE_KEYS.CONFERENCE_SETTINGS, oldConferenceSettings);
//   }
//   if (oldPageContent) {
//     await redis.set(DATABASE_KEYS.PAGE_CONTENT, oldPageContent);
//   }
// }
