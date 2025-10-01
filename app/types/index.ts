import { JSONContent } from "@tiptap/react";

export interface Speaker {
  name: string;
  title?: string;
  bio: string;
  image?: string;
}

export interface TimelineItemProps {
  id?: string;
  time?: string;
  title?: string;
  sectionTitle?: string;
  description?: string;
  icon?: string;
  isTrack?: boolean;
  trackLabel?: string;
  banners?: Array<string>;
  bannerPosition?: "top" | "bottom";
  iconColor?: "bg-primary-purple" | "bg-primary-main";
  children?: React.ReactNode;
  hideLine?: boolean;
  className?: string;
  subItems?: TimelineItemProps[];
  isFirst?: boolean;
  sponsors?: Array<string>;
  speakers?: Array<Speaker>;
  host?: Speaker;
  facilitators?: Array<Speaker>;
  moderators?: Array<Speaker>;
  hideSpeakersImage?: boolean;
  hideSpeakersTitle?: boolean;
  hideModeratorsTitle?: boolean;
  hideHostTitle?: boolean;
  hideFacilitatorsTitle?: boolean;
  hideModeratorsImage?: boolean;
  hideFacilitatorsImage?: boolean;
  hideHostsImage?: boolean;
  removedData?: {
    sponsors?: Array<string>;
    speakers?: Array<Speaker>;
    host?: Speaker;
    facilitators?: Array<Speaker>;
    moderators?: Array<Speaker>;
  };
}

export interface ConferenceScheduleProps {
  className?: string;
  day: string;
  title: string;
  timeLineItems: TimelineItemProps[];
}

export interface Settings {
  columns?: number;
}

export interface QuickLinks {
  title?: string;
  link?: string;
  description?: string;
  buttonLabel?: string;
}

export interface PageContent {
  aboutSection?: JSONContent | string;
  quickLinksTitle?: string;
  quickLinks?: QuickLinks[];
}

export interface LargeBanner {
  image: string;
}

export interface DataType {
  schedules: ConferenceScheduleProps[];
  pageContent: PageContent;
  settings: Settings;
  allSponsorsBanner: LargeBanner;
  allPartnersBanner: LargeBanner;
  name?: string;
}

export interface NotificationLink {
  label: string;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  links?: NotificationLink[];
  timestamp: string;
  expiresAt?: string; // ISO string for expiration time
  priority?: "low" | "medium" | "high";
  isPreview?: boolean;
  status?: "draft" | "active" | "expired" | "archived" | "scheduled";
  targetAudience?: "all" | "preview" | "public";
  createdBy?: string;
  isShowing?: boolean;
  impressions?: number;
  uniqueRecipients?: number;
  recipientIPs?: string[];
  publishedAt?: string;
  archivedAt?: string;
  totalImpressions?: number;
  scheduledFor?: string; // ISO string for scheduled publish time
  isScheduled?: boolean;
}
