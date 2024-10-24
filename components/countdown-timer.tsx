'use client'

import React, { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return timeLeft
  }
  function getLabel(interval: string, value: number) {
    switch (interval) {
      case 'days':
        return value === 1 ? 'day' : 'days'
      case 'hours':
        return value === 1 ? 'hr' : 'hrs'
      case 'minutes':
        return value === 1 ? 'min' : 'mins'
      case 'seconds':
        return value === 1 ? 'sec' : 'secs'
      default:
        return ''
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timeComponents = Object.keys(timeLeft)?.map((interval) => {

    // if (!timeLeft[interval as keyof typeof timeLeft]) {
    //   return null
    // }

    return (
      <div key={interval} className="flex flex-col items-center mt-5">
        <p
          // style={{
          //   fontSize: 'clamp(2.5rem,5vw,5.5rem)'
          // }}
          className="md:font-black font-extrabold text-4xl md:text-7xl text-[#762877]">
          {(timeLeft[interval as keyof typeof timeLeft] as any)?.toString()?.padStart(2, '0')}
        </p>
        <span
          className="uppercase text-base text-primary-main mt-2 font-normal">
          {/* {interval === 'hours' ? 'Hr' : interval.slice(0, 3)} {interval} */}
          {getLabel(interval, timeLeft[interval as keyof typeof timeLeft] as number)}
        </span>
      </div>
    )
  })

  return (
    <div className="flex justify-center items-center">
      <div className="flex space-x-9 md:space-x-24">
        {timeComponents}
      </div>
    </div>
  )
}

export function CountdownTimer() {
  // Set the target date to 12 days from now
  const targetDate = new Date("2024-11-03T17:00:00")

  return <Countdown targetDate={targetDate} />
}