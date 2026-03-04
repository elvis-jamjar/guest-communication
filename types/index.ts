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
  visibilityConfig?: VisibilityConfig;
}

export interface Settings {
  columns?: number;
}

/** Controls which sections are visible on the landing page. Undefined/true = visible, false = hidden */
export interface VisibilityConfig {
  hero?: boolean;
  quickLinks?: boolean;
  countdown?: boolean;
  programme?: boolean;
  speakers?: boolean;
  accommodation?: boolean;
  flights?: boolean;
  travelRequirements?: boolean;
  weatherAndPack?: boolean;
  completeRegistration?: boolean;
  footer?: boolean;
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

/** CMS-editable landing page content (excludes program outline, speakers, quick links) */
export interface PageContent {
  hero?: {
    title?: string;
    actionButtons?: {
      title?: string;
      button1?: { text?: string; link?: string };
      button2?: { text?: string; link?: string };
    };
  };
  countdown?: {
    intro?: string;
  };
  accommodation?: {
    heading?: string;
    hotelTitle?: string;
    description1?: string;
    description2?: string;
    address?: string;
    reserveButton?: string;
    reserveLink?: string;
  };
  flights?: {
    heading?: string;
    intro?: string;
    airportTitle?: string;
    arriveDate?: string;
    departDate?: string;
  };
  travelRequirements?: {
    heading?: string;
    intro?: string;
    requirements?: string[];
    visaExemptionsTitle?: string;
    visaExemptionsText?: string;
    visaExemptionsLink?: string;
    visaExemptionsLinkUrl?: string;
    visaRequirementsTitle?: string;
    visaRequirementsIntro?: string;
    visaRequirementsText?: string;
    visaRequirementsDetail?: string;
    visaApplicationLink?: string;
    visaApplicationLinkUrl?: string;
    evisaLink?: string;
    evisaLinkUrl?: string;
  };
  weather?: {
    heading?: string;
    description1?: string;
    description2?: string;
  };
  whatToPack?: {
    heading?: string;
    description1?: string;
    description2?: string;
  };
  completeRegistration?: {
    heading?: string;
    buttonAlreadyIn?: string;
    buttonFlying?: string;
    buttonAlreadyInLink?: string;
    buttonFlyingLink?: string;
  };
  footer?: {
    inquiryText?: string;
    description?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };
}
