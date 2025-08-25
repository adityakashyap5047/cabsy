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
import TimePicker from "./TimePicker";

export default function RidePage() {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("");

  console.log("Selected Date:", time);
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Add Ride Details</h1>

      <form className="space-y-6">
        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="service">Select Service Type</Label>
          <Select>
            <SelectTrigger id="service">
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

        {/* Pick-up Date */}
        <div className="space-y-2">
          <Label>Pick-Up Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
              
        <TimePicker />
        {/* Pick-up Time */}
        <div className="space-y-2">
          <Label>Pick-Up Time</Label>
          <Select onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 * 2 }).map((_, i) => {
                const hour = Math.floor(i / 2);
                const minute = i % 2 === 0 ? "00" : "30";
                const label = `${String(hour).padStart(2, "0")}:${minute}`;
                return (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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

        {/* Submit */}
        <Button type="submit" className="w-full">
          Select Vehicle
        </Button>
      </form>
    </div>
  );
}