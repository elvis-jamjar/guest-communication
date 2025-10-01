import { Redis } from "ioredis";

// Create separate Redis connections for different purposes
const redisUrl = process.env.NEXT_REDIS_URL;

if (!redisUrl) {
  console.error("NEXT_REDIS_URL environment variable is not set!");
  throw new Error("Redis URL is required");
}

console.log(
  "Connecting to Redis:",
  redisUrl.replace(/\/\/.*@/, "//***@") + " (password hidden)"
);

export const redis = new Redis(redisUrl, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

export const redisClient = redis; // Alias for general Redis operations
export const redisPublisher = new Redis(redisUrl, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});
export const redisSubscriber = new Redis(redisUrl, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Add connection event listeners for debugging
redis.on("connect", () => {
  console.log("Redis client connected");
});

redis.on("error", (err) => {
  console.error("Redis client error:", err);
});

redis.on("close", () => {
  console.log("Redis client connection closed");
});

redisPublisher.on("connect", () => {
  console.log("Redis publisher connected");
});

redisPublisher.on("error", (err) => {
  console.error("Redis publisher error:", err);
});

redisSubscriber.on("connect", () => {
  console.log("Redis subscriber connected");
});

redisSubscriber.on("error", (err) => {
  console.error("Redis subscriber error:", err);
});

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
  NOTIFICATIONS: isLocal
    ? `${PROJECT_NAME_LOCAL}-notifications`
    : `admin_notifications`,

  // history
  HISTORY: isLocal
    ? `${PROJECT_NAME_LOCAL}-history`
    : `${PROJECT_NAME}-history`,
  BACKUP: isLocal ? `${PROJECT_NAME_LOCAL}-backup` : `${PROJECT_NAME}-backup`,
};
