import { Redis } from "ioredis";

// Create separate Redis connections for different purposes
export const redis = new Redis(process.env.NEXT_REDIS_URL as string);
export const redisClient = redis; // Alias for general Redis operations
export const redisPublisher = new Redis(process.env.NEXT_REDIS_URL as string);
export const redisSubscriber = new Redis(process.env.NEXT_REDIS_URL as string);

const isLocal = process.env.isLocal === "true";

// export constants of database keys
const PROJECT_NAME = "2025-ACGC";
const PROJECT_NAME_LOCAL = "2025-ACGC-LOCAL";
export const DATABASE_KEYS = {
  DATA: isLocal ? `${PROJECT_NAME_LOCAL}-DATA` : `${PROJECT_NAME}-DATA`,
  DATA_BACKUP: isLocal
    ? `${PROJECT_NAME_LOCAL}-DATA-BACKUP`
    : `${PROJECT_NAME}-DATA-BACKUP`,
  DATA_PUBLISHED: isLocal
    ? `${PROJECT_NAME_LOCAL}-DATA-PUBLISHED`
    : `${PROJECT_NAME}-DATA-PUBLISHED`,
  //   TIMELINE_ITEMS: `${PROJECT_NAME}-timeline-items`,
  CONFERENCE_SCHEDULES: isLocal
    ? `${PROJECT_NAME_LOCAL}-conference-schedules`
    : `${PROJECT_NAME}-conference-schedules`,
  CONFERENCE_SETTINGS: isLocal
    ? `${PROJECT_NAME_LOCAL}-conference-settings`
    : `${PROJECT_NAME}-conference-settings`,
  PAGE_CONTENT: isLocal
    ? `${PROJECT_NAME_LOCAL}-page-content`
    : `${PROJECT_NAME}-page-content`,
  //   OLD_TIMELINE_ITEMS: "timeline-items",
  OLD_CONFERENCE_SCHEDULES: isLocal
    ? `${PROJECT_NAME_LOCAL}-conference-schedules`
    : `${PROJECT_NAME}-conference-schedules`,
  OLD_CONFERENCE_SETTINGS: isLocal
    ? `${PROJECT_NAME_LOCAL}-conference-settings`
    : `${PROJECT_NAME}-conference-settings`,
  OLD_PAGE_CONTENT: isLocal
    ? `${PROJECT_NAME_LOCAL}-page-content`
    : `${PROJECT_NAME}-page-content`,

  // history
  HISTORY: isLocal
    ? `${PROJECT_NAME_LOCAL}-history`
    : `${PROJECT_NAME}-history`,
  BACKUP: isLocal ? `${PROJECT_NAME_LOCAL}-backup` : `${PROJECT_NAME}-backup`,
};
