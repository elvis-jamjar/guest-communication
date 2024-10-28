"use client";;
import { CountdownTimer } from "@/components/countdown-timer";
import { HeadingText } from "@/components/heading-text";
import { QuickLinks } from "@/components/quick-links-section";
import { ScheduleList } from "@/components/schedule-list";
import AllSpeakerList from "@/components/speaker-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getConferenceSchedule } from "./actions/timeline";


// const sections = ["about", "programme"];
// #ACGC4B, #Africaninhouse, #Generalcounselafrica, #Govtcounselafrica, #Corporatecounselafrica
// const hashTags = ["ACGC4B", "Africaninhouse", "Generalcounselafrica", "Govtcounselafrica", "Corporatecounselafrica"];
// const INTERVAL = 60000; // 1 minute
export default function Home() {
  const query = useSearchParams()
  const { data, isLoading } = useQuery({
    queryKey: ['conference-schedules'],
    queryFn: async () => await getConferenceSchedule(),
    // 2 minutes
    refetchInterval: 120000,// 2 minutes
  });

  // scroll to program id if search query is program
  useEffect(() => {
    if (query.get('q') === 'programme') {
      const program = document.getElementById("programme");
      // wait few seconds before scrolling
      setTimeout(() => {
        program?.scrollIntoView({ behavior: "smooth" });
        // remove the query
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 620);
    }
  }, []);

  return (
    <>
      <section className={cn("container flex flex-col gap-14 mx-auto py-4 mt-16", !data?.isEventStarted && "hidden")}>
        <div className="mx-auto">
          <QuickLinks data={data?.quickLinkData} />
        </div>
      </section>
      <section className={cn("container flex flex-col gap-14 mx-auto py-8 mt-14", data?.isEventStarted && "hidden")}>
        <p
          style={{
            fontSize: "clamp(1rem,1.7vw,2rem)",
          }}
          className="text-center">
          Join us for insightful discussions, networking opportunities, and strategic <br className="hidden md:block" /> collaborations shaping the future of technology and innovation across Africa.
        </p>
        <CountdownTimer />
      </section>
      {/* Program Section */}
      <section
        style={{
          background: "url('/images/4dx/parttern_1.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "right",
          backgroundAttachment: "local"
        }}
        id="programme"
        className={cn("bg-right bg-contain py-10 md:mt-8")}>
        <div className="container mx-auto">
          <HeadingText text="Program Outline" icon="/images/4dx/program_icon.png" />
          {
            isLoading &&
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
          }
          {
            data &&
            <ScheduleList schedules={data?.schedule || []} />
          }
        </div>
      </section>
      {/* speaker section */}
      <section
        className="bg-right container bg-contain py-10 md:mt-5">
        <div className="mx-auto">
          <AllSpeakerList schedules={data?.schedule || []} isLoading={isLoading} />
        </div>
      </section>

      {/* accommodation */}
      <section
        style={{
          background: "url('/images/4dx/parttern_2.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          // backgroundPosition: "left",
          // backgroundAttachment: "scroll"
        }}
        className="bg-left-bottom bg-contain bg-no-repeat py-8 space-y-10 container mx-auto">
        <div className="mx-auto">
          <HeadingText text="Accommodation" icon="/images/4dx/accomodation_icon.png" className="md:size-16" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-1 flex-col gap-1 text-pretty leading-relaxed tracking-normal">
              <h1 className="text-primary-main text-left font-extrabold text-xl md:text-3xl mb-8">Protea Hotel:The Wanderers</h1>
              <div className="flex w-full flex-col space-y-6 ">
                <p>
                  Set in the illustrious grounds of the famous Wanderers Club in Illovo. This is the premier destination for a wide range of corporate, sporting and private events.
                </p>
                <p>
                  Preferred rates have been negotiated specifically for our group at <strong className="font-extrabold text-secondary-main">$97 per night.</strong> We highly recommend you book your room as soon as you can.
                </p>
              </div>
              <div className="flex space-x-1 items-center md:items-baseline leading-relaxed tracking-normal py-5 ">
                <Image src="/images/4dx/location.png" priority width={100} height={100} alt="loc" className="md:size-6 size-4 object-contain" />
                <p>Corner Corlette Drive and Rudd Road, Illovo, South Africa, 2196.</p>
              </div>
            </div>

            <div className="flex justify-center md:justify-end md:items-end items-center">
              <Image
                src="/images/4dx/protea@2x.png"
                width={900}
                height={900}
                priority
                alt="4dx"
                className="md:size-64 size-40 object-cover"
              />
            </div>

            <div className="w-fit pt-8 md:col-span-2 md:min-w-[300px] mx-auto md:mx-0">
              <a target="_blank" href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1708326594696&key=GRP&app=resvlink" className="w-full">
                <Button
                  style={{
                    fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                  }}
                  // variant={"default"}
                  className="p-8 font-black w-full leading-tight bg-secondary-main text-white hover:bg-secondary-main hover:text-white border-secondary-main rounded-full"
                >Reserve your Room Here</Button>
              </a>
            </div>
          </div>
        </div>

      </section>
      {/* flights */}
      <section className="mx-auto py-8 mt-8">
        <div className="text-lg space-y-10 container ">
          <HeadingText text="Flights" icon="/images/4dx/flight_icon.png" />
          <p className="leading-relaxed tracking-normal">
            We recommend you book your flights early to get the best rates. For travel within the continent, we recommend booking on Ethiopian
            Airlines, Egypt Airlines, Kenya Airways or South African Airlines for the most direct routes. When booking your flight, use the details
            below for a seamless trip.
          </p>
          <div className=" ring-primary-main flex-col space-y-8 ring-1 p-10 rounded-3xl">
            <h1 className="text-primary-main text-xl md:text-3xl text-center items-center justify-center font-extrabold ">
              O.R. TAMBO International Airport, Johannesburg, South Africa.
            </h1>
            <div className="flex gap-8 items-center text-center flex-wrap flex-col md:flex-row px-4 justify-center">
              <Image src="/images/4dx/icon_landing.png" width={100} height={100} alt="landing" className="w-8 h-8 object-contain" />
              <span>Arrive on Sunday 3rd November</span>
              <Separator orientation="horizontal" className="w-16" />
              <Image src="/images/4dx/icon_departure.png" width={100} height={100} alt="departure" className="w-8 h-8 object-contain" />
              <span>Depart on Wednesday 6th November</span>
            </div>
          </div>
        </div>
      </section>
      {/* travel requirement  */}
      <section style={{
        background: "url('/images/4dx/parttern_3.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "right",
        backgroundAttachment: "local"
      }}
        className="bg-right py-8 mt-8">
        <div className="container mx-auto space-y-8 leading-relaxed tracking-normal">
          <HeadingText text="Travel Requirements" icon="/images/4dx/visa_icon.png" />
          <p className="font-extrabold font-[Roboto-Bold]">
            For entry into South Africa, visitors are expected to have the following:
          </p>
          <ol className="list-decimal list-outside space-y-2 pl-5">
            <li className="pl-1">An international passport with 6 months validity and at least two blank pages.</li>
            <li className="pl-1">A valid visa, if required.</li>
            <li className="pl-1">Sufficient funds to pay for your day-to-day expenses during your stay.</li>
            <li className="pl-1">Yellow fever certificates if your journey starts or entails passing through the yellow fever belt of Africa or South America.</li>
          </ol>
          <p className="font-extrabold text-secondary-main text-xl md:text-2xl">Visa Exemptions</p>
          <p>Passport holders from the following countries: <strong className="text-secondary-main font-extrabold">US, UK, Ghana, Kenya, Jordan DO NOT</strong> require a visa to enter South Africa.</p>
          <a target="_blank" href="https://www.dha.gov.za/index.php/immigration-services/exempt-countries" className="text-primary-main underline flex gap-2 items-center">
            <Link size={26} />
            <span>Full list of VISA exempt countries/passports</span>
          </a>
          <p className="font-extrabold text-secondary-main text-xl md:text-2xl">Visa Requirements</p>
          <p className="text-secondary-main font-extrabold">
            Please apply for your visa now as processing times may vary. We recommend you check your local South African Embassy or Consulate website for timelines and additional information.
          </p>

          <p>
            Passport holders from <strong className="text-secondary-main font-extrabold">Nigeria, Egypt, Ivory Coast, Senegal and Sudan countries DO</strong> require a visa to enter.
          </p>
          <p>
            Click on the link below for more details on the documents required to apply for a visa and the link to the e-visa application process.
          </p>
          <a target="_blank" href="https://drive.google.com/file/d/15AG8Ek03wFsoleTPdapkKxpqDhPG0U9l/view" className="text-primary-main underline flex gap-2 items-center">
            <Link size={26} />
            <span>Details on requirements for visa application</span>
          </a>
          <a target="_blank" href="https://ehome.dha.gov.za/epermit/home" className="text-primary-main underline flex gap-2 items-center">
            <Link size={26} />
            <span>E-visa application form</span>
          </a>
        </div>

      </section>
      {/* weather and what to pack */}
      <section className=" py-10 space-y-14">
        <div className="container mx-auto space-y-6 text-lg py-5">
          <HeadingText text="Weather" icon="/images/4dx/weather_icon.png" />
          <p>
            The weather in South Africa in November sees a wide range of temperatures across the vast and varied landscape, transitioning into the warm early summer months. On average, the high temperatures range from 25°C to 30°C (77°F-86°F), with minimums dropping to 15°C-20°C (59°F-68°F) in the evening.
          </p>
          <p>
            This range indicates a warm climate throughout the country during this time.
          </p>
        </div>
        <div className="container mx-auto text-lg space-y-6">
          <HeadingText text="What to Pack" icon="/images/4dx/pack_icon.png" />
          <p>
            The weather in Johannesburg is getting warmer at this time of the year, please pack business casual outfits with breathable fabrics during the day.
          </p>
          <p>
            Although the weather is warm during the day, it can get chilly at night. It is advisable to pack layers; a light jacket, sweaters and clothes with warmer materials in order to stay comfortable and warm.
          </p>
        </div>
      </section>
      <Separator orientation="horizontal" className="w-full mt-20 bg-secondary-main" />
      {/* complete your registration */}
      <section className="py-12 ">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 items-center w-full flex-wrap">
            <p className="font-extrabold text-xl text-center text-secondary-main">Complete your registration</p>
            <div className="flex flex-wrap md:flex-nowrap justify-start items-center flex-1 md:space-x-16 gap-4 h-fit">
              <a target="_blank" href="https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1" className="w-full md:w-fit">
                <Button
                  style={{
                    fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                  }}
                  variant={"outline"}
                  className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                >Already in Johannesburg</Button>
              </a>
              <a target="_blank" href="https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC" className="w-full md:w-fit">
                <Button
                  style={{
                    fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                  }}
                  variant={"outline"}
                  className="p-9 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                >Flying to Johannesburg</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}





