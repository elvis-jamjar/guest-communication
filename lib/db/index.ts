import { Redis } from "ioredis";
export const redis = new Redis(process.env.NEXT_REDIS_URL as string);

// export constants of database keys
const PROJECT_NAME = "2025-ACGC";
export const DATABASE_KEYS = {
  //   TIMELINE_ITEMS: `${PROJECT_NAME}-timeline-items`,
  CONFERENCE_SCHEDULES: `${PROJECT_NAME}-conference-schedules`,
  CONFERENCE_SETTINGS: `${PROJECT_NAME}-conference-settings`,
  PAGE_CONTENT: `${PROJECT_NAME}-page-content`,
  //   OLD_TIMELINE_ITEMS: "timeline-items",
  OLD_CONFERENCE_SCHEDULES: "conference-schedules",
  OLD_CONFERENCE_SETTINGS: "conference-settings",
  OLD_PAGE_CONTENT: "page-content",

  // history
  HISTORY: `${PROJECT_NAME}-history`,
};
