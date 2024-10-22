export interface Speaker {
  name: string;
  title?: string;
  bio: string;
}

export type ColorType = "text-secondary-main" | "text-primary-main";
export type BgColorType = "bg-secondary-main" | "bg-primary-main";

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
  iconColor?: BgColorType;
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
  color?: {
    sectionTitle?: ColorType;
    description?: ColorType;
    title?: ColorType;
    time?: ColorType;
    day?: ColorType;
    dayTitle?: ColorType;
  };
}

export interface ConferenceScheduleProps {
  className?: string;
  day: string;
  title: string;
  color?: {
    day?: ColorType;
    dayTitle?: ColorType;
  };
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
  aboutSection?: string;
  quickLinksTitle?: string;
  quickLinks?: QuickLinks[];
}
