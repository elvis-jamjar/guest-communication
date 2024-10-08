'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'
import { GripVertical, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Speaker, TimelineItemProps, ConferenceScheduleProps } from '@/app/types'
import { icons } from './conference-schedule'
import { UploadDropzone } from '@/lib/utils'
import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";


const SpeakerForm = ({ speaker, onChange, onRemove }: { speaker: Speaker, onChange: (speaker: Speaker) => void, onRemove: () => void }) => (
  <div className="space-y-4 p-4 border rounded-md">
    <Input
      placeholder="Name"
      value={speaker.name}
      onChange={(e) => onChange({ ...speaker, name: e.target.value })}
    />
    <Input
      placeholder="Title (optional)"
      value={speaker.title}
      onChange={(e) => onChange({ ...speaker, title: e.target.value })}
    />
    <Textarea
      placeholder="Bio"
      value={speaker.bio}
      onChange={(e) => onChange({ ...speaker, bio: e.target.value })}
    />
    <Button variant="destructive" onClick={onRemove}>Remove Speaker</Button>
  </div>
)

const TimelineItemForm = ({ item, onChange, onRemove }: { item: TimelineItemProps, onChange: (item: TimelineItemProps) => void, onRemove: () => void }) => {
  const [showSpeakers, setShowSpeakers] = useState(Number(item.speakers?.length) > 0)
  const [showHost, setShowHost] = useState(!!item.host)
  const [showFacilitators, setShowFacilitators] = useState(Number(item.facilitators?.length) > 0)
  const [showModerators, setShowModerators] = useState(Number(item.moderators?.length) > 0);

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <Input
        placeholder="Time(eg. 10:00 AM)"
        value={item.time}
        onChange={(e) => onChange({ ...item, time: e.target.value })}
      />
      <Input
        placeholder="Section Title"
        value={item.sectionTitle}
        onChange={(e) => onChange({ ...item, sectionTitle: e.target.value })}
      />
      <Input
        placeholder="Title"
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is-track"
          checked={item.isTrack}
          onCheckedChange={(checked) => onChange({ ...item, isTrack: checked })}
        />
        <Label htmlFor="is-track">
          No icon, Track Label
        </Label>
      </div>
      {
        item?.isTrack ? <div className='flex items-center space-x-2'>
          <Input
            placeholder="Track Label"
            value={item.trackLabel}
            onChange={(e) => onChange({ ...item, trackLabel: e.target.value })}
          />
        </div> :
          <Select
            value={item.icon}
            onValueChange={(value) => onChange({ ...item, icon: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Icon" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(icons).map((icon) => (
                <SelectItem key={icon} value={icon}>
                  <div className='flex items-center gap-1'>
                    {icons[icon as keyof typeof icons]}
                    <span className='capitalize'>{icon}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      }
      <Select
        value={item?.iconColor}
        onValueChange={(value) => onChange({ ...item, iconColor: value as "bg-primary-purple" | "bg-primary-main" })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Track & Icon color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bg-primary-purple" className='border-l-2 my-1 border-l-primary-purple hover:text-primary-purple'>Purple</SelectItem>
          <SelectItem value="bg-primary-main" className='border-l-2 border-l-primary-main text-primary-main hover:text-primary-main'>Amber</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Switch
          id="hide-line"
          checked={item.hideLine}
          onCheckedChange={(checked) => onChange({ ...item, hideLine: checked })}
        />
        <Label htmlFor="hide-line">Hide Line</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is-first"
          checked={item.isFirst}
          onCheckedChange={(checked) => onChange({ ...item, isFirst: checked })}
        />
        <Label htmlFor="is-first">Is First</Label>
      </div>
      <div className="space-y-2">
        <Label>Images</Label>
        <UploadDropzone
          endpoint="imageUploader"
          config={{
            mode: "auto",
            appendOnPaste: true
          }}
          onClientUploadComplete={(res) => {
            const urls = res.map((r) => r.url)
            // Do something with the response.
            onChange({ ...item, banners: [...(item?.banners || []), ...(urls)] })
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error?.message}`);
          }}
        />
        <div className="flex items-center flex-wrap gap-2">
          {item.banners?.map((banner, index) => (
            <div className='flex flex-col shadow-lg p-2 rounded-lg gap-1' key={index}>
              <Image key={index} src={banner}
                alt={banner}
                width={100}
                height={50}
                className='rounded-md w-24 h-12 object-cover'
              />
              <Button size={"sm"} variant="destructive" onClick={() => {
                const newBanners = [...(item.banners || [])]
                newBanners.splice(index, 1)
                onChange({ ...item, banners: newBanners })
              }}>Remove</Button>
            </div>
          ))}
        </div>
        {/* image position (top|bottom) */}
        <Select
          value={item?.bannerPosition}
          onValueChange={(value) => onChange({ ...item, bannerPosition: value as "top" | "bottom" })}>
          <SelectTrigger>
            <SelectValue placeholder="Image Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sponsors</Label>
        <UploadDropzone
          endpoint="imageUploader"
          config={{
            mode: "auto",
            appendOnPaste: true
          }}
          onClientUploadComplete={(res) => {
            const urls = res.map((r) => r.url)
            // Do something with the response.
            onChange({ ...item, sponsors: [...(item?.sponsors || []), ...(urls)] })
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error?.message}`);
          }}
        />
        <div className="flex items-center flex-wrap gap-2">
          {item?.sponsors?.map((sponsor, index) => (
            sponsor.startsWith('http') ?
              <div className='flex flex-col shadow-lg p-2 rounded-lg gap-1' key={index}>
                <Image
                  key={index}
                  src={sponsor}
                  alt={sponsor}
                  width={100}
                  height={50}
                  className='rounded-md w-24 h-12 object-contain'
                />
                <Button size={"sm"} variant="destructive" onClick={() => {
                  const newSponsors = [...(item.sponsors || [])]
                  newSponsors.splice(index, 1)
                  onChange({ ...item, sponsors: newSponsors })
                }}>Remove</Button>
              </div>
              : <div className='grid grid-cols-1 gap-2 w-full flex-col shadow-lg p-2 rounded-lg' key={index}>
                <div className='w-full h-12 bg-gray-100 rounded-md flex gap-2 items-center justify-center'>
                  <Input
                    value={sponsor}
                    onChange={(e) => {
                      const newSponsors = [...(item.sponsors || [])]
                      newSponsors[index] = e.target.value
                      onChange({ ...item, sponsors: newSponsors })
                    }}
                  />
                  <Button size={"sm"} variant="destructive" onClick={() => {
                    const newSponsors = [...(item.sponsors || [])]
                    newSponsors.splice(index, 1)
                    onChange({ ...item, sponsors: newSponsors })
                  }}>Remove</Button>
                </div>
              </div>
          ))}
        </div>
        {/*  add named sponsors */}
        <Button size={"sm"} onClick={() => {
          onChange({ ...item, sponsors: [...(item.sponsors || []), 'Sponsor name'] })
        }}>Add Named Sponsor</Button>
      </div>


      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-speakers"
            checked={showSpeakers}
            onCheckedChange={(isChecked) => {
              setShowSpeakers(isChecked)
              // onChange({ ...item, speakers: [] })
              if (!isChecked) {
                onChange({ ...item, removedData: { ...(item?.removedData || {}), speakers: item.speakers }, speakers: [] })
              } else {
                onChange({ ...item, speakers: item?.removedData?.speakers || [], removedData: { ...(item?.removedData || {}), speakers: [] } })
              }
            }}
          />
          <Label htmlFor="show-speakers">Add Speakers</Label>
        </div>
        {showSpeakers && (
          <div className="space-y-4">
            {item?.speakers?.map((speaker, index) => (
              <SpeakerForm
                key={index}
                speaker={speaker}
                onChange={(updatedSpeaker) => {
                  const newSpeakers = [...(item.speakers || [])]
                  newSpeakers[index] = updatedSpeaker
                  onChange({ ...item, speakers: newSpeakers })
                }}
                onRemove={() => {
                  const newSpeakers = [...(item.speakers || [])]
                  newSpeakers.splice(index, 1)
                  onChange({ ...item, speakers: newSpeakers })
                }}
              />
            ))}
            <Button onClick={() => onChange({ ...item, speakers: [...(item.speakers || []), { name: '', bio: '' }] })}>Add Speaker</Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-host"
            checked={showHost}
            onCheckedChange={(isChecked) => {
              setShowHost(isChecked)
              // onChange({ ...item, host: undefined })
              if (!isChecked) {
                onChange({ ...item, removedData: { ...(item?.removedData || {}), host: item?.host }, host: undefined })
              } else {
                onChange({ ...item, host: item?.removedData?.host || undefined, removedData: { ...(item?.removedData || {}), host: undefined } })
              }
            }}
          />
          <Label htmlFor="show-host">Add Host</Label>
        </div>
        {showHost && item.host && (
          <SpeakerForm
            speaker={item.host}
            onChange={(updatedHost) => onChange({ ...item, host: updatedHost })}
            onRemove={() => onChange({ ...item, host: undefined })}
          />
        )}
        {showHost && !item.host && (
          <Button onClick={() => onChange({ ...item, host: { name: '', bio: '' } })}>Add Host</Button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-facilitators"
            checked={showFacilitators}
            onCheckedChange={(isChecked) => {
              setShowFacilitators(isChecked)
              if (!isChecked) {
                onChange({ ...item, removedData: { ...(item?.removedData || {}), facilitators: item.facilitators }, facilitators: [] })
              } else {
                onChange({ ...item, facilitators: item?.removedData?.facilitators || [], removedData: { ...(item?.removedData || {}), facilitators: [] } })
              }
            }}
          />
          <Label htmlFor="show-facilitators">Add Facilitators</Label>
        </div>
        {showFacilitators && (
          <div className="space-y-4">
            {item.facilitators?.map((facilitator, index) => (
              <SpeakerForm
                key={index}
                speaker={facilitator}
                onChange={(updatedFacilitator) => {
                  const newFacilitators = [...(item.facilitators || [])]
                  newFacilitators[index] = updatedFacilitator
                  onChange({ ...item, facilitators: newFacilitators })
                }}
                onRemove={() => {
                  const newFacilitators = [...(item.facilitators || [])]
                  newFacilitators.splice(index, 1)
                  onChange({ ...item, facilitators: newFacilitators })
                }}
              />
            ))}
            <Button onClick={() => onChange({ ...item, facilitators: [...(item.facilitators || []), { name: '', bio: '' }] })}>Add Facilitator</Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-moderators"
            checked={showModerators}
            onCheckedChange={(isChecked) => {
              setShowModerators(isChecked)
              // move moderators to removed data if unchecked
              if (!isChecked) {
                onChange({ ...item, removedData: { ...(item?.removedData || {}), moderators: item.moderators }, moderators: [] })
              } else {
                onChange({ ...item, moderators: item?.removedData?.moderators || [], removedData: { ...(item?.removedData || {}), moderators: [] } })
              }

            }}
          />
          <Label htmlFor="show-moderators">Add Moderators</Label>
        </div>
        {showModerators && (
          <div className="space-y-4">
            {item.moderators?.map((moderator, index) => (
              <SpeakerForm
                key={index}
                speaker={moderator}
                onChange={(updatedModerator) => {
                  const newModerators = [...(item.moderators || [])]
                  newModerators[index] = updatedModerator
                  onChange({ ...item, moderators: newModerators })
                }}
                onRemove={() => {
                  const newModerators = [...(item.moderators || [])]
                  newModerators.splice(index, 1);
                  onChange({ ...item, moderators: newModerators })
                }}
              />
            ))}
            <Button onClick={() => onChange({ ...item, moderators: [...(item.moderators || []), { name: '', bio: '' }] })}>Add Moderator</Button>
          </div>
        )}
      </div>
      <Button variant="destructive" onClick={onRemove}>Remove Timeline Item</Button>
    </div>
  )
}

export function ConferenceScheduleForm(
  { onChange, scheduleDay }: { onChange: (data: ConferenceScheduleProps) => void, scheduleDay?: ConferenceScheduleProps }
) {
  const [schedule, setSchedule] = useState<ConferenceScheduleProps>(scheduleDay || {
    day: '',
    title: '',
    timeLineItems: []
  })

  useEffect(() => {
    onChange(schedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log(JSON.stringify(schedule, null, 2))
  }
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newItems = [...schedule.timeLineItems]
    const [removed] = newItems.splice(oldIndex, 1)
    newItems.splice(newIndex, 0, removed)
    setSchedule({ ...schedule, timeLineItems: newItems })
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* <h1 className="text-3xl font-bold">Conference Schedule Form</h1> */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            value={schedule.day}
            onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={schedule.title}
            onChange={(e) => setSchedule({ ...schedule, title: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Timeline Items</h2>
          <Button onClick={() => setSchedule({ ...schedule, timeLineItems: [...schedule.timeLineItems, {}] })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Timeline Item
          </Button>
        </div>
        <Accordion
          type="single"
          collapsible

        >
          <SortableList
            onSortEnd={onSortEnd}
          // lockAxis="y"
          // allowDrag={false}
          >
            {schedule?.timeLineItems?.map((item, index) => (
              <SortableItem
                key={index}>
                <AccordionItem value={`${index}`} className='hover:bg-primary-purple/5 hover:shadow-md rounded-md px-2'>
                  <AccordionTrigger className='decoration-transparent flex justify-start'>
                    <div className="flex cursor-grab items-center mr-2">
                      <SortableKnob>
                        <GripVertical className="w-4 h-4" />
                      </SortableKnob>
                    </div>
                    <div className="flex items-center justify-between bg-primary-main rounded-2xl p-1">
                      <h3 className="text-xs px-1 text-white font-semibold">{`Timeline (${item?.time || (index + 1)})`}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TimelineItemForm
                      item={item}
                      onChange={(updatedItem) => {
                        const newItems = [...schedule.timeLineItems]
                        newItems[index] = updatedItem
                        setSchedule({ ...schedule, timeLineItems: newItems })
                      }}
                      onRemove={() => {
                        const newItems = [...schedule.timeLineItems]
                        newItems.splice(index, 1)
                        setSchedule({ ...schedule, timeLineItems: newItems })
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </SortableItem>
            ))}
          </SortableList>
        </Accordion>
      </div>
    </form>
  )
}

// list of conference schedule forms
export function ConferenceScheduleForms({ schedules, onChange }: { schedules: ConferenceScheduleProps[], onChange: (schedules: ConferenceScheduleProps[]) => void }) {
  return (
    <div className="px-4 max-w-4xl mx-auto">
      <div className="px-8 py-4 flex justify-between items-center sticky z-20 top-0 bg-white w-full">
        <h1 className="text-xl font-bold">Daily Schedules</h1>
        <Button size={"sm"} onClick={() => onChange([...schedules, { day: '', title: '', timeLineItems: [] }])}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>
      <div className="space-y-8">
        <Accordion type="single" collapsible>
          {schedules.map((schedule, index) => (
            <AccordionItem key={`day-key-${index}`} value={`${index}`} className='shadow-sm rounded-md hover:bg-primary-main/5 pr-4 my-4'>
              <AccordionTrigger className='cursor-pointer w-full decoration-transparent hover:decoration-transparent'>
                <div className="flex items-center md:px-4 justify-between">
                  <h2 className="text-md font-semibold text-white rounded-3xl px-2 py-1 bg-primary-main">{schedule?.day || `Day ${schedules?.length}`}</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ConferenceScheduleForm
                  scheduleDay={schedule}
                  onChange={(data) => {
                    const newSchedules = [...schedules]
                    newSchedules[index] = data
                    onChange(newSchedules)
                  }}
                />
                {/* remove */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    const newSchedules = [...schedules]
                    newSchedules.splice(index, 1)
                    onChange(newSchedules)
                  }}
                > Remove Schedule</Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}