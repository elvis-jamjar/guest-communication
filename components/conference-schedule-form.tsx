'use client';;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from '@/lib/utils';
import {
  ColorType,
  ConferenceScheduleData,
  ConferenceScheduleProps,
  FontWeight,
  QuickLinkData,
  Speaker,
  TimelineItemProps,
} from '@/types';
import { GripVertical, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { ReusableAnimatedAccordion } from './animated-accordion';
import ImageCropper from './ImageCropper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';


const SpeakerForm = ({ speaker, onChange, onRemove, title }: { speaker: Speaker, onChange: (speaker: Speaker) => void, onRemove: () => void, title: string }) => (
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
    <div className='flex-col'>
      {/* upload speaker image */}
      <ImageCropper
        btnTitle={`Upload ${title} photo`}
        onCompleteUpload={(url) => onChange({ ...speaker, photo: url })}
      />
      {speaker?.photo && <div className="flex items-center flex-col space-y-2 py-2 gap-2">
        <div className="flex w-24 h-24 bg-white rounded-full items-center gap-2">
          <Image src={speaker?.photo} priority alt={speaker?.name} width={200} height={200} className="rounded-full w-full h-full object-cover" />
        </div>
        <Button size={"sm"} onClick={() => onChange({ ...speaker, photo: '' })}>Remove {title} photo</Button>
      </div>}
    </div>
    {/* toggle to display speaker on page */}
    <div className="flex items-center space-x-2">
      <Switch
        id="is-displayed"
        checked={speaker?.visibleOnPage}
        onCheckedChange={(checked) => onChange({ ...speaker, visibleOnPage: checked })}
      />
      <Label htmlFor="is-displayed">Display {title}</Label>
    </div>
    <Button variant="destructive" onClick={onRemove}>Remove {title}</Button>
  </div>
)

function FontWeightSelector({ value, onChange, title }: { value?: FontWeight, onChange: (value: FontWeight) => void, title: string }) {

  return (
    <SelectGroup>
      <SelectLabel>{title}</SelectLabel>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as FontWeight)}>
        <SelectTrigger>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="font-mono" className='border-l-2 font-mono'>Mono</SelectItem>
          <SelectItem value="font-thin" className='border-l-2 my-1 font-thin'>Thin</SelectItem>
          <SelectItem value="font-normal" className='border-l-2 my-1 font-normal'>Normal</SelectItem>
          <SelectItem value="font-medium" className='border-l-2 my-1 font-medium'>Medium</SelectItem>
          <SelectItem value="font-bold" className='border-l-2 my-1 font-bold'>Bold</SelectItem>
        </SelectContent>
      </Select>
    </SelectGroup>
  )
}

function TextColorSelector({ value, onChange, title }: { value?: ColorType, onChange: (value: ColorType) => void, title: string }) {

  return (
    <SelectGroup className='space-y-2'>
      <SelectLabel>{title}</SelectLabel>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as ColorType)}>
        <SelectTrigger>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text-primary-main" className='border-l-2 border-l-primary-main text-primary-main hover:text-primary-main'>Primary</SelectItem>
          <SelectItem value="text-secondary-main" className='border-l-2 my-1 border-l-secondary-main hover:text-secondary-main'>Secondary</SelectItem>
          <SelectItem value="text-black" className='border-l-2 my-1 text-black hover:text-black'>Black</SelectItem>
        </SelectContent>
      </Select>
    </SelectGroup>
  )
}

// quik link form QuickLinkData
export function QuickLinksForm({ data, onChnage }: { data: QuickLinkData, onChnage: (data: QuickLinkData) => void }) {

  return (
    <div className="space-y-8 p-4 border rounded-md">
      <div className='space-y-2 flex-col'>
        <Input
          placeholder="Links Section Title"
          value={data?.title}
          onChange={(e) => onChnage({ ...data, title: e.target.value })}
        />
        <TextColorSelector
          title='Title color'
          value={data?.style?.title?.color}
          onChange={(value) => onChnage({ ...data, style: { ...data?.style, title: { ...data?.style?.title, color: value } } })}
        />
        <FontWeightSelector
          title='Font weight'
          value={data?.style?.title?.fontWeights}
          onChange={(value) => onChnage({
            ...data, style: {
              ...data.style,
              title: { ...data.style?.title, fontWeights: value }
            }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label>Links</Label>
        <div className="grid grid-cols-1 gap-12">
          {data?.links?.map((link, index) => (
            <div key={index} className="flex flex-col items-center gap-6">
              <Input
                placeholder='Link Title'
                value={link?.title}
                onChange={(e) => {
                  const newLinks = [...(data.links || [])]
                  newLinks[index] = { ...link, title: e.target.value }
                  onChnage({ ...data, links: newLinks })
                }}
              />
              {/* description */}
              <Textarea
                placeholder="Description"
                value={link?.description}
                className='h-52'
                onChange={(e) => {
                  const newLinks = [...(data.links || [])]
                  newLinks[index] = { ...link, description: e.target.value }
                  onChnage({ ...data, links: newLinks })
                }}
              />
              {/* links */}
              <Input
                placeholder="Link"
                type='url'
                value={link?.link}
                onChange={(e) => {
                  const newLinks = [...(data.links || [])]
                  newLinks[index] = { ...link, link: e.target.value }
                  onChnage({ ...data, links: newLinks })
                }}
              />
              {/* button label */}
              <Input
                placeholder="Button Label"
                value={link?.buttonLabel}
                onChange={(e) => {
                  const newLinks = [...(data.links || [])]
                  newLinks[index] = { ...link, buttonLabel: e.target.value }
                  onChnage({ ...data, links: newLinks })
                }}
              />
              <Button className='self-start' size={"sm"} variant="destructive" onClick={() => {
                const newLinks = [...(data.links || [])]
                newLinks.splice(index, 1)
                onChnage({ ...data, links: newLinks })
              }}>Remove</Button>
            </div>
          ))}
        </div>
        <Button size={"lg"} className='w-full' onClick={() => onChnage({
          ...data, links: [...(data?.links || []), { link: '' }]
        })}>Add Link</Button>
      </div>
    </div>
  )
}

const TimelineItemForm = ({ item, onChange, onRemove }: { item: TimelineItemProps, onChange: (item: TimelineItemProps) => void, onRemove: () => void }) => {
  const [showSpeakers, setShowSpeakers] = useState(Number(item.speakers?.length) > 0)
  const [showHost, setShowHost] = useState(!!item.host)
  const [showFacilitators, setShowFacilitators] = useState(Number(item.facilitators?.length) > 0)
  const [showModerators, setShowModerators] = useState(Number(item.moderators?.length) > 0);

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className='space-y-2'>
        <Label htmlFor="time">Time</Label>
        <Input
          placeholder="Time(eg. 10:00 AM)"
          value={item.time}
          onChange={(e) => onChange({ ...item, time: e.target.value })}
        />
        <TextColorSelector
          title='Time color'
          value={item?.color?.time}
          onChange={(value) => onChange({ ...item, color: { ...item?.color, time: value } })}
        />
      </div>

      <div className='space-y-2 hidden'>
        <Input
          placeholder="Section Title"
          value={item.sectionTitle}
          onChange={(e) => onChange({ ...item, sectionTitle: e.target.value })}
        />
        <TextColorSelector
          title='Section Title color'
          value={item?.color?.sectionTitle}
          onChange={(value) => onChange({ ...item, color: { ...item?.color, sectionTitle: value } })}
        />
      </div>
      <Input
        placeholder="Title"
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
      />
      <TextColorSelector
        title='Title color'
        value={item?.color?.title}
        onChange={(value) => onChange({ ...item, color: { ...item?.color, title: value } })}
      />
      <FontWeightSelector
        title='Title font weight'
        value={item?.fontWeights?.title}
        onChange={(value) => onChange({ ...item, fontWeights: { ...item.fontWeights, title: value } })}
      />
      <Textarea
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      />
      <TextColorSelector
        title='Description color'
        value={item?.color?.description}
        onChange={(value) => onChange({ ...item, color: { ...item?.color, description: value } })}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is-track"
          checked={item.isTrack}
          onCheckedChange={(checked) => onChange({ ...item, isTrack: checked })}
        />
        <Label htmlFor="is-track">
          Bullet Point
        </Label>
      </div>
      {/* {
        <div className='flex items-center space-x-2'>
          <Input
            placeholder="Track Label"
            value={item.trackLabel}
            onChange={(e) => onChange({ ...item, trackLabel: e.target.value })}
          />
        </div>
         :
          <Select
            value={item.icon}
            onValueChange={(value) => onChange({ ...item, icon: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Icon" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(icons)?.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  <div className='flex items-center gap-1'>
                    {icons[icon as keyof typeof icons]}
                    <span className='capitalize'>{icon}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      } */}
      {/* <Select
        value={item?.iconColor}
        onValueChange={(value) => onChange({ ...item, iconColor: value as "bg-secondary-main" | "bg-primary-main" })}>
        <SelectTrigger>
          <SelectValue placeholder="Track & Icon color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bg-primary-main" className='border-l-2 border-l-primary-main text-primary-main hover:text-primary-main'>Primary</SelectItem>
          <SelectItem value="bg-secondary-main" className='border-l-2 my-1 border-l-secondary-main hover:text-secondary-main'>Secondary</SelectItem>
        </SelectContent>
      </Select> */}
      {/* <div className="flex items-center space-x-2">
        <Switch
          id="hide-line"
          checked={item.hideLine}
          onCheckedChange={(checked) => onChange({ ...item, hideLine: checked })}
        />
        <Label htmlFor="hide-line">Hide Line</Label>
      </div> */}
      {/* <div className="flex items-center space-x-2">
        <Switch
          id="is-first"
          checked={item.isFirst}
          onCheckedChange={(checked) => onChange({ ...item, isFirst: checked })}
        />
        <Label htmlFor="is-first">Is First</Label>
      </div> */}
      <div className="space-y-2 hidden">
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

      <div className="space-y-2 hidden">
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
        <div className="flex  items-center flex-wrap gap-2">
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
        {/* <Button size={"sm"} onClick={() => {
          onChange({ ...item, sponsors: [...(item.sponsors || []), 'Sponsor name'] })
        }}>Add Named Sponsor</Button> */}
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
                title='Speaker'
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
            title='Host'
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
                title='Facilitator'
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
                title='Moderator'
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
        <div className='space-y-2'>
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            value={schedule.day}
            onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
          />
          {/* color */}
          <Select
            value={schedule?.color?.day}
            onValueChange={(value) => setSchedule({ ...schedule, color: { ...schedule.color, day: value as ColorType } })}>
            <SelectTrigger>
              <SelectValue placeholder="Day color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-primary-main" className='border-l-2 border-l-primary-main text-primary-main hover:text-primary-main'>Primary</SelectItem>
              <SelectItem value="text-secondary-main" className='border-l-2 my-1 border-l-secondary-main hover:text-secondary-main'>Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={schedule.title}
            onChange={(e) => setSchedule({ ...schedule, title: e.target.value })}
          />
          {/* color */}
          <Select
            value={schedule?.color?.dayTitle}
            onValueChange={(value) => setSchedule({ ...schedule, color: { ...schedule.color, dayTitle: value as ColorType } })}>
            <SelectTrigger>
              <SelectValue placeholder="Title color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-primary-main" className='border-l-2 border-l-primary-main text-primary-main hover:text-primary-main'>Primary</SelectItem>
              <SelectItem value="text-secondary-main" className='border-l-2 my-1 border-l-secondary-main hover:text-secondary-main'>Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timeline Items</h2>
          <Button onClick={() => setSchedule({ ...schedule, timeLineItems: [...schedule.timeLineItems, {}] })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Timeline
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
                <AccordionItem value={`${index}`} className='hover:bg-secondary-main/5 hover:shadow-md rounded-md px-2'>
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
export function ConferenceScheduleForms({ scheduleData, onChange }: { scheduleData: ConferenceScheduleData, onChange: (schedules: ConferenceScheduleData) => void }) {
  return (
    <div className="px-4 max-w-4xl mx-auto">
      <div className="px-8 py-4 flex justify-between items-center sticky z-20 top-0 bg-white w-full">
        <h1 className="text-xl font-bold">Daily Schedules</h1>
        <Button size={"sm"} onClick={() => onChange({
          ...scheduleData,
          schedule: [...(scheduleData?.schedule || []), { day: `Day ${Number(scheduleData?.schedule?.length || 0) + 1}`, title: '', timeLineItems: [] }]
        })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>
      {/* event live mode toggle */}
      <div className="flex items-center space-x-2 p-4">
        <Switch
          id="is-live"
          checked={scheduleData?.isEventStarted}
          onCheckedChange={(checked) => onChange({ ...scheduleData, isEventStarted: checked })}
        />
        <Label htmlFor="is-live"
          className='text-sm font-bold'>
          Event started
        </Label>
      </div>
      <div className="space-y-8">
        <Accordion type="single" collapsible>
          {scheduleData?.schedule?.map((schedule, index) => (
            <AccordionItem key={`day-key-${index}`} value={`${index}`} className='shadow-sm rounded-md hover:bg-primary-main/5 pr-4 my-4'>
              <AccordionTrigger className='cursor-pointer w-full decoration-transparent hover:decoration-transparent'>
                <div className="flex items-center md:px-4 justify-between">
                  <h2 className="text-md font-semibold text-white rounded-3xl px-2 py-1 bg-primary-main">{schedule?.day || `Day ${Number(scheduleData?.schedule?.length || 1)}`}</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ConferenceScheduleForm
                  scheduleDay={schedule}
                  onChange={(data) => {
                    const newSchedules = [...scheduleData.schedule]
                    newSchedules[index] = data
                    onChange({ ...scheduleData, schedule: newSchedules })
                  }}
                />
                {/* remove */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    const newSchedules = [...scheduleData.schedule]
                    newSchedules.splice(index, 1)
                    onChange({ ...scheduleData, schedule: newSchedules })
                  }}
                > Remove Schedule</Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div>
        <ReusableAnimatedAccordion
          className='rounded-none'
          items={[
            {
              title: <h2 className='text-left'>{"Quick Links"}</h2>,
              className: 'p-5 md:px-2 md:pr-10 round-b-none rounded-sm justify-between',
              iconClassName: 'size-5',
              children: (<QuickLinksForm
                data={scheduleData?.quickLinkData || {}}
                onChnage={(data) => onChange({ ...scheduleData, quickLinkData: data })}
              />)
            }
          ]}
        />

      </div>
    </div>
  )
}


// update speakers images and toggle whether to display them or not on the website
// export function SpeakerImageUpdater(
//   { schedules, onChange }: { schedules: ConferenceScheduleProps[], onChange: (schedules: ConferenceScheduleProps[]) => void }
// ) {

//   const [schedulesData, setSchedulesData] = useState<ConferenceScheduleProps[]>(schedules)
//   if (!schedulesData) return null
//   useEffect(() => {
//     setSchedulesData(schedulesData)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [schedules])
//   // console.log(schedulesData)

//   return (
//     <div className="px-4 max-w-4xl mx-auto">
//       <div className='grid grid-cols-1 gap-2'>
//         {schedulesData?.map((schedule, sIndex, _shecdules) => (
//           <div key={sIndex} className="space-y-4 p-4 border rounded-md h-fit">
//             <h2 className="text-lg font-semibold">{schedule?.day}</h2>
//             <div className="space-y-4">
//               {schedule?.timeLineItems?.map((item, tInx, _timeLines) => (
//                 <div key={tInx} className="space-y-4 p-4 grid grid-cols-3 rounded-md">
//                   {/* <h3 className="text-md font-semibold">Timeline {tInx + 1}</h3>
//                   <div className="space-y-4"> */}
//                   {item?.speakers?.map((speaker, spIndex, _speakers) => (
//                     <div key={spIndex} className="flex-col flex justify-center items-center space-y-2">
//                       <h4 className="text-lg font-semibold">{speaker?.name?.replace(":", '')}</h4>
//                       <div className="flex w-28 h-28 items-center justify-center space-x-4">
//                         <Image
//                           src={speaker?.photo || 'https://picsum.photos/id/237/200/300'}
//                           alt={speaker?.name}
//                           width={200}
//                           height={200}
//                           className="w-full h-full object-cover rounded-full"
//                         />
//                       </div>
//                       <UploadButton
//                         endpoint="imageUploader"
//                         appearance={{
//                           button: 'w-12 max-w-20 h-8 text-xs font-semibold rounded-md bg-primary-main text-white',
//                         }}
//                         config={{
//                           mode: "auto",
//                           appendOnPaste: true
//                         }}
//                         onClientUploadComplete={(res) => {
//                           const urls = res.map((r) => r.url)
//                           // Do something with the response.
//                           // update the speaker data with the new image url
//                           const newSpeakers = [..._speakers]
//                           newSpeakers[spIndex] = { ...speaker, photo: urls[0] }
//                           const _newTimeLines = [..._timeLines]
//                           // update speakers in timeline
//                           _newTimeLines[tInx] = { ...item, speakers: newSpeakers }
//                           // update the schedule with the new timeline
//                           const newSchedules = [..._shecdules]
//                           newSchedules[sIndex] = { ...schedule, timeLineItems: _newTimeLines }
//                           onChange({ ...newSchedules })
//                         }}
//                         onUploadError={(error: Error) => {
//                           // Do something with the error.
//                           alert(`ERROR! ${error?.message}`);
//                         }}
//                       />
//                       <div className="flex items-center space-x-4">
//                         <Switch
//                           id="show-speaker"
//                           checked={speaker?.visibleOnPage}
//                           onCheckedChange={(checked) => {
//                             const newSpeakers = [..._speakers]
//                             newSpeakers[spIndex] = { ...speaker, visibleOnPage: checked }
//                             const _newTimeLines = [..._timeLines]
//                             // update speakers in timeline
//                             _newTimeLines[tInx] = { ...item, speakers: newSpeakers }
//                             // update the schedule with the new timeline
//                             const newSchedules = [..._shecdules]
//                             newSchedules[sIndex] = { ...schedule, timeLineItems: _newTimeLines }
//                             onChange({ ...newSchedules })
//                           }}
//                         />
//                         <Label htmlFor="show-speaker">Display</Label>
//                       </div>
//                     </div>
//                   ))}
//                   {/* </div> */}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }