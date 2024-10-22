'use client'

import { Card, CardContent } from "@/components/ui/card"

export function EventSchedule() {
  const schedule = [
    {
      day: 1,
      date: "Sunday 3rd November",
      events: [
        { time: "5:00pm", activity: "Attendees arrive at the Protea Hotel Wanderers" },
        { time: "6:00pm", activity: "Attendees convene at the Terrace, Protea Hotel Wanderers" },
        { time: "7:00pm", activity: "Welcome remarks by 4DX Partners" },
        { time: "8:00pm", activity: "Dinner and Cocktails at the Terrace, Protea Hotel Wanderers" },
      ],
    },
    {
      day: 2,
      date: "Monday 4th November",
      events: [
        { time: "9:00am - 10:30am", activity: "Breakfast at the Protea Hotel for hotel guests" },
        {
          time: "10:30am - 10:45 am",
          activity: "Opening remarks",
          speakers: [
            "Walter Baddoo: Co-Founder & General Partner, 4DX Ventures",
            "Peter Orth: Co-Founder & General Partner, 4DX Ventures"
          ]
        },
        {
          time: "10:45am - 11:30 am",
          activity: "From Bootstrapping to Scale: Founder Journey & Lessons Learned",
          speakers: [
            "Olugbenga Agboola: Co-founder & CEO, Flutterwave",
            "Moderated by Walter Baddoo: Co-Founder & General Partner, 4DX Ventures"
          ]
        },
        { time: "11:30am - 11:45am", activity: "Tea / Coffee Break" },
        {
          time: "11:45am - 12:30pm",
          activity: "Emerging Technologies as a Competitive Advantage: The Role of AI & ML",
          speakers: [
            "Pavle Jeremic: Founder & CEO, Aether Biomachines",
            "Chetan Seth: CTO, Autochek",
            "Moderated by Raaid Ahmad: General Partner, 4DX Ventures"
          ]
        },
        { time: "12:30pm - 1:00 pm", activity: "30 minute work break" },
      ],
    },
  ]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        {schedule.map((day, dayIndex) => (
          <div key={day.day} className="mb-8">
            <h2 className="text-2xl font-bold text-teal-600 mb-2">
              Day {day.day}
            </h2>
            <p className="text-orange-500 font-semibold mb-4">{day.date}</p>
            <div className="relative border-l-2 border-gray-200 pl-4">
              {day.events.map((event, eventIndex) => (
                <div key={eventIndex} className="mb-6 relative">
                  <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-orange-500 rounded-full border-4 border-white"></div>
                  <p className="text-orange-500 font-semibold mb-1">{event.time}</p>
                  <p className="font-medium mb-1">{event.activity}</p>
                  {event.speakers && (
                    <ul className="text-sm text-gray-600">
                      {event.speakers.map((speaker, speakerIndex) => (
                        <li key={speakerIndex}>{speaker}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}