import type { PageContent } from "@/types";
import landingPageData from "./landingpagedata.json";

const ld = landingPageData as unknown as {
  hero?: { title?: string; actionButtons?: PageContent["hero"] extends { actionButtons?: infer A } ? A : never };
  accommodation?: PageContent["accommodation"];
  flights?: PageContent["flights"];
  travelRequirements?: PageContent["travelRequirements"];
  weather?: PageContent["weather"];
  whatToPack?: PageContent["whatToPack"];
  completeRegistration?: PageContent["completeRegistration"];
};

export const DEFAULT_PAGE_CONTENT: PageContent = {
  hero: {
    title: ld.hero?.title,
    actionButtons: ld.hero?.actionButtons,
  },
  countdown: {
    intro: "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa.",
  },
  accommodation: {
    ...ld.accommodation,
    reserveLink: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1708326594696&key=GRP&app=resvlink",
  },
  flights: ld.flights,
  travelRequirements: {
    ...ld.travelRequirements,
    visaExemptionsLinkUrl: "https://www.dha.gov.za/index.php/immigration-services/exempt-countries",
    visaApplicationLinkUrl: "https://drive.google.com/file/d/15AG8Ek03wFsoleTPdapkKxpqDhPG0U9l/view",
    evisaLinkUrl: "https://ehome.dha.gov.za/epermit/home",
  },
  weather: ld.weather,
  whatToPack: ld.whatToPack,
  completeRegistration: {
    ...ld.completeRegistration,
    buttonAlreadyInLink: "https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1",
    buttonFlyingLink: "https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC",
  },
  footer: {
    inquiryText: "Send inquiries to info@jamjargh.com",
    description: "4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community.",
    linkedinUrl: "https://www.linkedin.com/company/4dx-ventures/",
    websiteUrl: "https://www.4dxventures.com/",
  },
};

export function mergePageContent(cms?: PageContent | null): PageContent {
  if (!cms) return DEFAULT_PAGE_CONTENT;
  return {
    hero: { ...DEFAULT_PAGE_CONTENT.hero, ...cms.hero },
    countdown: { ...DEFAULT_PAGE_CONTENT.countdown, ...cms.countdown },
    accommodation: { ...DEFAULT_PAGE_CONTENT.accommodation, ...cms.accommodation },
    flights: { ...DEFAULT_PAGE_CONTENT.flights, ...cms.flights },
    travelRequirements: {
      ...DEFAULT_PAGE_CONTENT.travelRequirements,
      ...cms.travelRequirements,
      requirements: cms.travelRequirements?.requirements ?? DEFAULT_PAGE_CONTENT.travelRequirements?.requirements,
    },
    weather: { ...DEFAULT_PAGE_CONTENT.weather, ...cms.weather },
    whatToPack: { ...DEFAULT_PAGE_CONTENT.whatToPack, ...cms.whatToPack },
    completeRegistration: { ...DEFAULT_PAGE_CONTENT.completeRegistration, ...cms.completeRegistration },
    footer: { ...DEFAULT_PAGE_CONTENT.footer, ...cms.footer },
  };
}
