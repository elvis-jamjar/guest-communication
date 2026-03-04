"use server";
import { redis } from "@/lib/db";
import { ConferenceScheduleData } from "@/types";

const DATA_KEY = "4dx-26";
const DRAFT_KEY = `${DATA_KEY}:draft`;
const ACTIVITY_LOG_KEY = `${DATA_KEY}:activity-log`;
const MAX_SNAPSHOTS = 50;

export interface ActivitySnapshot {
  timestamp: string;
  data: ConferenceScheduleData;
}

// Persists full ConferenceScheduleData to Redis. Creates a timestamped snapshot of existing data before overwriting (for rollback).
export async function createConferenceSchedules(
  schedules: ConferenceScheduleData,
) {
  try {
    const existing = await redis.get(DATA_KEY);
    if (existing) {
      const snapshot: ActivitySnapshot = {
        timestamp: new Date().toISOString(),
        data: JSON.parse(existing) as ConferenceScheduleData,
      };
      await redis.lpush(ACTIVITY_LOG_KEY, JSON.stringify(snapshot));
      await redis.ltrim(ACTIVITY_LOG_KEY, 0, MAX_SNAPSHOTS - 1);
    }
    await redis.set(DATA_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.log(error);
    throw Error("Failed to save schedules");
  }
}

export async function getActivityLog(): Promise<ActivitySnapshot[]> {
  try {
    const items = await redis.lrange(ACTIVITY_LOG_KEY, 0, -1);
    return items.map((item) => JSON.parse(item) as ActivitySnapshot);
  } catch (error) {
    console.log("Error fetching activity log", error);
    return [];
  }
}

export async function rollbackToSnapshot(timestamp: string): Promise<ConferenceScheduleData | null> {
  try {
    const items = await redis.lrange(ACTIVITY_LOG_KEY, 0, -1);
    const snapshot = items
      .map((item) => JSON.parse(item) as ActivitySnapshot)
      .find((s) => s.timestamp === timestamp);
    if (!snapshot) return null;

    // Store current data in activity log before overwriting (so user can rollback again if needed)
    const existing = await redis.get(DATA_KEY);
    if (existing) {
      const currentSnapshot: ActivitySnapshot = {
        timestamp: new Date().toISOString(),
        data: JSON.parse(existing) as ConferenceScheduleData,
      };
      await redis.lpush(ACTIVITY_LOG_KEY, JSON.stringify(currentSnapshot));
      await redis.ltrim(ACTIVITY_LOG_KEY, 0, MAX_SNAPSHOTS - 1);
    }

    await redis.set(DATA_KEY, JSON.stringify(snapshot.data));
    return snapshot.data;
  } catch (error) {
    console.log("Error rolling back", error);
    return null;
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

/** Saves data to draft storage (does not affect live/published content) */
export async function saveDraft(schedules: ConferenceScheduleData) {
  try {
    await redis.set(DRAFT_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.log(error);
    throw Error("Failed to save draft");
  }
}

/** Returns draft data if it exists */
export async function getDraft(): Promise<ConferenceScheduleData | null> {
  try {
    const draft = await redis.get(DRAFT_KEY);
    if (!draft) return null;
    return JSON.parse(draft) as ConferenceScheduleData;
  } catch (error) {
    console.log("Error fetching draft", error);
    return null;
  }
}

/** Publishes draft to live. Creates snapshot before overwriting. Clears draft after success. */
export async function publishDraft() {
  try {
    const draft = await redis.get(DRAFT_KEY);
    if (!draft) return { success: false, error: "No draft to publish" };

    const draftData = JSON.parse(draft) as ConferenceScheduleData;

    // Create snapshot of existing live data before overwriting
    const existing = await redis.get(DATA_KEY);
    if (existing) {
      const snapshot: ActivitySnapshot = {
        timestamp: new Date().toISOString(),
        data: JSON.parse(existing) as ConferenceScheduleData,
      };
      await redis.lpush(ACTIVITY_LOG_KEY, JSON.stringify(snapshot));
      await redis.ltrim(ACTIVITY_LOG_KEY, 0, MAX_SNAPSHOTS - 1);
    }

    await redis.set(DATA_KEY, JSON.stringify(draftData));
    await redis.del(DRAFT_KEY);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to publish" };
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
