'use client';;
import { ConferenceScheduleProps, Speaker, TimelineItemProps } from '@/app/types';
import { cn } from '@/lib/utils';
import {
  Camera,
  Coffee,
  Flag,
  Gamepad2,
  Mic,
  PartyPopper,
  PersonStanding,
  Tv,
  Users
} from 'lucide-react';
import React from 'react';

export const icons = {
  coffee: <Coffee className='w-4 h-4' />,
  camera: <Camera className='w-4 h-4' />,
  mic: <Mic className='w-4 h-4' />,
  users: <Users className='w-4 h-4' />,
  gamepad: <Gamepad2 className='w-4 h-4' />,
  person: <PersonStanding className='w-4 h-4' />,
  tv: <Tv className='w-4 h-4' />,
  party: <PartyPopper className='w-4 h-4' />,
  flag: <Flag className='w-4 h-4' />
}

export function ConferenceSchedule(
  { className, timeLineItems }: ConferenceScheduleProps & { columns?: number }
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={cn("mx-auto w-full space-y-6", className)}>
      {timeLineItems?.map((item, index) => (
        <TimelineItem
          {...item}
          isFirst={index === 0}
          key={index} className={cn('p-0 md:p-0', item?.className)} />
      ))}
    </div>
  )
}

// function Banner({ banners }: { banners: string[] }) {
//   // if banners is one then display it as a single image else display as a grid of two images
//   const gridClass = banners?.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
//   return (
//     <div className={cn('grid gap-2 my-2', gridClass)}>
//       {banners.map((banner, index) => (
//         <Image className='w-full h-auto object-cover rounded-md' key={index} src={banner} alt={"Image"} width={500} height={500} />
//       ))}
//     </div>
//   )
// }

function TimelineItem({ time, isFirst, isTrack, title, sectionTitle, description, speakers, color, fontWeights }: TimelineItemProps) {
  return (
    <div className='grid md:grid-cols-7 grid-cols-1 relative text-pretty'>
      <div className={cn("flex-1 w-px left-2 bg-secondary-main z-auto absolute h-full top-auto bottom-0")}></div>
      <div className={cn('col-span-1 w-4 h-4 flex rounded-full justify-center items-center bg-white z-10', isTrack && "bg-transparent")}>
        <div className={cn('w-2 h-2 rounded-full', isFirst ? 'bg-primary-main' : 'bg-secondary-main', isTrack && "bg-transparent")}>
        </div>
      </div>

      <div className='md:col-span-2 md:p-0 ps-5 flex md:flex-col'>
        {
          isFirst && <h2 className='text-secondary-main hidden md:block'>Time</h2>
        }
        <p className={cn('text-secondary-main', color?.time, isTrack && "text-transparent")}>{time}</p>
      </div>

      <div className='flex flex-col md:p-0 ps-5 md:col-span-4'>
        {
          isFirst && <h2 className='text-secondary-main hidden md:block'>Activity</h2>
        }
        {
          title && <ul className={cn("list-none list-outside", isTrack && 'list-disc')}>
            <li className={cn(color?.title, fontWeights?.title)}>
              {title}
            </li>
          </ul>
        }
        <div className='flex-col space-y-2'>
          {sectionTitle && <p className={cn("font-mono", color?.sectionTitle)}>
            {sectionTitle}
          </p>}
          {description && <p className={cn(color?.description, fontWeights?.description)}>{description}</p>}
          <SpeakerList speakers={speakers || []} title='Speaker' />
        </div>
      </div>
    </div>
  )
}


function SpeakerList({ speakers }: { speakers: Array<Speaker>, title: string }) {
  return (
    <div className="grid">
      {/* {(Number(speakers?.length || 0) > 0) && <h2 className="text-sm mt-5 font-semibold uppercase">
        {speakers?.length > 1 ? `${title?.toLowerCase()}s` : `${title?.toLowerCase()}`}
      </h2>} */}
      {speakers.map((person, index) => (
        <div key={index} className="text-secondary-main flex items-start">
          <span>
            {person?.name} {person?.title || ''} {person?.bio}
          </span>
          {/* <Avatar className="h-10 w-10 bg-secondary-main/5  rounded-full flex items-center justify-center">
            <AvatarImage src={person?.photo} alt={person?.name} />
            <AvatarFallback
              className='font-[Roboto-Medium] text-secondary-main/50 text-md'>{person?.name.charAt(0)}</AvatarFallback>
          </Avatar> */}
          {/* <div>
           
          </div> */}
        </div>
      ))}
    </div>
  )
}

// function Sponsor({ sponsors }: { sponsors: Array<string> }) {
//   const urlList = sponsors.filter((sponsor) => sponsor.startsWith('http'));
//   const nonUrlList = sponsors.filter((sponsor) => !sponsor.startsWith('http'));
//   return (
//     <div className="mt-2">
//       {(Number(sponsors?.length || 0) > 0) && <h2 className="text-xs text-primary-main py-2 font-mono">SPONSORED BY</h2>}
//       {/* sponsor images */}
//       <div className={cn("flex gap-2 flex-wrap justify-start w-full")}>
//         {urlList.map((sponsor, index) => (
//           <DynamicImage key={index} src={sponsor} alt={sponsor} />
//         ))}
//       </div>
//       <div className='pt-2'>
//         {Number(nonUrlList?.length || 0) > 0 && <span className="text-xs font-mono px-0 rounded-md">{
//           nonUrlList.join(', ')
//         }</span>}
//       </div>
//     </div>
//   )
// }



