"use client";;
import { ArrowDownButton } from "@/components/arrowdown";
import { CountdownTimer } from "@/components/countdown-timer";
import { ScheduleList } from "@/components/schedule-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";
import Image from "next/image";
import { getConferenceSchedule, getConferenceSettings } from "./actions/timeline";

// const textIconData = [
//   {
//     text: 'www.acgc.africa',
//     icon: <Globe className="w-4 h-4" />
//   },
//   {
//     text: '@african_inhouse',
//     // twitter icon
//     icon: <Twitter className="w-4 h-4" />
//   },
//   {
//     text: 'mail@acgc.africa',
//     icon: <Mail className="w-4 h-4" />
//   },
//   {
//     text: 'ACGC (African Corprate Government Counsel Forum)',
//     icon: <Linkedin className="w-4 h-4" />
//   }
// ]

const sections = ["about", "programme"];
// #ACGC4B, #Africaninhouse, #Generalcounselafrica, #Govtcounselafrica, #Corporatecounselafrica
// const hashTags = ["ACGC4B", "Africaninhouse", "Generalcounselafrica", "Govtcounselafrica", "Corporatecounselafrica"];
// const INTERVAL = 60000; // 1 minute
export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['conference-schedules'],
    queryFn: async () => await getConferenceSchedule(),
    refetchInterval: 65000, // 1 minute 5 seconds
  });
  const { data: settings } = useQuery({
    queryKey: ['conference-settings'],
    queryFn: async () => await getConferenceSettings(),
    refetchInterval: 80000, // 1 minute 20 seconds
  });


  return (
    <>
      <section
        className="text-white bg-center bg-contain w-full h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/images/4dx/background.png')",
          backgroundSize: '100%'
        }}
      >
        <Card
          style={{
            boxShadow: "0px 0px 10px rgb(177, 177, 177)",
          }}
          className="md:py-[4.2rem] px-[1.6rem] shadow-inner rounded-[1.8rem] border-none">
          <CardContent className="p-2">
            <div className="flex flex-wrap gap-[3rem] justify-center items-center">
              <div className="flex flex-1 items-center  p-6">
                <Image
                  src={"/images/4dx/4dx_programme_logo.png"}
                  width={600}
                  height={600}
                  priority
                  alt="4dx"
                  className="w-[300px] h-[300px] object-contain"
                />
              </div>
              <Separator orientation="vertical" className="h-[16rem] ml-2 hidden md:block" />
              <Separator orientation="horizontal" className="w-full md:hidden" />
              <div className="flex-col leading-tight justify-center flex space-y-4 items-center px-2">
                <div
                  style={{
                    fontSize: "clamp(.8rem, 1.25vw, 2rem)",
                    fontWeight: 400,
                    lineHeight: "1.7"
                  }}
                  className=" max-w-[19rem] line-clamp-3"
                >
                  <h3
                    className="text-center">
                    Welcome to the 4DX CEO Summit,
                    an exclusive annual event hosted,
                    by 4DX Ventures.
                  </h3>
                </div>
                <h2
                  style={{
                    fontSize: "clamp(.7rem, 1.3vw, 2rem)"
                  }}
                  className="text-secondary-main font-bold">Click below to complete your registration</h2>
                <div className="flex flex-col items-center py-4 gap-4 px-12">
                  <a target="_blank" href="https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1" className="w-full">
                    <Button
                      style={{
                        fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                      }}
                      variant={"outline"}
                      className="p-7 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                    >Already in Johannesburg</Button>
                  </a>
                  <a target="_blank" href="https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC" className="w-full">
                    <Button
                      style={{
                        fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                      }}
                      variant={"outline"}
                      className="p-7 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
                    >Flying to Johannesburg</Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ArrowDownButton />
      </section>

      <section className="container flex flex-col gap-14 mx-auto py-10 mt-24">
        <h2
          style={{
            fontWeight: 400,
            fontSize: "clamp(1rem,1.7vw,2rem)"
          }}
          className="text-center">
          Join us for insightful discussions, networking opportunities, and strategic <br className="hidden md:block" /> collaborations shaping the future of technology and innovation across Africa.
        </h2>
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
        className="bg-right p-4 md:px-48 py-10 md:mt-20">
        <div className="container mx-auto">
          <HeadingText text="Program Outline" icon="/images/4dx/program_icon.png" />
          {
            isLoading && <div className="text-center">
              <p>Loading...</p>
            </div>
          }
          {
            data &&
            <ScheduleList schedules={data} columns={settings?.columns} />
          }
        </div>
      </section>

      {/* accommodation */}
      <section
        style={{
          background: "url('/images/4dx/parttern_2.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "left",
          backgroundAttachment: "scroll"
        }}
        className="bg-left bg-contain bg-no-repeat p-4 md:px-48">

        <div className="container mx-auto">
          <HeadingText text="Accommodation" icon="/images/4dx/accomodation_icon.png" className="w-14 h-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex flex-col gap-4 text-lg space-y-5">
              <h1 className="text-primary-main font-extrabold text-4xl py-4">Protea Hotel:The Wanderers</h1>
              <p>
                Set in the illustrious grounds of the famous Wanderers Club in Illovo. This is the premier destination for a wide range of corporate, sporting and private events.<br /><br />

                Preferred rates have been negotiated specifically for our group at <br /> <strong className="font-bold text-secondary-main">$97 per night</strong> . We highly recommend you book your room as soon as you can.
              </p>
              <div className="flex gap-0 items-end">
                <Image src="/images/4dx/location.png" width={100} height={100} alt="phone" className="w-8 h-8 mb-1 object-contain" />
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
                className="md:w-72 w-full h-auto object-cover"
              />
            </div>
            <div className="w-fit pt-8 md:col-span-2">
              <a target="_blank" href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1708326594696&key=GRP&app=resvlink" className="w-full">
                <Button
                  style={{
                    fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                  }}
                  variant={"default"}
                  className="p-7 w-full bg-secondary-main text-white hover:bg-secondary-main hover:text-white font-extrabold border-secondary-main rounded-full"
                >Reserve your Room Here</Button>
              </a>
            </div>
          </div>
        </div>

      </section>
      {/* flights */}
      <section className="p-4 md:px-48">
        <div className="text-lg py-8 space-y-10 container mx-auto">
          <HeadingText text="Flights" icon="/images/4dx/flight_icon.png" />
          <p className="leading-relaxed tracking-wide">
            We recommend you book your flights early to get the best rates. For travel within the continent, we recommend booking on Ethiopian
            Airlines, Egypt Airlines, Kenya Airways or South African Airlines for the most direct routes. When booking your flight, use the details
            below for a seamless trip.
          </p>

          <div className=" ring-primary-main flex-col space-y-8 ring-1 p-10 rounded-3xl">
            <h1 className="text-primary-main text-xl md:text-3xl text-center items-center justify-center font-extrabold ">
              O.R. TAMBO International Airport, Johannesburg, South Africa.
            </h1>
            <div className="flex gap-8 items-center flex-wrap px-4 justify-center">
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
        className="bg-right p-4 md:px-48">
        <div className="container mx-auto space-y-8 text-lg">
          <HeadingText text="Travel Requirements" icon="/images/4dx/visa_icon.png" />
          <h2 className="font-bold">
            For entry into South Africa, visitors are expected to have the following:
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>An international passport with 6 months validity and at least two blank pages.</li>
            <li>A valid visa, if required.</li>
            <li>Sufficient funds to pay for your day-to-day expenses during your stay.</li>
            <li>Yellow fever certificates if your journey starts or entails passing through the yellow fever belt of Africa or South America.</li>
          </ol>
          <h1 className="font-extrabold text-secondary-main text-xl md:text-2xl">Visa Exemptions</h1>
          <p>Passport holders from the following countries: <strong className="text-secondary-main font-bold">US, UK, Ghana, Kenya, Jordan DO NOT</strong> require a visa to enter South Africa.</p>
          <a target="_blank" href="https://www.dha.gov.za/index.php/immigration-services/exempt-countries" className="text-primary-main underline flex gap-2 items-center">
            <Link size={26} />
            <span>Full list of VISA exempt countries/passports</span>
          </a>
          <h1 className="font-bold text-secondary-main text-xl md:text-2xl">Visa Requirements</h1>
          <p className="text-secondary-main font-semibold">
            Please apply for your visa now as processing times may vary. We recommend you check your local South African Embassy or Consulate website for timelines and additional information.
          </p>

          <p>
            Passport holders from <strong className="text-secondary-main font-bold">Nigeria, Egypt, Ivory Coast, Senegal and Sudan countries DO</strong> require a visa to enter.
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
      <section className="p-4 md:px-48 py-20 space-y-12">
        <div className="container mx-auto space-y-6 text-lg py-10">
          <HeadingText text="Weather" icon="/images/4dx/weather_icon.png" />
          <p>
            The weather in South Africa in November sees a wide range of temperatures across the vast and varied landscape, transitioning into the warm early summer months. On average, the high temperatures range from 25°C to 30°C (77°F-86°F), with minimums dropping to 15°C-20°C (59°F-68°F) in the evening.
          </p>
          <p>
            This range indicates a warm climate throughout the country during this time.
          </p>
        </div>
        <div className="container mx-auto text-lg space-y-5">
          <HeadingText text="What to Pack" icon="/images/4dx/pack_icon.png" />
          <p>
            The weather in Johannesburg is getting warmer at this time of the year, please pack business casual outfits with breathable fabrics during the day.
          </p>
          <p>
            Although the weather is warm during the day, it can get chilly at night. It is advisable to pack layers; a light jacket, sweaters and clothes with warmer materials in order to stay comfortable and warm.
          </p>
        </div>
      </section>
      <Separator orientation="horizontal" className="w-full bg-secondary-main" />
      {/* complete your registration */}
      <section className="">
        <div className="container mx-auto py-8 px-2">
          <div className="flex justify-between items-center w-full md:w-full md:flex-nowrap flex-wrap gap-4">
            <h2 className="text-2xl font-bold w-full text-secondary-main">Complete your registration</h2>
            <a target="_blank" href="https://4dxsouthafrica.rsvpify.com/?securityToken=bSv6gLLvYgyZpj9AMPnz4PAm5XtnJsS1" className="w-full">
              <Button
                style={{
                  fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                }}
                variant={"outline"}
                className="p-7 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
              >Already in Johannesburg</Button>
            </a>
            <a target="_blank" href="https://4dxinternational2024.rsvpify.com/?securityToken=uzRWkiKf9IRQwWkcAocZirJoOQPIogHC" className="w-full">
              <Button
                style={{
                  fontSize: "clamp(.9rem, 1.2vw, 1.4rem)"
                }}
                variant={"outline"}
                className="p-7 w-full hover:bg-secondary-main hover:text-white text-secondary-main font-extrabold border-secondary-main rounded-full"
              >Flying to Johannesburg</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


function HeadingText({ text, icon, className }: { text: string, icon: string, className?: string }) {
  return (
    <div
      style={{
        fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)"
      }}
      className="flex text-secondary-main gap-4 items-center w-full justify-center mb-8">
      <Image src={icon} width={100} height={100} alt="icon" className={cn("w-12 h-12 object-contain", className)} />
      <h1
        className="text-center items-center justify-center text-secondary-main font-extrabold ">
        {text}
      </h1>
    </div>
  )
}



