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
