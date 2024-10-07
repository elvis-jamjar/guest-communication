'use client'

import { ConferenceScheduleProps, TimelineItemProps, Speaker } from '@/app/types';
import { cn } from '@/lib/utils'
import {
  Coffee,
  Camera,
  Mic,
  Users,
  Gamepad2,
  PersonStanding,
  Tv,
  PartyPopper,
  Flag
} from 'lucide-react'
import Image from 'next/image'
import { DynamicImage } from './ui/dynamic-image';
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
  { className, timeLineItems, columns = 2 }: ConferenceScheduleProps & { columns?: number }
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // check if timeLineItems items is more than 3 then split it into two halves
  const firstHalf = timeLineItems?.length > 6 ? timeLineItems.slice(0, Math.ceil(timeLineItems.length / 2)) : timeLineItems;
  const secondHalf = timeLineItems?.length > 6 ? timeLineItems.slice(Math.ceil(timeLineItems.length / 2)) : [];


  return (
    <div
      ref={containerRef}
      className={cn("bg-transparent p-8 py-4 mx-auto w-full", className)}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full", (columns === 1) && 'md:grid-cols-1')}>
        <div className="w-full">
          {firstHalf.map((item, index) => (
            <TimelineItem
              {...item}
              key={index}
              isFirst={index === 0}
            // hideLine={arr.length === 1}
            />
          ))}
        </div>
        <div className="w-full">
          {secondHalf.map((item, index, arr) => (
            <TimelineItem
              key={index}
              {...item}
              isFirst={index === 0}
              hideLine={arr.length === 1}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

function Banner({ banners }: { banners: string[] }) {
  // if banners is one then display it as a single image else display as a grid of two images
  const gridClass = banners?.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
  return (
    <div className={cn('grid gap-2 mt-2', gridClass)}>
      {banners.map((banner, index) => (
        <Image className='w-full h-auto object-cover rounded-md' key={index} src={banner} alt={banner} width={100} height={50} />
      ))}
    </div>
  )
}

function TimelineItem({ time, isFirst, isTrack, trackLabel, iconColor, hideLine, title, description, icon, sponsors, speakers, banners, bannerPosition, sectionTitle, facilitators, host, moderators, children, className, subItems }: TimelineItemProps) {
  return (
    <div className={cn("flex flex-wrap w-full my-4 mt-0 rounded-2xl relative p-6", (trackLabel || icon || title) && 'bg-white',
      className)}>
      <div className={cn("flex flex-col items-center absolute h-[calc(100%+2rem)] -top-[2rem]")}>
        <div className={cn("text-white w-8 h-8 z-10 rounded-full flex p-2 mt-[3.8rem]", icon && 'w-fit h-fit', isTrack && '-ms-1  mt-[5rem] w-fit h-fit', 'bg-primary-main', iconColor)}>
          {
            !isTrack ? icons[icon as keyof typeof icons] : <div className='flex items-center gap-1'>
              <div className='bg-white w-4 h-4 rounded-full'></div>
              <h2 className="text-white text-sm font-bold">{trackLabel || 'Track 1'}</h2>
            </div>
          }
        </div>
        {!hideLine && <div className={cn("flex-1 w-px bg-gray-300 z-auto absolute h-full", isFirst && 'mt-24', isTrack && "left-[15.6px]")}></div>}
      </div>
      <div className={cn('ps-10 w-full')}>
        {time && <p className={cn("text-xs font-bold whitespace-normal tracking-tight", isTrack && 'pb-2')}>{time}</p>}
        {sectionTitle && <h4 className={cn("text-sm tracking-widest uppercase font-mono py-1", isTrack && "mt-12")}>{sectionTitle}</h4>}
        <h3 className={cn("font-bold text-sm text-primary-purple py-2", (isTrack && !sectionTitle) && "mt-1.5")}>{title}</h3>
        {(bannerPosition === 'top' || !bannerPosition) && <Banner banners={banners || []} />}
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {(Number(sponsors?.length || 0) > 0) && <Sponsor sponsors={sponsors || []} />}
        {(Number(speakers?.length || 0) > 0) && <SpeakerList speakers={speakers || []} title='Speaker' />}
        {(Number(facilitators?.length || 0) > 0) && <SpeakerList speakers={facilitators || []} title='Facilitator' />}
        {host && <SpeakerList speakers={[host]} title='Host' />}
        {(Number(moderators?.length || 0) > 0) && <SpeakerList speakers={moderators || []} title='moderator' />}
        {children}
        {(bannerPosition === 'bottom') && <Banner banners={banners || []} />}
      </div>
      {(Number(subItems?.length || 0) > 0) &&
        subItems?.map((item, index) => (
          <TimelineItem {...item} key={index} className={cn('p-0 md:p-0', item?.className)} />
        ))
      }
    </div>
  )
}

function SpeakerList({ speakers, title }: { speakers: Array<Speaker>, title: string }) {
  return (
    <div className="space-y-2">
      {(Number(speakers?.length || 0) > 0) && <h2 className="text-sm mt-5 font-semibold uppercase">
        {speakers?.length > 1 ? `${title?.toLowerCase()}s` : `${title?.toLowerCase()}`}
      </h2>}
      {speakers.map((speaker, index) => (
        <p key={index} className="text-xs">
          <span className="font-semibold">{speaker?.name}</span>{speaker?.name && ','}
          {speaker?.title} <br />
          {speaker?.bio}
        </p>
      ))}
    </div>
  )
}

function Sponsor({ sponsors }: { sponsors: Array<string> }) {
  const urlList = sponsors.filter((sponsor) => sponsor.startsWith('http'));
  const nonUrlList = sponsors.filter((sponsor) => !sponsor.startsWith('http'));
  return (
    <div className="mt-2">
      {(Number(sponsors?.length || 0) > 0) && <h2 className="text-xs text-primary-main py-2 font-mono">SPONSORED BY</h2>}
      {/* sponsor images */}
      <div className={cn("flex gap-2 flex-wrap justify-start w-full")}>
        {urlList.map((sponsor, index) => (
          <DynamicImage key={index} src={sponsor} alt={sponsor} />
        ))}
      </div>
      <div className='pt-2'>
        {Number(nonUrlList?.length || 0) > 0 && <span className="text-xs font-mono px-0 rounded-md">{
          nonUrlList.join(', ')
        }</span>}
      </div>
    </div>
  )
}



