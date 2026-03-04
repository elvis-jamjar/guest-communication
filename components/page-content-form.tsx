"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContent } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ReusableAnimatedAccordion } from "./animated-accordion";

interface PageContentFormProps {
  pageContent?: PageContent;
  onChange: (pageContent: PageContent) => void;
}

const DEFAULT_LINKS = {
  accommodationReserve: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1708326594696&key=GRP&app=resvlink",
  visaExemptions: "https://www.dha.gov.za/index.php/immigration-services/exempt-countries",
  visaApplication: "https://drive.google.com/file/d/15AG8Ek03wFsoleTPdapkKxpqDhPG0U9l/view",
  evisa: "https://ehome.dha.gov.za/epermit/home",
  buttonAlreadyIn: "https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1",
  buttonFlying: "https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC",
  linkedin: "https://www.linkedin.com/company/4dx-ventures/",
  website: "https://www.4dxventures.com/",
};

export function PageContentForm({ pageContent = {}, onChange }: PageContentFormProps) {
  const pc = pageContent;

  const updateNested = <K extends keyof PageContent, S extends keyof NonNullable<PageContent[K]>>(
    section: K,
    subKey: S,
    value: NonNullable<PageContent[K]>[S]
  ) => {
    const sectionData = pageContent[section] ?? {};
    onChange({ ...pageContent, [section]: { ...sectionData, [subKey]: value } });
  };

  const updateHeroButton = (btn: "button1" | "button2", field: "text" | "link", value: string) => {
    const ab = pc.hero?.actionButtons ?? {};
    const current = ab[btn] ?? {};
    onChange({
      ...pageContent,
      hero: {
        ...pc.hero,
        actionButtons: {
          ...ab,
          [btn]: { ...current, [field]: value },
        },
      },
    });
  };

  const updateHeroActionTitle = (value: string) => {
    onChange({
      ...pageContent,
      hero: {
        ...pc.hero,
        actionButtons: {
          ...pc.hero?.actionButtons,
          title: value,
        },
      },
    });
  };

  const updateRequirements = (index: number, value: string) => {
    const reqs = [...(pc.travelRequirements?.requirements ?? [])];
    reqs[index] = value;
    updateNested("travelRequirements", "requirements", reqs);
  };

  const addRequirement = () => {
    const reqs = [...(pc.travelRequirements?.requirements ?? []), ""];
    updateNested("travelRequirements", "requirements", reqs);
  };

  const removeRequirement = (index: number) => {
    const reqs = pc.travelRequirements?.requirements?.filter((_, i) => i !== index) ?? [];
    updateNested("travelRequirements", "requirements", reqs);
  };

  return (
    <div className="space-y-8 p-4 border rounded-md">
      <ReusableAnimatedAccordion
        className="rounded-none"
        items={[
          {
            title: <h2 className="text-left">Hero</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={pc.hero?.title ?? ""}
                    onChange={(e) => updateNested("hero", "title", e.target.value)}
                    placeholder="Welcome message"
                  />
                </div>
                <div>
                  <Label>Button section title</Label>
                  <Input
                    value={pc.hero?.actionButtons?.title ?? ""}
                    onChange={(e) => updateHeroActionTitle(e.target.value)}
                    placeholder="Click below to complete your registration"
                  />
                </div>
                <div>
                  <Label>Button 1 text</Label>
                  <Input
                    value={pc.hero?.actionButtons?.button1?.text ?? ""}
                    onChange={(e) => updateHeroButton("button1", "text", e.target.value)}
                    placeholder="Already in Johannesburg"
                  />
                </div>
                <div>
                  <Label>Button 1 link</Label>
                  <Input
                    value={pc.hero?.actionButtons?.button1?.link ?? DEFAULT_LINKS.buttonAlreadyIn}
                    onChange={(e) => updateHeroButton("button1", "link", e.target.value)}
                    placeholder="URL"
                  />
                </div>
                <div>
                  <Label>Button 2 text</Label>
                  <Input
                    value={pc.hero?.actionButtons?.button2?.text ?? ""}
                    onChange={(e) => updateHeroButton("button2", "text", e.target.value)}
                    placeholder="Flying to Johannesburg"
                  />
                </div>
                <div>
                  <Label>Button 2 link</Label>
                  <Input
                    value={pc.hero?.actionButtons?.button2?.link ?? DEFAULT_LINKS.buttonFlying}
                    onChange={(e) => updateHeroButton("button2", "link", e.target.value)}
                    placeholder="URL"
                  />
                </div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Countdown</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div>
                <Label>Intro text</Label>
                <Textarea
                  value={pc.countdown?.intro ?? ""}
                  onChange={(e) => updateNested("countdown", "intro", e.target.value)}
                  placeholder="Join us for insightful discussions..."
                  rows={3}
                />
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Accommodation</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Heading</Label><Input value={pc.accommodation?.heading ?? ""} onChange={(e) => updateNested("accommodation", "heading", e.target.value)} /></div>
                <div><Label>Hotel title</Label><Input value={pc.accommodation?.hotelTitle ?? ""} onChange={(e) => updateNested("accommodation", "hotelTitle", e.target.value)} /></div>
                <div><Label>Description 1</Label><Textarea value={pc.accommodation?.description1 ?? ""} onChange={(e) => updateNested("accommodation", "description1", e.target.value)} rows={2} /></div>
                <div><Label>Description 2</Label><Textarea value={pc.accommodation?.description2 ?? ""} onChange={(e) => updateNested("accommodation", "description2", e.target.value)} rows={2} /></div>
                <div><Label>Address</Label><Input value={pc.accommodation?.address ?? ""} onChange={(e) => updateNested("accommodation", "address", e.target.value)} /></div>
                <div><Label>Reserve button text</Label><Input value={pc.accommodation?.reserveButton ?? ""} onChange={(e) => updateNested("accommodation", "reserveButton", e.target.value)} /></div>
                <div><Label>Reserve button link</Label><Input value={pc.accommodation?.reserveLink ?? DEFAULT_LINKS.accommodationReserve} onChange={(e) => updateNested("accommodation", "reserveLink", e.target.value)} /></div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Flights</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Heading</Label><Input value={pc.flights?.heading ?? ""} onChange={(e) => updateNested("flights", "heading", e.target.value)} /></div>
                <div><Label>Intro</Label><Textarea value={pc.flights?.intro ?? ""} onChange={(e) => updateNested("flights", "intro", e.target.value)} rows={3} /></div>
                <div><Label>Airport title</Label><Input value={pc.flights?.airportTitle ?? ""} onChange={(e) => updateNested("flights", "airportTitle", e.target.value)} /></div>
                <div><Label>Arrive date</Label><Input value={pc.flights?.arriveDate ?? ""} onChange={(e) => updateNested("flights", "arriveDate", e.target.value)} /></div>
                <div><Label>Depart date</Label><Input value={pc.flights?.departDate ?? ""} onChange={(e) => updateNested("flights", "departDate", e.target.value)} /></div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Travel Requirements</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Heading</Label><Input value={pc.travelRequirements?.heading ?? ""} onChange={(e) => updateNested("travelRequirements", "heading", e.target.value)} /></div>
                <div><Label>Intro</Label><Input value={pc.travelRequirements?.intro ?? ""} onChange={(e) => updateNested("travelRequirements", "intro", e.target.value)} /></div>
                <div>
                  <Label>Requirements list</Label>
                  {(pc.travelRequirements?.requirements ?? []).map((req, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <Input value={req} onChange={(e) => updateRequirements(i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeRequirement(i)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="mt-2" onClick={addRequirement}><Plus className="h-4 w-4 mr-1" />Add</Button>
                </div>
                <div><Label>Visa exemptions title</Label><Input value={pc.travelRequirements?.visaExemptionsTitle ?? ""} onChange={(e) => updateNested("travelRequirements", "visaExemptionsTitle", e.target.value)} /></div>
                <div><Label>Visa exemptions text</Label><Textarea value={pc.travelRequirements?.visaExemptionsText ?? ""} onChange={(e) => updateNested("travelRequirements", "visaExemptionsText", e.target.value)} rows={2} /></div>
                <div><Label>Visa exemptions link text</Label><Input value={pc.travelRequirements?.visaExemptionsLink ?? ""} onChange={(e) => updateNested("travelRequirements", "visaExemptionsLink", e.target.value)} /></div>
                <div><Label>Visa exemptions link URL</Label><Input value={pc.travelRequirements?.visaExemptionsLinkUrl ?? DEFAULT_LINKS.visaExemptions} onChange={(e) => updateNested("travelRequirements", "visaExemptionsLinkUrl", e.target.value)} /></div>
                <div><Label>Visa requirements title</Label><Input value={pc.travelRequirements?.visaRequirementsTitle ?? ""} onChange={(e) => updateNested("travelRequirements", "visaRequirementsTitle", e.target.value)} /></div>
                <div><Label>Visa requirements intro</Label><Input value={pc.travelRequirements?.visaRequirementsIntro ?? ""} onChange={(e) => updateNested("travelRequirements", "visaRequirementsIntro", e.target.value)} /></div>
                <div><Label>Visa requirements text</Label><Textarea value={pc.travelRequirements?.visaRequirementsText ?? ""} onChange={(e) => updateNested("travelRequirements", "visaRequirementsText", e.target.value)} rows={2} /></div>
                <div><Label>Visa requirements detail</Label><Textarea value={pc.travelRequirements?.visaRequirementsDetail ?? ""} onChange={(e) => updateNested("travelRequirements", "visaRequirementsDetail", e.target.value)} rows={2} /></div>
                <div><Label>Visa application link text</Label><Input value={pc.travelRequirements?.visaApplicationLink ?? ""} onChange={(e) => updateNested("travelRequirements", "visaApplicationLink", e.target.value)} /></div>
                <div><Label>Visa application link URL</Label><Input value={pc.travelRequirements?.visaApplicationLinkUrl ?? DEFAULT_LINKS.visaApplication} onChange={(e) => updateNested("travelRequirements", "visaApplicationLinkUrl", e.target.value)} /></div>
                <div><Label>E-visa link text</Label><Input value={pc.travelRequirements?.evisaLink ?? ""} onChange={(e) => updateNested("travelRequirements", "evisaLink", e.target.value)} /></div>
                <div><Label>E-visa link URL</Label><Input value={pc.travelRequirements?.evisaLinkUrl ?? DEFAULT_LINKS.evisa} onChange={(e) => updateNested("travelRequirements", "evisaLinkUrl", e.target.value)} /></div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Weather & What to Pack</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Weather heading</Label><Input value={pc.weather?.heading ?? ""} onChange={(e) => updateNested("weather", "heading", e.target.value)} /></div>
                <div><Label>Weather description 1</Label><Textarea value={pc.weather?.description1 ?? ""} onChange={(e) => updateNested("weather", "description1", e.target.value)} rows={2} /></div>
                <div><Label>Weather description 2</Label><Textarea value={pc.weather?.description2 ?? ""} onChange={(e) => updateNested("weather", "description2", e.target.value)} rows={2} /></div>
                <div><Label>What to pack heading</Label><Input value={pc.whatToPack?.heading ?? ""} onChange={(e) => updateNested("whatToPack", "heading", e.target.value)} /></div>
                <div><Label>What to pack description 1</Label><Textarea value={pc.whatToPack?.description1 ?? ""} onChange={(e) => updateNested("whatToPack", "description1", e.target.value)} rows={2} /></div>
                <div><Label>What to pack description 2</Label><Textarea value={pc.whatToPack?.description2 ?? ""} onChange={(e) => updateNested("whatToPack", "description2", e.target.value)} rows={2} /></div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Complete Registration</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Heading</Label><Input value={pc.completeRegistration?.heading ?? ""} onChange={(e) => updateNested("completeRegistration", "heading", e.target.value)} /></div>
                <div><Label>Button Already In text</Label><Input value={pc.completeRegistration?.buttonAlreadyIn ?? ""} onChange={(e) => updateNested("completeRegistration", "buttonAlreadyIn", e.target.value)} /></div>
                <div><Label>Button Already In link</Label><Input value={pc.completeRegistration?.buttonAlreadyInLink ?? DEFAULT_LINKS.buttonAlreadyIn} onChange={(e) => updateNested("completeRegistration", "buttonAlreadyInLink", e.target.value)} /></div>
                <div><Label>Button Flying text</Label><Input value={pc.completeRegistration?.buttonFlying ?? ""} onChange={(e) => updateNested("completeRegistration", "buttonFlying", e.target.value)} /></div>
                <div><Label>Button Flying link</Label><Input value={pc.completeRegistration?.buttonFlyingLink ?? DEFAULT_LINKS.buttonFlying} onChange={(e) => updateNested("completeRegistration", "buttonFlyingLink", e.target.value)} /></div>
              </div>
            ),
          },
          {
            title: <h2 className="text-left">Footer</h2>,
            className: "p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between",
            iconClassName: "size-5",
            children: (
              <div className="space-y-4">
                <div><Label>Inquiry text</Label><Input value={pc.footer?.inquiryText ?? ""} onChange={(e) => updateNested("footer", "inquiryText", e.target.value)} /></div>
                <div><Label>Description</Label><Textarea value={pc.footer?.description ?? ""} onChange={(e) => updateNested("footer", "description", e.target.value)} rows={3} /></div>
                <div><Label>LinkedIn URL</Label><Input value={pc.footer?.linkedinUrl ?? DEFAULT_LINKS.linkedin} onChange={(e) => updateNested("footer", "linkedinUrl", e.target.value)} /></div>
                <div><Label>Website URL</Label><Input value={pc.footer?.websiteUrl ?? DEFAULT_LINKS.website} onChange={(e) => updateNested("footer", "websiteUrl", e.target.value)} /></div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
