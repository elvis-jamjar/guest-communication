"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import { FormattedText } from "@/components/formatted-text";
import { HeadingText } from "@/components/heading-text";
import { HeroCard } from "@/components/hero-card";
import { QuickLinks } from "@/components/quick-links-section";
import { ScheduleList } from "@/components/schedule-list";
import AllSpeakerList from "@/components/speaker-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ConferenceScheduleData, PageContent, VisibilityConfig } from "@/types";
import { mergePageContent } from "@/utils/default-page-content";
import { Link } from "lucide-react";
import Image from "next/image";

function showSection(vc: VisibilityConfig | undefined, key: keyof VisibilityConfig) {
  return vc?.[key] !== false;
}

function hasContent(
  key: keyof VisibilityConfig,
  content: PageContent,
  data?: ConferenceScheduleData | null
): boolean {
  const str = (s: string | undefined) => (s ?? "").trim().length > 0;
  switch (key) {
    case "countdown":
      return str(content.countdown?.intro) || str(content.countdown?.targetDate);
    case "accommodation":
      return (
        str(content.accommodation?.heading) ||
        str(content.accommodation?.hotelTitle) ||
        str(content.accommodation?.description1) ||
        str(content.accommodation?.description2) ||
        str(content.accommodation?.address)
      );
    case "flights":
      return (
        str(content.flights?.heading) ||
        str(content.flights?.intro) ||
        str(content.flights?.airportTitle) ||
        str(content.flights?.arriveDate) ||
        str(content.flights?.departDate)
      );
    case "postFlights":
      return str(content.postFlights?.heading) || str(content.postFlights?.content);
    case "travelRequirements":
      return (
        str(content.travelRequirements?.heading) ||
        str(content.travelRequirements?.intro) ||
        (content.travelRequirements?.requirements?.length ?? 0) > 0 ||
        str(content.travelRequirements?.visaExemptionsTitle) ||
        str(content.travelRequirements?.visaExemptionsText) ||
        str(content.travelRequirements?.visaRequirementsTitle) ||
        str(content.travelRequirements?.visaRequirementsIntro) ||
        str(content.travelRequirements?.visaRequirementsText) ||
        str(content.travelRequirements?.visaRequirementsDetail)
      );
    case "weatherAndPack":
      return (
        str(content.weather?.heading) ||
        str(content.weather?.description1) ||
        str(content.weather?.description2) ||
        str(content.whatToPack?.heading) ||
        str(content.whatToPack?.description1) ||
        str(content.whatToPack?.description2)
      );
    case "completeRegistration":
      return (
        str(content.completeRegistration?.heading) ||
        str(content.completeRegistration?.buttonAlreadyIn) ||
        str(content.completeRegistration?.buttonFlying)
      );
    case "quickLinks":
      const links = data?.quickLinkData?.links?.filter(
        (l) => str(l?.title) || str(l?.description) || str(l?.link)
      );
      return (links?.length ?? 0) > 0;
    case "programme":
      return (data?.schedule?.length ?? 0) > 0;
    case "speakers": {
      const hasSpeakers = data?.schedule?.some((s) =>
        s?.timeLineItems?.some(
          (t) =>
            (t?.speakers?.length ?? 0) > 0 ||
            t?.host ||
            (t?.facilitators?.length ?? 0) > 0 ||
            (t?.moderators?.length ?? 0) > 0
        )
      );
      return !!hasSpeakers;
    }
    case "footer":
      return str(content.footer?.inquiryText) || str(content.footer?.description);
    case "hero":
      return true;
    default:
      return true;
  }
}

interface LandingPageContentProps {
  data?: ConferenceScheduleData | null;
  visibilityConfig?: VisibilityConfig;
  isLoading?: boolean;
  /** When true, uses isAdmin mode for speakers (no loading state) */
  isPreview?: boolean;
}

export function LandingPageContent({
  data,
  visibilityConfig,
  isLoading = false,
  isPreview = false,
}: LandingPageContentProps) {
  const vc = visibilityConfig;
  const content = mergePageContent(data?.pageContent);

  return (
    <>
      {showSection(vc, "hero") && isPreview && (
        <section
          id="hero-section"
          className="text-white bg-center md:p-0 p-2 bg-cover bg-repeat w-full min-h-[400px] py-12 flex items-center justify-center relative"
          // style={{
          //   backgroundImage: "url('/images/4dx/background.png')",
          //   backgroundSize: "97%",
          // }}
          style={{
            backgroundImage: "url('/images/4dx/26/1920x1080_final_01.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <HeroCard previewData={data} />
        </section>
      )}
      {showSection(vc, "quickLinks") && (hasContent("quickLinks", content, data) || (isLoading && !data)) && (
        <section className={cn("container flex flex-col gap-14 mx-auto py-4 mt-16", !data?.isEventStarted && "hidden")}>
          <div className="mx-auto w-full">
            <QuickLinks data={data?.quickLinkData} isLoading={isLoading} />
          </div>
        </section>
      )}
      {showSection(vc, "countdown") && hasContent("countdown", content, data) && data?.isEventStarted === false && (
        <section className={cn("container flex flex-col gap-14 mx-auto py-8 mt-14")}>
          <p style={{ fontSize: "clamp(1rem,1.7vw,2rem)" }} className="text-center whitespace-pre-wrap">
            <FormattedText text={content.countdown?.intro ?? "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa."} />
          </p>
          <CountdownTimer targetDate={content.countdown?.targetDate} />
        </section>
      )}
      {showSection(vc, "programme") && (hasContent("programme", content, data) || (isLoading && !data)) && (
        <section
          style={{
            background: "url('/images/4dx/26/2915x915-03.jpeg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right bottom",
          }}
          id="programme"
          className={cn("bg-right-bottom bg-contain py-10 md:mt-8")}
        >
          <div className="container mx-auto">
            <HeadingText text="Program Outline" icon="/images/4dx/program_icon.png" />
            {isLoading && !data && (
              <Card className="w-full rounded-3xl border-2 border-primary-main">
                <CardHeader className="bg-primary-main rounded-t-2xl">
                  <Skeleton className="h-6 w-48 mx-auto bg-white/50" />
                </CardHeader>
                <CardContent className="p-0 ">
                  {[1, 2, 3, 4].map((day) => (
                    <div key={day} className="border-b-2 h-16 py-8 flex items-center border-b-primary-main rounded-b-2xl last:border-b-0">
                      <div className="flex justify-between w-full items-center py-2 px-4 md:px-16">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-16 bg-primary-main/40" />
                          <Skeleton className="h-4 w-40 bg-secondary-main/40" />
                        </div>
                        <Skeleton className="h-4 w-4 rounded-full bg-secondary-main/40" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {data && <ScheduleList schedules={data?.schedule || []} title={data?.eventDate ?? "4th - 7th May"} />}
          </div>
        </section>
      )}
      {showSection(vc, "speakers") && (hasContent("speakers", content, data) || (isLoading && !data)) && (
        <section className="bg-right container bg-contain py-10 md:mt-5">
          <div className="mx-auto">
            <AllSpeakerList schedules={data?.schedule || []} isLoading={isPreview ? false : isLoading} />
          </div>
        </section>
      )}
      {showSection(vc, "accommodation") && hasContent("accommodation", content, data) && (
        <section
          style={{
            background: "url('/images/4dx/26/2915x915-02.jpeg') no-repeat left bottom",
            backgroundSize: "auto 100%",
            backgroundPosition: "calc(0vw) bottom",
          }}
          className="py-8 space-y-10 w-full"
        >
          <div className="container mx-auto">
            <HeadingText text={content.accommodation?.heading ?? "Accommodation"} icon="/images/4dx/accomodation_icon.png" className="md:size-16" />
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-1 flex-col gap-1 text-pretty leading-relaxed tracking-normal">
                <h1 className="text-primary-main text-left font-extrabold text-xl md:text-3xl mb-8"><FormattedText text={content.accommodation?.hotelTitle ?? ""} /></h1>
                <div className="flex w-full flex-col space-y-6 ">
                  <p className="whitespace-pre-wrap"><FormattedText text={content.accommodation?.description1 ?? ""} /></p>
                  <p className="whitespace-pre-wrap"><FormattedText text={content.accommodation?.description2 ?? ""} /></p>
                </div>
                <div className="flex space-x-1 items-center md:items-baseline leading-relaxed tracking-normal py-5 ">
                  <Image src="/images/4dx/location.png" priority width={100} height={100} alt="loc" className="md:size-6 size-4 object-contain" />
                  <p><FormattedText text={content.accommodation?.address ?? ""} /></p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end md:items-end items-center">
                <Image src="https://pyramidsparkresort.com/wp-content/uploads/2025/12/Pyramids-park-LOGO-PNG.png" quality={100} width={900} height={900} priority alt="Pyramid Hotel" className="md:size-64 size-40 object-contain" />
              </div>
              <div className="w-fit pt-8 md:col-span-2 md:min-w-[300px] mx-auto md:mx-0">
                <a target="_blank" rel="noreferrer" href={content.accommodation?.reserveLink ?? "#"} className="w-full">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    className="p-8 font-black w-full leading-tight bg-secondary-main text-white hover:bg-secondary-main hover:text-white border-secondary-main rounded-full"
                  >
                    <FormattedText text={content.accommodation?.reserveButton ?? "Reserve your Room Here"} />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "flights") && hasContent("flights", content, data) && (
        <section className="mx-auto py-8 mt-8">
          <div className="text-lg space-y-10 container ">
            <HeadingText text={content.flights?.heading ?? "Flights"} icon="/images/4dx/flight_icon.png" />
            <p className="leading-relaxed tracking-normal whitespace-pre-wrap"><FormattedText text={content.flights?.intro ?? ""} /></p>
            <div className=" ring-primary-main flex-col space-y-8 ring-1 p-10 rounded-3xl">
              <h1 className="text-primary-main text-xl md:text-3xl text-center items-center justify-center font-extrabold ">
                <FormattedText text={content.flights?.airportTitle ?? ""} />
              </h1>
              <div className="flex gap-8 items-center text-center flex-wrap flex-col md:flex-row px-4 justify-center">
                <Image src="/images/4dx/icon_landing.png" width={100} height={100} alt="landing" className="w-8 h-8 object-contain" />
                <span><FormattedText text={content.flights?.arriveDate ?? ""} /></span>
                <Separator orientation="horizontal" className="w-16" />
                <Image src="/images/4dx/icon_departure.png" width={100} height={100} alt="departure" className="w-8 h-8 object-contain" />
                <span><FormattedText text={content.flights?.departDate ?? ""} /></span>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "postFlights") && hasContent("postFlights", content, data) && (
        <section className="mx-auto py-8 mt-8">
          <div className="text-lg space-y-6 container">
            <HeadingText text={content.postFlights?.heading ?? ""} icon={undefined} />
            <p className="leading-relaxed tracking-normal whitespace-pre-wrap"><FormattedText text={content.postFlights?.content ?? ""} /></p>
          </div>
        </section>
      )}
      {showSection(vc, "travelRequirements") && hasContent("travelRequirements", content, data) && (
        <section
          style={{
            backgroundImage: "url('/images/4dx/26/2915x915-01.jpeg'), url('/images/4dx/26/950x1072-03.jpeg')",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundSize: "auto 65%, auto 50%",
            backgroundPosition: "right center, center",
            backgroundAttachment: "local, local",
          }}
          className="py-8 mt-8"
        >
          <div className="container mx-auto space-y-8 leading-relaxed tracking-normal">
            <HeadingText text={content.travelRequirements?.heading ?? "Travel Requirements"} icon="/images/4dx/visa_icon.png" />
            <p className="font-extrabold font-[Roboto-Bold]"><FormattedText text={content.travelRequirements?.intro ?? ""} /></p>
            <ol className="list-decimal list-outside space-y-2 pl-5">
              {(content.travelRequirements?.requirements ?? []).map((item, i) => (
                <li key={i} className="pl-1"><FormattedText text={item} /></li>
              ))}
            </ol>
            <p className="font-extrabold text-secondary-main text-xl md:text-2xl">{content.travelRequirements?.visaExemptionsTitle ?? ""}</p>
            <p className="whitespace-pre-wrap"><FormattedText text={content.travelRequirements?.visaExemptionsText ?? ""} /></p>
            {(content.travelRequirements?.visaExemptionsLink || content.travelRequirements?.visaExemptionsLinkUrl) && (
              <a target="_blank" rel="noreferrer" href={content.travelRequirements?.visaExemptionsLinkUrl && content.travelRequirements.visaExemptionsLinkUrl !== "#" ? content.travelRequirements.visaExemptionsLinkUrl : "#"} className="text-primary-main underline flex gap-2 items-center">
                {content.travelRequirements?.visaExemptionsLinkUrl && content.travelRequirements.visaExemptionsLinkUrl !== "#" && <Link size={26} />}
                <span><FormattedText text={content.travelRequirements?.visaExemptionsLink ?? ""} /></span>
              </a>
            )}
            <p className="font-extrabold text-secondary-main text-xl md:text-2xl">{content.travelRequirements?.visaRequirementsTitle ?? ""}</p>
            <p className="text-secondary-main font-extrabold"><FormattedText text={content.travelRequirements?.visaRequirementsIntro ?? ""} /></p>
            <p className="whitespace-pre-wrap"><FormattedText text={content.travelRequirements?.visaRequirementsText ?? ""} /></p>
            <p className="whitespace-pre-wrap"><FormattedText text={content.travelRequirements?.visaRequirementsDetail ?? ""} /></p>
            {(content.travelRequirements?.visaApplicationLink || content.travelRequirements?.visaApplicationLinkUrl) && (
              <a target="_blank" rel="noreferrer" href={content.travelRequirements?.visaApplicationLinkUrl && content.travelRequirements.visaApplicationLinkUrl !== "#" ? content.travelRequirements.visaApplicationLinkUrl : "#"} className="text-primary-main underline flex gap-2 items-center">
                {content.travelRequirements?.visaApplicationLinkUrl && content.travelRequirements.visaApplicationLinkUrl !== "#" && <Link size={26} />}
                <span><FormattedText text={content.travelRequirements?.visaApplicationLink ?? ""} /></span>
              </a>
            )}
            {(content.travelRequirements?.evisaLink || content.travelRequirements?.evisaLinkUrl) && (
              <a target="_blank" rel="noreferrer" href={content.travelRequirements?.evisaLinkUrl && content.travelRequirements.evisaLinkUrl !== "#" ? content.travelRequirements.evisaLinkUrl : "#"} className="text-primary-main underline flex gap-2 items-center">
                {content.travelRequirements?.evisaLinkUrl && content.travelRequirements.evisaLinkUrl !== "#" && <Link size={26} />}
                <span><FormattedText text={content.travelRequirements?.evisaLink ?? ""} /></span>
              </a>
            )}
          </div>
        </section>
      )}
      {showSection(vc, "weatherAndPack") && hasContent("weatherAndPack", content, data) && (
        <section className=" py-10 space-y-14">
          <div className="container mx-auto space-y-6 text-lg py-5">
            <HeadingText text={content.weather?.heading ?? "Weather"} icon="/images/4dx/weather_icon.png" />
            <p className="whitespace-pre-wrap"><FormattedText text={content.weather?.description1 ?? ""} /></p>
            <p className="whitespace-pre-wrap"><FormattedText text={content.weather?.description2 ?? ""} /></p>
          </div>
          <div className="container mx-auto text-lg space-y-6">
            <HeadingText text={content.whatToPack?.heading ?? "What to Pack"} icon="/images/4dx/pack_icon.png" />
            <p className="whitespace-pre-wrap"><FormattedText text={content.whatToPack?.description1 ?? ""} /></p>
            <p className="whitespace-pre-wrap"><FormattedText text={content.whatToPack?.description2 ?? ""} /></p>
          </div>
        </section>
      )}
      <Separator orientation="horizontal" className="w-full mt-20 bg-secondary-main" />
      {showSection(vc, "completeRegistration") && hasContent("completeRegistration", content, data) && (
        <section className={cn("py-12", data?.isEventStarted && "hidden")}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 items-center w-full flex-wrap">
              <p className="font-extrabold text-xl text-center text-secondary-main"><FormattedText text={content.completeRegistration?.heading ?? "Complete your registration"} /></p>
              <div className="flex flex-wrap md:flex-nowrap justify-start items-center flex-1 md:space-x-16 gap-4 h-fit">
                <a target="_blank" rel="noreferrer" href={content.completeRegistration?.buttonAlreadyInLink ?? "#"} className="w-full md:w-fit">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    variant="outline"
                    className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                  >
                    <FormattedText text={content.completeRegistration?.buttonAlreadyIn ?? "Already in Johannesburg"} />
                  </Button>
                </a>
                <a target="_blank" rel="noreferrer" href={content.completeRegistration?.buttonFlyingLink ?? "#"} className="w-full md:w-fit">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    variant="outline"
                    className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                  >
                    <FormattedText text={content.completeRegistration?.buttonFlying ?? "Flying to Johannesburg"} />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "footer") && hasContent("footer", content, data) && isPreview && (
        <footer className="text-white bg-primary-main mt-8">
          <div className="bg-secondary-main mx-auto py-6 px-2">
            <p className="text-white text-2xl text-center text-pretty tracking-wide font-extrabold"><FormattedText text={content.footer?.inquiryText ?? "Send inquiries to info@jamjargh.com"} /></p>
          </div>
          <div className="py-20 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
            <div className="flex flex-wrap gap-5 justify-center items-center">
              <div className="flex items-center rounded-full p-5 bg-white">
                <Image src="/images/4dx/new/4dx_logo.png" width={600} height={600} priority alt="4dx" className="size-28 object-contain" />
              </div>
              <p className="text-left text-sm leading-relaxed max-w-xs whitespace-pre-wrap">
                <FormattedText text={content.footer?.description ?? "4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community."} />
              </p>
            </div>
            <div className="flex gap-6 flex-col items-center justify-center">
              <div className="flex gap-4">
                <a href={content.footer?.linkedinUrl ?? "#"} target="_blank" rel="noreferrer">
                  <Image src="/images/4dx/linkedin.png" width={200} height={200} alt="linkedin" className="w-12 h-12 object-contain" />
                </a>
                <a href={content.footer?.websiteUrl ?? "#"} target="_blank" rel="noreferrer">
                  <Image src="/images/4dx/globe.png" width={200} height={200} alt="website" className="w-12 h-12 object-contain" />
                </a>
              </div>
              <p className="w-fit text-lg font-medium" suppressHydrationWarning>&copy; {new Date().getFullYear()} 4DX Ventures</p>
            </div>
          </div>
          <Image src="/images/4dx/background.png" width={1000} height={400} alt="4dx" className="w-full h-12 object-cover bg-white" />
        </footer>
      )}
    </>
  );
}
