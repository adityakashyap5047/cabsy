"use client"
import { useState } from "react"
import TimeKeeper from "react-timekeeper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TimePicker() {
  const [time, setTime] = useState("12:00pm")
  const [is24Hour, setIs24Hour] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 shadow-xl rounded-2xl w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            Select Time
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <TimeKeeper
            time={time}
            onChange={(newTime) => setTime(newTime.formatted12)}
            switchToMinuteOnHourSelect
            hour24Mode={is24Hour}
          />
          <div className="mt-4 flex gap-3 items-center">
            <span className="text-gray-600">24h Mode</span>
            <input
              type="checkbox"
              checked={is24Hour}
              onChange={() => setIs24Hour(!is24Hour)}
              className="toggle-checkbox cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
