"use client";

import * as React from "react";
import { format } from "date-fns";
import { BriefcaseBusinessIcon, Calendar as CalendarIcon, Clock, Minus, Plus, Trash2, Users, MapPin } from "lucide-react";
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
import { useBooking } from "@/context/BookingContext";
import StepHeader from "./StepHeader";

export default function AddDetails() {
  const { state, dispatch } = useBooking();

  const step = 1;
  const { bookingDetails } = state;

  const isCompleted = state.completedSteps.includes(step);
  const isExpanded = state.expandedSteps.includes(step);
  const showSummary = state.summarySteps.includes(step);

  const [serviceType, setServiceType] = React.useState<string>(bookingDetails.serviceType || '');
  const [date, setDate] = React.useState<Date | undefined>(bookingDetails.date);
  const [time, setTime] = React.useState<string | null>(bookingDetails.time);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [stops, setStops] = React.useState<string[]>(bookingDetails.stops || []);
  const [stopError, setStopError] = React.useState<number | null>(null);
  const [justAddedStop, setJustAddedStop] = React.useState<boolean>(false);
  const [pickupLocation, setPickupLocation] = React.useState<string>(bookingDetails.pickupLocation || "");
  const [dropoffLocation, setDropoffLocation] = React.useState<string>(bookingDetails.dropoffLocation || "");
  const [passenger, setPassenger] = React.useState<number>(bookingDetails.passengers || 1);
  const [luggage, setLuggage] = React.useState<number>(bookingDetails.luggage || 0);
  const isEditing = isExpanded && isCompleted;

  React.useEffect(() => {
    if (justAddedStop && stops.length > 0) {
      const timer = setTimeout(() => {
        const newInputs = document.querySelectorAll('input[placeholder="Add Your Stop"]');
        const lastInput = newInputs[newInputs.length - 1] as HTMLInputElement;
        if (lastInput) {
          lastInput.focus();
        }
        setJustAddedStop(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [stops.length, justAddedStop]);

  const handleAddStop = () => {
    if (stops.length > 0 && stops[stops.length - 1].trim() === "") {
      setStopError(stops.length - 1);
      return;
    }

    setStops(prev => [...prev, ""]);
    setStopError(null);
    setJustAddedStop(true); 
  }

  const handleRemoveStop = (index: number) => {
    setStops(prev => prev.filter((_, i) => i !== index));
    setStopError(null);
  }

  const handleStopChange = (index: number, value: string) => {
    setStops(prev => prev.map((stop, i) => i === index ? value : stop));
    if (stopError === index && value.trim() !== "") {
      setStopError(null);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation.trim() || !dropoffLocation.trim()) {
      alert('Please fill in both pickup and drop-off locations');
      return;
    }
    
    dispatch({
      type: "UPDATE_BOOKING_DETAILS",
      payload: {
        serviceType,
        date,
        time,
        pickupLocation,
        stops,
        dropoffLocation,
        passengers: passenger,
        luggage,
      }
    });
    
    dispatch({ type: "COMPLETE_STEP", payload: step });
    dispatch({ type: "TOGGLE_STEP", payload: step });
    
    setTimeout(() => {
      if (!showSummary) {
        dispatch({ type: "TOGGLE_SUMMARY", payload: step });
      }
      dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 1 });
    }, 100);
  };

  const handleEdit = () => {
    dispatch({ type: "COLLAPSE_AFTER_STEP", payload: step });
    if(!isExpanded) dispatch({ type: "TOGGLE_STEP", payload: step });
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: "TOGGLE_SUMMARY", payload: step });
    }
  };

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-y-3">
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700">
            {date && format(date, "MM/dd/yyyy")} {time}
          </span>
        </div>
        <div className="flex gap-4">
          <div>
            <span className="font-semibold text-gray-600">Passenger:</span>{' '}
            <span className="text-gray-700">{passenger}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Luggage:</span>{' '}
            <span className="text-gray-700">{luggage}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          <span className="text-green-400 font-semibold">{pickupLocation}</span>
        </div>
        {
          stops && stops?.length > 0 && stops.map((stop, idx) => (
            <div key={idx} className="flex ml-4 items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
              <span className="text-yellow-400 font-semibold">{stop}</span>
            </div>
          ))
        }
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
          <span className="text-red-400 font-semibold">{dropoffLocation}</span>
        </div>
      </div>
      <div className="">
        {/* <span>{serviceType}</span> */}
        <h1 className="text-xl font-semibold text-gray-600">
        Estimated Fare: <span className="text-yellow-600 text-sm font-semibold">$124.50</span>
      </h1>
      </div>
    </div>
  );

  return (
    <div>
      <StepHeader
        stepNumber={step}
        title="Ride Info"
        isCompleted={isCompleted}
        showSummary={showSummary}
        isEditing={isEditing}
        onToggleSummary={handleToggleSummary}
        onEdit={handleEdit}
        summary={summary}
      />
      
      <div 
        className="overflow-hidden transition-all duration-900 ease-in-out"
        style={{
          maxHeight: isExpanded ? '5000px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="p-6 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-16 max-md:flex-col">
              <div className="space-y-6 w-1/2">
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="w-full rounded-none cursor-pointer" id="service">
                      <SelectValue placeholder="Choose a service type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="from-airport">From Airport</SelectItem>
                      <SelectItem value="to-airport">To Airport</SelectItem>
                      <SelectItem value="point-to-point">Point-to-Point</SelectItem>
                      <SelectItem value="hourly">Hourly Car Service</SelectItem>
                      <SelectItem value="wedding">Wedding Car Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full gap-2">
                  <div className="space-y-2 w-1/2">
                    <Label>Pick-Up Date</Label>
                    <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="primary"
                          className={cn(
                            `w-full ${!date ? "justify-end cursor-text" : "justify-between cursor-pointer"} border rounded-none text-left font-normal`
                          )}
                          onClick={() => {
                            if (!date) {
                              setDate(new Date());
                            }
                            setShowDatePicker(true);
                          }}
                        >
                          {date && format(date, "MM/dd/yyyy")}
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                  <div className="space-y-2 w-1/2">
                    <Label>Pick-Up Time</Label>
                    <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="primary"
                          className={`w-full border rounded-none ${!time ? "cursor-text justify-end" : "cursor-pointer justify-between"} text-left font-normal`}
                          onClick={() => 
                            {
                              if(!time){
                                const now = new Date();
                                const hours = now.getHours();
                                const minutes = now.getMinutes();
                                const ampm = hours >= 12 ? ' PM' : ' AM';
                                const displayHours = hours % 12 || 12;
                                const displayMinutes = minutes.toString().padStart(2, '0');
                                setTime(`${displayHours}:${displayMinutes}${ampm}`);
                              }
                              setShowTimePicker(true)
                            }
                          }
                        >
                          {time}
                          <span className="mr-2"><Clock className="h-4 w-4" /></span>
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

                <div>
                  <Label htmlFor="pickup" className="mb-2">Pick-Up Location</Label>
                  <Input 
                    id="pickup" 
                    placeholder="Your pick-up location" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className={cn(
                      "transition-colors duration-200",
                      pickupLocation.trim() 
                        ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500" 
                        : "border-gray-300 focus:border-gray-300 focus:ring-gray-300"
                    )}
                  />
                  <Button type="button" variant={"primary"} className="flex gap-1 ml-4 cursor-pointer items-center text-[#AE9409] font-semibold text-xs" onClick={handleAddStop}>
                    <Plus className="h-4" />
                    <span className="hover:underline">Add Stop</span>
                  </Button>
                  {stops.length > 0 && (
                    <div className="space-y-3 px-6">
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
                              className={cn(
                                "w-full transition-colors duration-200",
                                stopError === index 
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                  : 
                                    stop.trim() 
                                      ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500" 
                                      : "border-gray-300 focus:border-gray-300 focus:ring-gray-300"
                              )}
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
                      {stopError !== null && (
                        <p className="text-red-500 text-sm pl-6 font-semibold -mt-2">
                          Stop location is required
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoff">Drop-Off Location</Label>
                  <Input 
                    id="dropoff" 
                    placeholder="Your drop-off location" 
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className={cn(
                      "transition-colors duration-200",
                      dropoffLocation.trim() 
                        ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500" 
                        : "border-gray-300 focus:border-gray-300 focus:ring-gray-300"
                    )}
                  />
                </div>

                <div className="flex max-md:hidden max-md:flex-col gap-4">
                  <div className="space-y-2 min-w-40">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <div className="flex items-center">
                      <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                        <Users className="w-4 h-4"/>
                      </Button>
                      <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setPassenger(Math.max(1, passenger - 1))}>
                        <Minus />
                      </Button>
                      <Input className="border w-2/5 rounded-none border-gray-400 text-center" value={passenger} onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPassenger(1);
                        } else {
                          setPassenger(Number(value) || passenger);
                        }
                        }} />
                      <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setPassenger(passenger + 1)}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 min-w-40">
                    <Label htmlFor="luggage">Luggage Count</Label>
                    <div className="flex items-center">
                      <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                        <BriefcaseBusinessIcon />
                      </Button>
                        <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setLuggage(Math.max(0, luggage - 1))}>
                        <Minus />
                        </Button>
                        <Input className="border w-2/5 rounded-none border-gray-400 text-center" value={luggage} onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setLuggage(0);
                        } else {
                          setLuggage(Number(value) || luggage);
                        }
                        }} />
                      <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setLuggage(luggage + 1)}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-500 h-100 w-120" />
            </div>

            <div className="flex flex-wrap gap-4 md:hidden">
              <div className="space-y-2 min-w-40">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <div className="flex items-center">
                  <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                    <Users className="w-4 h-4 mr-1"/>
                  </Button>
                  <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setPassenger(Math.max(1, passenger - 1))}>
                    <Minus />
                  </Button>
                  <Input className="border w-2/5 rounded-none border-gray-400 text-center" value={passenger} onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setPassenger(1);
                    } else {
                      setPassenger(Number(value) || passenger);
                    }
                    }} />
                  <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setPassenger(passenger + 1)}>
                    <Plus />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="luggage">Luggage Count</Label>
                <div className="flex items-center">
                  <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                    <BriefcaseBusinessIcon />
                  </Button>
                    <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setLuggage(Math.max(0, luggage - 1))}>
                    <Minus />
                    </Button>
                    <Input className="border w-2/5 rounded-none border-gray-400 text-center" value={luggage} onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setLuggage(0);
                    } else {
                      setLuggage(Number(value) || luggage);
                    }
                    }} />
                  <Button type="button" variant={"primary"} className="border w-1/5 hover:text-[#AE9409] rounded-none border-gray-400" onClick={() => setLuggage(luggage + 1)}>
                    <Plus />
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold text-xl m-4 cursor-pointer py-4 px-12 rounded-none shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Select Vehicle
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}