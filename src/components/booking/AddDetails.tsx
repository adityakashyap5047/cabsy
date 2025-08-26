"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimeKeeper from "react-timekeeper";

export default function AddDetails() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [time, setTime] = React.useState<string>(() => {
    // Set current time as default
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? ' PM' : ' AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${ampm}`;
  });
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Add Ride Details</h1>

      <form className="space-y-6">
        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="service">Select Service Type</Label>
          <Select>
            <SelectTrigger className="w-full" id="service">
              <SelectValue placeholder="Choose a service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="from-airport">From Airport</SelectItem>
              <SelectItem value="to-airport">To Airport</SelectItem>
              <SelectItem value="point-to-point">Point-to-Point</SelectItem>
              <SelectItem value="hourly">Hourly Car Service</SelectItem>
              <SelectItem value="wedding">Wedding Car Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full gap-2">
          {/* Pick-up Date */}
          <div className="space-y-2 w-1/2">
            <Label>Pick-Up Date</Label>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  onClick={() => setShowDatePicker(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setShowDatePicker(false);
                    }
                  }}
                  startMonth={new Date()}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  fromDate={new Date()} // Disable navigation to previous months/years
                  toDate={new Date(new Date().getFullYear() + 2, 11, 31)} // Allow up to 2 years in future
                  captionLayout="label"
                  initialFocus
                  required
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Pick-up Time */}
          <div className="space-y-2 w-1/2">
            <Label>Pick-Up Time</Label>
            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowTimePicker(true)}
                >
                  <span className="mr-2">🕐</span>
                  {time}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <TimeKeeper
                  time={time}
                  onChange={(newTime) => {
                    const timeWithUpperCase = newTime.formatted12.replace(/am|pm/gi, (match) => match.toUpperCase());
                    setTime(timeWithUpperCase);
                  }}
                  onDoneClick={() => setShowTimePicker(false)} // Close on done
                  switchToMinuteOnHourSelect
                  closeOnMinuteSelect
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-2">
          <Label htmlFor="pickup">Pick-Up Location</Label>
          <Input id="pickup" placeholder="Your pick-up location" />
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2">
          <Label htmlFor="dropoff">Drop-Off Location</Label>
          <Input id="dropoff" placeholder="Your drop-off location" />
        </div>

        {/* Passengers & Luggage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="passengers">Number of Passengers</Label>
            <Input id="passengers" type="number" defaultValue={1} min={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="luggage">Luggage Count</Label>
            <Input id="luggage" type="number" defaultValue={0} min={0} />
          </div>
        </div>

        {/* Return Trip */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="returnTrip"
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <Label htmlFor="returnTrip">Return Trip Required</Label>
          </div>
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Select Vehicle
        </Button>
      </form>
    </div>
  );
}