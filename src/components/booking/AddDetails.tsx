"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, } from "lucide-react";
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
  const [stops, setStops] = React.useState<string[]>([]);

  const handleAddStop = () => {
    setStops(prev => [...prev, '']);
  }

  const handleRemoveStop = (index: number) => {
    setStops(prev => prev.filter((_, i) => i !== index));
  }

  const handleStopChange = (index: number, value: string) => {
    setStops(prev => prev.map((stop, i) => i === index ? value : stop));
  }
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
                  fromDate={new Date()}
                  toDate={new Date(new Date().getFullYear() + 2, 11, 31)}
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
                <PopoverContent className="w-auto p-0" >
                <TimeKeeper
                  time={time}
                  onChange={(newTime) => {
                  const timeWithUpperCase = newTime.formatted12.replace(/am|pm/gi, (match) => match.toUpperCase());
                  setTime(timeWithUpperCase);
                  }}
                  switchToMinuteOnHourSelect
                  closeOnMinuteSelect
                  doneButton={null}
                />
                </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-2">
          <Label htmlFor="pickup">Pick-Up Location</Label>
          <Input id="pickup" placeholder="Your pick-up location" />
          <Button type="button" variant={"primary"} className="flex gap-1 ml-4 cursor-pointer items-center text-[#AE9409] font-semibold text-xs" onClick={handleAddStop}>
            <Plus className="h-4" />
            <span className="hover:underline">Add Stop</span>
          </Button>
          {stops.length > 0 && (
            <div className="space-y-3 px-6">
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={"h-5 w-5 text-gray-600"}
                        >
                          <rect x="10" y="0" width="4" height="6" rx="0.5" />
                          <rect x="10" y="10" width="4" height="4" rx="0.5" />
                          <rect x="10" y="18" width="4" height="6" rx="0.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={stop}
                        onChange={(e) => handleStopChange(index, e.target.value)}
                        placeholder="Add Your Stop"
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleRemoveStop(index)}
                      className="px-2 py-1 hover:text-[#AE9409]"
                    >
                      <Trash2 className="bg-white"/>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border border-yellow-300">
                <strong>Route:</strong> Pickup → {stops.map((_, index) => `Stop ${index + 1}`).join(' → ')} → Dropoff
              </div>
            </div>
          )}
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