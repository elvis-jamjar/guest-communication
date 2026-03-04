"use client";

import { ArrowDownButton } from "@/components/arrowdown";
import { CountdownTimer } from "@/components/countdown-timer";
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
import { ConferenceScheduleData, VisibilityConfig } from "@/types";
import { mergePageContent } from "@/utils/default-page-content";
import { Link } from "lucide-react";
import Image from "next/image";

function showSection(vc: VisibilityConfig | undefined, key: keyof VisibilityConfig) {
  return vc?.[key] !== false;
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
          style={{
            backgroundImage: "url('/images/4dx/background.png')",
            backgroundSize: "97%",
          }}
        >
          <HeroCard previewData={data} />
        </section>
      )}
      {showSection(vc, "quickLinks") && (
        <section className={cn("container flex flex-col gap-14 mx-auto py-4 mt-16", !data?.isEventStarted && "hidden")}>
          <div className="mx-auto w-full">
            <QuickLinks data={data?.quickLinkData} isLoading={isLoading} />
          </div>
        </section>
      )}
      {showSection(vc, "countdown") && data?.isEventStarted === false && (
        <section className={cn("container flex flex-col gap-14 mx-auto py-8 mt-14")}>
          <p style={{ fontSize: "clamp(1rem,1.7vw,2rem)" }} className="text-center">
            {content.countdown?.intro ?? "Join us for insightful discussions, networking opportunities, and strategic collaborations shaping the future of technology and innovation across Africa."}
          </p>
          <CountdownTimer />
        </section>
      )}
      {showSection(vc, "programme") && (
        <section
          style={{
            background: "url('/images/4dx/parttern_1.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right",
            backgroundAttachment: "local",
          }}
          id="programme"
          className={cn("bg-right bg-contain py-10 md:mt-8")}
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
            {data && <ScheduleList schedules={data?.schedule || []} />}
          </div>
        </section>
      )}
      {showSection(vc, "speakers") && (
        <section className="bg-right container bg-contain py-10 md:mt-5">
          <div className="mx-auto">
            <AllSpeakerList schedules={data?.schedule || []} isLoading={isPreview ? false : isLoading} />
          </div>
        </section>
      )}
      {showSection(vc, "accommodation") && (
        <section
          style={{
            background: "url('/images/4dx/parttern_2.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
          className="bg-left-bottom bg-contain bg-no-repeat py-8 space-y-10 container mx-auto"
        >
          <div className="mx-auto">
            <HeadingText text={content.accommodation?.heading ?? "Accommodation"} icon="/images/4dx/accomodation_icon.png" className="md:size-16" />
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-1 flex-col gap-1 text-pretty leading-relaxed tracking-normal">
                <h1 className="text-primary-main text-left font-extrabold text-xl md:text-3xl mb-8">{content.accommodation?.hotelTitle ?? ""}</h1>
                <div className="flex w-full flex-col space-y-6 ">
                  <p>{content.accommodation?.description1 ?? ""}</p>
                  <p>{content.accommodation?.description2 ?? ""}</p>
                </div>
                <div className="flex space-x-1 items-center md:items-baseline leading-relaxed tracking-normal py-5 ">
                  <Image src="/images/4dx/location.png" priority width={100} height={100} alt="loc" className="md:size-6 size-4 object-contain" />
                  <p>{content.accommodation?.address ?? ""}</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end md:items-end items-center">
                <Image src="/images/4dx/protea@2x.png" width={900} height={900} priority alt="4dx" className="md:size-64 size-40 object-cover" />
              </div>
              <div className="w-fit pt-8 md:col-span-2 md:min-w-[300px] mx-auto md:mx-0">
                <a target="_blank" rel="noreferrer" href={content.accommodation?.reserveLink ?? "#"} className="w-full">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    className="p-8 font-black w-full leading-tight bg-secondary-main text-white hover:bg-secondary-main hover:text-white border-secondary-main rounded-full"
                  >
                    {content.accommodation?.reserveButton ?? "Reserve your Room Here"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "flights") && (
        <section className="mx-auto py-8 mt-8">
          <div className="text-lg space-y-10 container ">
            <HeadingText text={content.flights?.heading ?? "Flights"} icon="/images/4dx/flight_icon.png" />
            <p className="leading-relaxed tracking-normal">{content.flights?.intro ?? ""}</p>
            <div className=" ring-primary-main flex-col space-y-8 ring-1 p-10 rounded-3xl">
              <h1 className="text-primary-main text-xl md:text-3xl text-center items-center justify-center font-extrabold ">
                {content.flights?.airportTitle ?? ""}
              </h1>
              <div className="flex gap-8 items-center text-center flex-wrap flex-col md:flex-row px-4 justify-center">
                <Image src="/images/4dx/icon_landing.png" width={100} height={100} alt="landing" className="w-8 h-8 object-contain" />
                <span>{content.flights?.arriveDate ?? ""}</span>
                <Separator orientation="horizontal" className="w-16" />
                <Image src="/images/4dx/icon_departure.png" width={100} height={100} alt="departure" className="w-8 h-8 object-contain" />
                <span>{content.flights?.departDate ?? ""}</span>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "travelRequirements") && (
        <section
          style={{
            background: "url('/images/4dx/parttern_3.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right",
            backgroundAttachment: "local",
          }}
          className="bg-right py-8 mt-8"
        >
          <div className="container mx-auto space-y-8 leading-relaxed tracking-normal">
            <HeadingText text={content.travelRequirements?.heading ?? "Travel Requirements"} icon="/images/4dx/visa_icon.png" />
            <p className="font-extrabold font-[Roboto-Bold]">{content.travelRequirements?.intro ?? ""}</p>
            <ol className="list-decimal list-outside space-y-2 pl-5">
              {(content.travelRequirements?.requirements ?? []).map((item, i) => (
                <li key={i} className="pl-1">{item}</li>
              ))}
            </ol>
            <p className="font-extrabold text-secondary-main text-xl md:text-2xl">{content.travelRequirements?.visaExemptionsTitle ?? ""}</p>
            <p>{content.travelRequirements?.visaExemptionsText ?? ""}</p>
            <a target="_blank" rel="noreferrer" href={content.travelRequirements?.visaExemptionsLinkUrl ?? "#"} className="text-primary-main underline flex gap-2 items-center">
              <Link size={26} />
              <span>{content.travelRequirements?.visaExemptionsLink ?? ""}</span>
            </a>
            <p className="font-extrabold text-secondary-main text-xl md:text-2xl">{content.travelRequirements?.visaRequirementsTitle ?? ""}</p>
            <p className="text-secondary-main font-extrabold">{content.travelRequirements?.visaRequirementsIntro ?? ""}</p>
            <p>{content.travelRequirements?.visaRequirementsText ?? ""}</p>
            <p>{content.travelRequirements?.visaRequirementsDetail ?? ""}</p>
            <a target="_blank" rel="noreferrer" href={content.travelRequirements?.visaApplicationLinkUrl ?? "#"} className="text-primary-main underline flex gap-2 items-center">
              <Link size={26} />
              <span>{content.travelRequirements?.visaApplicationLink ?? ""}</span>
            </a>
            <a target="_blank" rel="noreferrer" href={content.travelRequirements?.evisaLinkUrl ?? "#"} className="text-primary-main underline flex gap-2 items-center">
              <Link size={26} />
              <span>{content.travelRequirements?.evisaLink ?? ""}</span>
            </a>
          </div>
        </section>
      )}
      {showSection(vc, "weatherAndPack") && (
        <section className=" py-10 space-y-14">
          <div className="container mx-auto space-y-6 text-lg py-5">
            <HeadingText text={content.weather?.heading ?? "Weather"} icon="/images/4dx/weather_icon.png" />
            <p>{content.weather?.description1 ?? ""}</p>
            <p>{content.weather?.description2 ?? ""}</p>
          </div>
          <div className="container mx-auto text-lg space-y-6">
            <HeadingText text={content.whatToPack?.heading ?? "What to Pack"} icon="/images/4dx/pack_icon.png" />
            <p>{content.whatToPack?.description1 ?? ""}</p>
            <p>{content.whatToPack?.description2 ?? ""}</p>
          </div>
        </section>
      )}
      <Separator orientation="horizontal" className="w-full mt-20 bg-secondary-main" />
      {showSection(vc, "completeRegistration") && (
        <section className={cn("py-12", data?.isEventStarted && "hidden")}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 items-center w-full flex-wrap">
              <p className="font-extrabold text-xl text-center text-secondary-main">{content.completeRegistration?.heading ?? "Complete your registration"}</p>
              <div className="flex flex-wrap md:flex-nowrap justify-start items-center flex-1 md:space-x-16 gap-4 h-fit">
                <a target="_blank" rel="noreferrer" href={content.completeRegistration?.buttonAlreadyInLink ?? "#"} className="w-full md:w-fit">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    variant="outline"
                    className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                  >
                    {content.completeRegistration?.buttonAlreadyIn ?? "Already in Johannesburg"}
                  </Button>
                </a>
                <a target="_blank" rel="noreferrer" href={content.completeRegistration?.buttonFlyingLink ?? "#"} className="w-full md:w-fit">
                  <Button
                    style={{ fontSize: "clamp(.9rem, 1.2vw, 1.4rem)" }}
                    variant="outline"
                    className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                  >
                    {content.completeRegistration?.buttonFlying ?? "Flying to Johannesburg"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      {showSection(vc, "footer") && isPreview && (
        <footer className="text-white bg-primary-main mt-8">
          <div className="bg-secondary-main mx-auto py-6 px-2">
            <p className="text-white text-2xl text-center text-pretty tracking-wide font-extrabold">{content.footer?.inquiryText ?? "Send inquiries to info@jamjargh.com"}</p>
          </div>
          <div className="py-20 mx-auto flex flex-wrap md:justify-around justify-center gap-y-6">
            <div className="flex flex-wrap gap-5 justify-center items-center">
              <div className="flex items-center rounded-full p-5 bg-white">
                <Image src="/images/4dx/new/4dx_logo.png" width={600} height={600} priority alt="4dx" className="size-28 object-contain" />
              </div>
              <p className="text-left text-sm leading-relaxed max-w-xs">
                {content.footer?.description ?? "4DX Ventures is a Pan-Africa Focused Venture Capital Firm. Our mission is to connect people, ideas, and capital to create a thriving African continent, and a vibrant global community."}
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
              <p className="w-fit text-lg font-medium">&copy; {new Date().getFullYear()} 4DX Ventures</p>
            </div>
          </div>
          <Image src="/images/4dx/background.png" width={1000} height={400} alt="4dx" className="w-full h-12 object-cover bg-white" />
        </footer>
      )}
    </>
  );
}
