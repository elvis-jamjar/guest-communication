"use server";

import { redis } from "@/lib/db";
import {
  ConferenceScheduleProps,
  DataType,
  PageContent,
  Settings,
  Notification as NotificationType,
} from "@/app/types";
import { DATABASE_KEYS } from "@/lib/db";
import { formatDateTime } from "@/utils/date";

// create update or create shedules
export async function createConferenceSchedules(
  schedules: ConferenceScheduleProps[]
) {
  try {
    // await updateHistory(schedules);
    // await backupData();
    // await redis.set(
    //   DATABASE_KEYS.CONFERENCE_SCHEDULES,
    //   JSON.stringify(schedules)
    // );
    await updateData("schedules", schedules);
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

// create setting for the conference
export async function createConferenceSettings(settings: Settings) {
  // await updateHistory(settings);
  // await backupData();
  // await redis.set(DATABASE_KEYS.CONFERENCE_SETTINGS, JSON.stringify(settings));
  await updateData("settings", settings);
}

// page content PageContent
export async function createPageContent(content: PageContent) {
  await updateData("pageContent", content);
}

// update all data
export async function updateAllData(data: DataType) {
  const currentData = await getData();
  const backupData = await redis.get(DATABASE_KEYS.DATA_BACKUP);
  const backupDataJson = JSON.parse(backupData || "{}");
  backupDataJson[formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss")] =
    currentData;
  await redis.set(DATABASE_KEYS.DATA_BACKUP, JSON.stringify(backupDataJson));
  await redis.set(DATABASE_KEYS.DATA, JSON.stringify(data));
}

// backup data
// export async function backupData() {
//   // const conferenceSchedules = await redis.get(
//   //   DATABASE_KEYS.CONFERENCE_SCHEDULES
//   // );
//   // const conferenceSettings = await redis.get(DATABASE_KEYS.CONFERENCE_SETTINGS);
//   // const pageContent = await redis.get(DATABASE_KEYS.PAGE_CONTENT);

//   // // GET PREVIOUS BACKUP
//   // const previousBackup = await redis.get(DATABASE_KEYS.BACKUP);
//   // const previousBackupData = JSON.parse(previousBackup || "{}");

//   // // use current time as key
//   // const currentTime = formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss");
//   // const newBackupData = {
//   //   [currentTime]: {
//   //     conferenceSchedules: JSON.parse(conferenceSchedules || "{}"),
//   //     conferenceSettings: JSON.parse(conferenceSettings || "{}"),
//   //     pageContent: JSON.parse(pageContent || "{}"),
//   //   },
//   // };

//   // merge new backup data with previous backup data
//   // const mergedBackupData = { ...newBackupData, ...previousBackupData };
//   const data = await getData();
//   const backupData = await redis.get(DATABASE_KEYS.DATA_BACKUP);
//   const backupDataJson = JSON.parse(backupData || "{}");
//   backupDataJson[formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss")] = data;
//   await redis.set(DATABASE_KEYS.DATA_BACKUP, JSON.stringify(backupDataJson));

//   // save backup data
//   // await redis.set(DATABASE_KEYS.BACKUP, JSON.stringify(mergedBackupData));
// }

// update data
export async function updateData<K extends keyof DataType>(
  key: K,
  data: DataType[K]
) {
  const currentData = await getData();

  if (currentData) {
    const backupData = await redis.get(DATABASE_KEYS.DATA_BACKUP);
    const backupDataJson = JSON.parse(backupData || "{}");
    backupDataJson[formatDateTime(new Date(), "YYYY-MM-DD HH:mm:ss")] =
      currentData;
    await redis.set(DATABASE_KEYS.DATA_BACKUP, JSON.stringify(backupDataJson));
  }
  currentData[key] = data as DataType[K];
  await redis.set(DATABASE_KEYS.DATA, JSON.stringify(currentData));
}

// publish data
export async function publishData() {
  const data = await getData();
  await redis.set(DATABASE_KEYS.DATA_PUBLISHED, JSON.stringify(data));
}

// get published data
export async function getPublishedData(isPreview: boolean): Promise<DataType> {
  const data = isPreview
    ? await redis.get(DATABASE_KEYS.DATA)
    : await redis.get(DATABASE_KEYS.DATA_PUBLISHED);
  if (!data)
    return {
      schedules: [],
      settings: { columns: 1 },
      pageContent: {},
      allSponsorsBanner: { image: "" },
      allPartnersBanner: { image: "" },
    };
  return JSON.parse(data);
}

// get data from the new data type
export async function getData(): Promise<DataType> {
  const data = await redis.get(DATABASE_KEYS.DATA);
  if (!data)
    return {
      schedules: [],
      settings: { columns: 1 },
      pageContent: {},
      allSponsorsBanner: { image: "" },
      allPartnersBanner: { image: "" },
    };
  return JSON.parse(data);
}

// get history data
export async function getHistoryData(): Promise<{ [key: string]: DataType }> {
  const data = await redis.get(DATABASE_KEYS.DATA_BACKUP);
  if (!data) return {};
  return JSON.parse(data);
}

// update history name
export async function updateHistoryName(key: string, name: string) {
  const data = await redis.get(DATABASE_KEYS.DATA_BACKUP);
  const dataJson = JSON.parse(data || "{}");
  dataJson[key].name = name;
  await redis.set(DATABASE_KEYS.DATA_BACKUP, JSON.stringify(dataJson));
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

// move all the data to the new data type
// export async function moveDataToNewDataType() {
//   const schedules = await redis.get(DATABASE_KEYS.CONFERENCE_SCHEDULES);
//   const settings = await redis.get(DATABASE_KEYS.CONFERENCE_SETTINGS);
//   const pageContent = await redis.get(DATABASE_KEYS.PAGE_CONTENT);

//   const data = {
//     schedules: JSON.parse(schedules || "[]") as ConferenceScheduleProps[],
//     settings: JSON.parse(settings || "{}") as Settings,
//     pageContent: JSON.parse(pageContent || "{}") as PageContent,
//   } as DataType;

//   await redis.set(DATABASE_KEYS.DATA, JSON.stringify(data));
// }

// // get data from the new data type
// export async function getData(): Promise<DataType> {
//   const data = await redis.get(DATABASE_KEYS.DATA);
//   if (!data) return { schedules: [], settings: {}, pageContent: {} };
//   return JSON.parse(data);
// }

// upload file to the server
export async function uploadFile(formData: FormData): Promise<string> {
  // const formData = new FormData();
  // formData.append("file", file);
  formData.append("path", process.env.FOLDER_NAME!);
  const response = await fetch(process.env.FILE_UPLOAD_URL!, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  const data = await response.json();
  return data.url as string;
}

// create notification
export async function createNotification(
  notificationData: Omit<
    NotificationType,
    "id" | "timestamp" | "impressions" | "uniqueRecipients" | "recipientIPs"
  >
): Promise<NotificationType> {
  const notifications = await getNotifications();

  const newNotification: NotificationType = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    impressions: 0,
    uniqueRecipients: 0,
    recipientIPs: [],
    ...notificationData,
  };

  const updatedNotifications = [newNotification, ...notifications];
  await redis.set(
    DATABASE_KEYS.NOTIFICATIONS,
    JSON.stringify(updatedNotifications)
  );

  return newNotification;
}

// update notification
export async function updateNotification(
  id: string,
  notificationData: Partial<
    Omit<
      NotificationType,
      "id" | "timestamp" | "impressions" | "uniqueRecipients" | "recipientIPs"
    >
  >
): Promise<NotificationType> {
  const notifications = await getNotifications();
  const notificationIndex = notifications.findIndex((n) => n.id === id);

  if (notificationIndex === -1) {
    throw new Error("Notification not found");
  }

  const updatedNotification = {
    ...notifications[notificationIndex],
    ...notificationData,
  };

  notifications[notificationIndex] = updatedNotification;
  await redis.set(DATABASE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

  return updatedNotification;
}

// get notifications
export async function getNotifications(): Promise<NotificationType[]> {
  try {
    console.log(
      "Fetching notifications from Redis with key:",
      DATABASE_KEYS.NOTIFICATIONS
    );
    const notifications = await redis.get(DATABASE_KEYS.NOTIFICATIONS);
    console.log(
      "Raw notifications data:",
      notifications ? "Found data" : "No data"
    );

    if (!notifications) {
      console.log("No notifications found, returning empty array");
      return [];
    }

    const parsedNotifications = JSON.parse(notifications);
    console.log("Parsed notifications count:", parsedNotifications.length);
    return parsedNotifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error(
      `Failed to fetch notifications: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// delete notification
export async function deleteNotification(id: string): Promise<void> {
  const notifications = await getNotifications();
  const filteredNotifications = notifications.filter(
    (notification) => notification.id !== id
  );
  await redis.set(
    DATABASE_KEYS.NOTIFICATIONS,
    JSON.stringify(filteredNotifications)
  );
}

// publish notification
export async function publishNotification(
  notificationId: string,
  targetAudience: string
): Promise<NotificationType> {
  const notifications = await getNotifications();
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );

  if (notificationIndex === -1) {
    throw new Error("Notification not found");
  }

  const updatedNotification = {
    ...notifications[notificationIndex],
    status: "active" as const,
    targetAudience: targetAudience as "all" | "preview" | "public",
    publishedAt: new Date().toISOString(),
    isShowing: !notifications[notificationIndex].isShowing,
  };

  notifications[notificationIndex] = updatedNotification;
  await redis.set(DATABASE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

  return updatedNotification;
}

// update impressions
export async function updateImpressions(
  notificationId: string,
  userIp: string
): Promise<void> {
  const notifications = await getNotifications();
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );
  if (notificationIndex === -1) {
    throw new Error("Notification not found");
  }

  const notification = notifications[notificationIndex];
  const recipientIPs = notification.recipientIPs || [];

  if (!recipientIPs.includes(userIp)) {
    recipientIPs.push(userIp);
    const updatedNotification = {
      ...notification,
      impressions: (notification.impressions || 0) + 1,
      uniqueRecipients: recipientIPs.length,
      recipientIPs: recipientIPs,
    };

    notifications[notificationIndex] = updatedNotification;
    await redis.set(DATABASE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

// archive notification
export async function archiveNotification(
  notificationId: string
): Promise<NotificationType> {
  const notifications = await getNotifications();
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );

  if (notificationIndex === -1) {
    throw new Error("Notification not found");
  }

  const updatedNotification = {
    ...notifications[notificationIndex],
    status: "archived" as const,
    archivedAt: new Date().toISOString(),
    isShowing: false,
  };

  notifications[notificationIndex] = updatedNotification;
  await redis.set(DATABASE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

  return updatedNotification;
}
