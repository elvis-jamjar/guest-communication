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

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timeComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return null
    }

    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="md:text-6xl text-4xl font-bold text-purple-950">
          {(timeLeft[interval as keyof typeof timeLeft] as any)?.toString()?.padStart(2, '0')}
        </span>
        <span className="text-sm uppercase text-primary-main font-semibold mt-2">
          {interval === 'hours' ? 'Hrs' : interval.slice(0, 3)}
        </span>
      </div>
    )
  })

  return (
    <div className="flex justify-center items-center">
      <div className="flex space-x-8">
        {timeComponents}
      </div>
    </div>
  )
}

export function CountdownTimer() {
  // Set the target date to 12 days from now
  const targetDate = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)

  return <Countdown targetDate={targetDate} />
}