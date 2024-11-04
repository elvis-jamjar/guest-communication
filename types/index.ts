export interface Speaker {
  name: string;
  title?: string;
  bio: string;
  photo?: string;
  visibleOnPage?: boolean;
}

export type ColorType =
  | "text-secondary-main"
  | "text-primary-main"
  | "text-black";
export type BgColorType = "bg-secondary-main" | "bg-primary-main";
export type FontWeight =
  | "font-mono"
  | "font-thin"
  | "font-normal"
  | "font-medium"
  | "font-bold";

export interface ItemStyle {
  color?: ColorType;
  fontWeights?: FontWeight;
}
interface SectionBreakOuts {
  title?: string;
  description?: string;
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
  sectionBreakOuts?: Array<SectionBreakOuts>;
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
  fontWeights?: {
    sectionTitle?: FontWeight;
    description?: FontWeight;
    title?: FontWeight;
    time?: FontWeight;
  };
  bulleted?: {
    sectionTitle?: boolean;
    description?: boolean;
    title?: boolean;
    time?: boolean;
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

export interface ConferenceScheduleData {
  schedule: ConferenceScheduleProps[];
  quickLinkData?: QuickLinkData;
  settings?: Settings;
  pageContent?: PageContent;
  isEventStarted?: boolean;
}

export interface Settings {
  columns?: number;
}

export interface QuickLinkData {
  title?: string;
  links?: QuickLinks[];
  style?: {
    title?: ItemStyle;
    description?: ItemStyle;
    buttonLabel?: ItemStyle;
  };
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
