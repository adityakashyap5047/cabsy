"use client";

import * as React from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
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
import LocationAutocomplete, { LocationAutocompleteRef } from "./LocationAutocomplete";

interface AddDetailsProps {
  isReturnJourney?: boolean;
  forceMobileLayout?: boolean;
}

export interface AddDetailsRef {
  validateAndFocus: () => boolean;
}

const AddDetails = React.forwardRef<AddDetailsRef, AddDetailsProps>(({ isReturnJourney = false, forceMobileLayout = false }, ref) => {
  const { state, dispatch } = useBooking();
  const { data: session, status } = useSession();

  const step = 1;
  const currentJourney = isReturnJourney ? state.returnJourney : state.onward;

  const isCompleted = isReturnJourney 
    ? state.returnCompletedSteps.includes(step)
    : state.completedSteps.includes(step);
  const isExpanded = isReturnJourney
    ? state.returnExpandedSteps.includes(step)
    : state.expandedSteps.includes(step);
  const showSummary = isReturnJourney
    ? state.returnSummarySteps.includes(step)
    : state.summarySteps.includes(step);

  const [serviceType, setServiceType] = React.useState<string>(currentJourney?.serviceType || '');
  const [date, setDate] = React.useState<string | Date | null>(currentJourney?.date || null);
  const [time, setTime] = React.useState<string | null>(currentJourney?.time || null);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [stops, setStops] = React.useState<string[]>(currentJourney?.stops || []);
  const [stopError, setStopError] = React.useState<number | null>(null);
  const [stopFocusTrigger, setStopFocusTrigger] = React.useState(0);
  const [justAddedStop, setJustAddedStop] = React.useState<boolean>(false);
  const [pickupLocation, setPickupLocation] = React.useState<string>(currentJourney?.pickupLocation || "");
  const [pickupCoordinates, setPickupCoordinates] = React.useState<{ latitude: number; longitude: number } | null>(currentJourney?.pickupCoordinates || null);
  const [dropoffLocation, setDropoffLocation] = React.useState<string>(currentJourney?.dropoffLocation || "");
  const [dropoffCoordinates, setDropoffCoordinates] = React.useState<{ latitude: number; longitude: number } | null>(currentJourney?.dropoffCoordinates || null);
  const [stopsCoordinates, setStopsCoordinates] = React.useState<Array<{ latitude: number; longitude: number } | null>>(currentJourney?.stopsCoordinates || []);
  const [distance, setDistance] = React.useState<number | null>(currentJourney?.distance || null);
  const [duration, setDuration] = React.useState<number | null>(currentJourney?.duration || null);
  const [polyline, setPolyline] = React.useState<string | null>(currentJourney?.polyline || null);
  const [passenger, setPassenger] = React.useState<number>(currentJourney?.passengers || 1);
  const [luggage, setLuggage] = React.useState<number>(currentJourney?.luggage || 0);
  const isEditing = isExpanded && isCompleted;

  const [errors, setErrors] = React.useState({
    serviceType: '',
    date: '',
    time: '',
    pickupLocation: '',
    dropoffLocation: ''
  });

  const serviceTypeRef = React.useRef<HTMLButtonElement>(null);
  const dateRef = React.useRef<HTMLButtonElement>(null);
  const timeRef = React.useRef<HTMLButtonElement>(null);
  const pickupRef = React.useRef<LocationAutocompleteRef>(null);
  const dropoffRef = React.useRef<LocationAutocompleteRef>(null);
  const stopRefs = React.useRef<(LocationAutocompleteRef | null)[]>([]);

  // Sync local state with context when currentJourney changes
  React.useEffect(() => {
    if (currentJourney) {
      setServiceType(currentJourney.serviceType || '');
      setDate(currentJourney.date || null);
      setTime(currentJourney.time || null);
      setPickupLocation(currentJourney.pickupLocation || '');
      setPickupCoordinates(currentJourney.pickupCoordinates || null);
      setDropoffLocation(currentJourney.dropoffLocation || '');
      setDropoffCoordinates(currentJourney.dropoffCoordinates || null);
      setStops(currentJourney.stops || []);
      setStopsCoordinates(currentJourney.stopsCoordinates || []);
      setDistance(currentJourney.distance || null);
      setDuration(currentJourney.duration || null);
      setPolyline(currentJourney.polyline || null);
      setPassenger(currentJourney.passengers || 1);
      setLuggage(currentJourney.luggage || 0);
    }
  }, [currentJourney]);

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  React.useEffect(() => {
    if (stopError !== null && stopRefs.current[stopError]) {
      stopRefs.current[stopError]?.focus();
    }
  }, [stopError, stopFocusTrigger]);

  const handleAddStop = () => {
    const firstEmptyIndex = stops.findIndex(stop => stop.trim() === "");
    if (firstEmptyIndex !== -1) {
      setStopError(firstEmptyIndex);
      setStopFocusTrigger(prev => prev + 1);
      return;
    }

    setStops(prev => [...prev, ""]);
    setStopError(null);
    setJustAddedStop(true); 
  }

  const handleRemoveStop = (index: number) => {
    setStops(prev => prev.filter((_, i) => i !== index));
    setStopsCoordinates(prev => prev.filter((_, i) => i !== index));
    setStopError(null);
  }

  const handleStopChange = (index: number, value: string) => {
    setStops(prev => prev.map((stop, i) => i === index ? value : stop));
    if (stopError === index && value.trim() !== "") {
      setStopError(null);
    }
  }

  const calculateDistance = React.useCallback(async () => {
    if (!pickupCoordinates || !dropoffCoordinates) {
      return;
    }

    try {
      const validStopsCoordinates = stopsCoordinates.filter((coord): coord is { latitude: number; longitude: number } => coord !== null);

      const response = await fetch('/api/location/distance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: pickupCoordinates,
          destination: dropoffCoordinates,
          waypoints: validStopsCoordinates.length > 0 ? validStopsCoordinates : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDistance(data.distance);
        setDuration(data.duration);
        setPolyline(data.polyline);
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  }, [pickupCoordinates, dropoffCoordinates, stopsCoordinates]);

  React.useEffect(() => {
    if (pickupCoordinates && dropoffCoordinates) {
      calculateDistance();
    }
  }, [pickupCoordinates, dropoffCoordinates, stopsCoordinates, calculateDistance]);

  React.useImperativeHandle(ref, () => ({
    validateAndFocus: () => {
      const validation = validateForm();
      if (!validation.isValid) {
        if (validation.errors.serviceType && serviceTypeRef.current) {
          serviceTypeRef.current.click();
        } else if (validation.errors.date && dateRef.current) {
          if (!date) {
            setDate(new Date());
          }
          setShowDatePicker(true); // Open the date popover
          dateRef.current.focus();
        } else if (validation.errors.time && timeRef.current) {
          if (!time) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`); // Auto-fill current time
          }
          setShowTimePicker(true); // Open the time popover
          timeRef.current.focus();
        } else if (validation.errors.pickupLocation && pickupRef.current) {
          pickupRef.current.focus();
        } else if (validation.stopErrorIndex !== null && stopRefs.current[validation.stopErrorIndex]) {
          // Focus on the empty stop input (checked after pickup)
          stopRefs.current[validation.stopErrorIndex]?.focus();
        } else if (validation.errors.dropoffLocation && dropoffRef.current) {
          dropoffRef.current.focus();
        }
      }
      return validation.isValid;
    }
  }));

  const validateForm = () => {
    const validationErrors = {
      serviceType: '',
      date: '',
      time: '',
      pickupLocation: '',
      dropoffLocation: ''
    };

    if (!serviceType.trim()) {
      validationErrors.serviceType = 'Please select a service type';
    }

    if (!date) {
      validationErrors.date = 'Please select a pick-up date';
    }

    if (!time) {
      validationErrors.time = 'Please select a pick-up time';
    }

    if (!pickupLocation.trim()) {
      validationErrors.pickupLocation = 'Pick-up location is required';
    } else if (!pickupRef.current?.validateLocation()) {
      validationErrors.pickupLocation = 'Please select a valid location';
    }

    if (!dropoffLocation.trim()) {
      validationErrors.dropoffLocation = 'Drop-off location is required';
    } else if (!dropoffRef.current?.validateLocation()) {
      validationErrors.dropoffLocation = 'Please select a valid location';
    }

    // Check for empty or invalid stop inputs
    let stopErrorIndex = -1;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const stopRef = stopRefs.current[i];
      if (!stop.trim() || !stopRef?.validateLocation()) {
        stopErrorIndex = i;
        break;
      }
    }
    const hasStopError = stopErrorIndex !== -1;

    setErrors(validationErrors);
    
    // Always set stop error if there is one
    if (hasStopError) {
      setStopError(stopErrorIndex);
      // Only trigger focus if there are no higher priority errors (serviceType, date, time, pickup)
      const hasHigherPriorityError = validationErrors.serviceType || validationErrors.date || 
                                       validationErrors.time || validationErrors.pickupLocation;
      if (!hasHigherPriorityError) {
        setStopFocusTrigger(prev => prev + 1);
      }
    } else {
      setStopError(null);
    }

    return {
      isValid: !validationErrors.serviceType && !validationErrors.date && !validationErrors.time && 
               !validationErrors.pickupLocation && !validationErrors.dropoffLocation && !hasStopError,
      errors: validationErrors,
      stopErrorIndex: hasStopError ? stopErrorIndex : null
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      // Focus on first error field in sequential order (top to bottom)
      if (validation.errors.serviceType && serviceTypeRef.current) {
        serviceTypeRef.current.click(); // Open the select dropdown
      } else if (validation.errors.date && dateRef.current) {
        if (!date) {
          setDate(new Date());
        }
        setShowDatePicker(true);
        dateRef.current.focus();
      } else if (validation.errors.time && timeRef.current) {
        if (!time) {
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          setTime(`${hours}:${minutes}`);
        }
        setShowTimePicker(true); // Open the time popover
        timeRef.current.focus();
      } else if (validation.errors.pickupLocation && pickupRef.current) {
        pickupRef.current.focus();
      } else if (validation.stopErrorIndex !== null && stopRefs.current[validation.stopErrorIndex]) {
        // Focus on the empty stop input (checked after pickup)
        stopRefs.current[validation.stopErrorIndex]?.focus();
      } else if (validation.errors.dropoffLocation && dropoffRef.current) {
        dropoffRef.current.focus();
      }
      return;
    }
    
    const calculatedAmount = isReturnJourney ? 150 : 200;
    
    dispatch({
      type: isReturnJourney ? "UPDATE_RETURN_DETAILS" : "UPDATE_ONWARD_DETAILS",
      payload: {
        serviceType,
        date: typeof date === "string" ? date : format(date ?? new Date(), "yyyy/MM/dd"),
        time,
        pickupLocation,
        pickupCoordinates: pickupCoordinates || undefined,
        stops,
        stopsCoordinates: stopsCoordinates.filter((coord): coord is { latitude: number; longitude: number } => coord !== null),
        dropoffLocation,
        dropoffCoordinates: dropoffCoordinates || undefined,
        distance: distance || undefined,
        duration: duration || undefined,
        polyline: polyline || undefined,
        passengers: passenger,
        luggage,
        amount: calculatedAmount,
      }
    });
    
    dispatch({ type: isReturnJourney ? "COMPLETE_RETURN_STEP" : "COMPLETE_STEP", payload: step });
    dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_STEP" : "TOGGLE_STEP", payload: step });
    
    // If user is logged in, skip step 2 and auto-complete it with session data
    if (status === 'authenticated' && session?.user && !isReturnJourney) {
      dispatch({
        type: "SET_USER",
        payload: {
          name: session.user.name || '',
          email: session.user.email || '',
          phone: session.user.phone || '',
          passengers: [{
            name: session.user.name || '',
            email: session.user.email || '',
            phone: session.user.phone || ''
          }]
        }
      });
      dispatch({ type: "COMPLETE_STEP", payload: step + 1 });
      
      setTimeout(() => {
        if (!showSummary) {
          dispatch({ type: "TOGGLE_SUMMARY", payload: step });
        }
        if (!state.summarySteps.includes(step + 1)) {
          dispatch({ type: "TOGGLE_SUMMARY", payload: step + 1 });
        }
        dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 2 });
      }, 100);
    } else {
      setTimeout(() => {
        if (!showSummary) {
          dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_SUMMARY" : "TOGGLE_SUMMARY", payload: step });
        }
        dispatch({ type: isReturnJourney ? "EXPAND_ONLY_RETURN_STEP" : "EXPAND_ONLY_STEP", payload: step + 1 });
      }, 100);
    }
  };

  const handleEdit = () => {
    dispatch({ type: isReturnJourney ? "COLLAPSE_AFTER_RETURN_STEP" : "COLLAPSE_AFTER_STEP", payload: step });
    if(!isExpanded) dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_STEP" : "TOGGLE_STEP", payload: step });
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_SUMMARY" : "TOGGLE_SUMMARY", payload: step });
    }
  };

  const summary = (
    <div className={`grid grid-cols-2 gap-y-3 ${isReturnJourney ? 'px-0' : 'px-0 sm:px-4 md:px-24 lg:px-32'}`}>
      <div className="space-y-2 sm:space-y-3 min-w-[114px]">
        <div className="flex gap-1 flex-wrap">
          <span className="font-semibold text-gray-700 text-sm sm:text-base">
            {date && format(date, "MM/dd/yyyy")}
          </span>
          <span className="font-semibold text-gray-700 text-sm sm:text-base">
            {time}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600 text-sm">Passenger:</span>{' '}
          <span className="text-gray-700 text-sm">{passenger}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600 text-sm">Luggage:</span>{' '}
          <span className="text-gray-700 text-sm">{luggage}</span>
        </div>
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
          Fare: <span className="text-yellow-600 text-sm sm:text-base font-semibold">
            ${currentJourney?.amount ? currentJourney.amount.toFixed(2) : (isReturnJourney ? '150.00' : '200.00')}
          </span>
        </h1>
      </div>
      
      <div className="space-y-3 justify-self-end">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          <span className="text-green-400 font-semibold text-sm break-words">{pickupLocation}</span>
        </div>
        {
          stops && stops?.length > 0 && stops.map((stop, idx) => (
            <div key={idx} className="flex ml-4 items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
              <span className="text-yellow-400 font-semibold text-sm break-words">{stop}</span>
            </div>
          ))
        }
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
          <span className="text-red-400 font-semibold text-sm break-words">{dropoffLocation}</span>
        </div>
        {distance && (
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-[#AE9409]">Distance:</span>{' '}
            <span className="font-semibold text-gray-700 text-sm">{distance.toFixed(1)} km</span>
          </div>
        )}
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
        <div className={forceMobileLayout ? "p-3 space-y-4" : "p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"}>
          <form className={forceMobileLayout ? "space-y-4" : "space-y-4 sm:space-y-6"} onSubmit={handleSubmit}>
            <div className={forceMobileLayout ? "flex items-start gap-4 flex-col" : "flex items-start sm:items-center gap-4 md:gap-8 flex-col sm:flex-row"}>
              <div className={forceMobileLayout ? "space-y-3 w-full" : "space-y-3 sm:space-y-4 md:space-y-6 w-full sm:w-1/2"}>
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service Type</Label>
                  <Select value={serviceType} onValueChange={(value) => { setServiceType(value); clearError('serviceType'); }}>
                    <SelectTrigger ref={serviceTypeRef} className={`w-full rounded-none cursor-pointer ${errors.serviceType ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`} id="service">
                      <SelectValue placeholder="Choose a service type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="from-airport">From Airport</SelectItem>
                      <SelectItem value="to-airport">To Airport</SelectItem>
                      <SelectItem value="point-to-point">Point-to-Point</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.serviceType}</p>
                  )}
                </div>
                <div className={forceMobileLayout ? "flex w-full gap-2 flex-col" : "flex w-full gap-2 flex-col min-[392px]:flex-row"}>
                  <div className={forceMobileLayout ? "space-y-2 w-full" : "space-y-2 w-full min-[392px]:w-1/2"}>
                    <Label>Pick-Up Date</Label>
                    <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                      <PopoverTrigger asChild>
                        <Button
                          ref={dateRef}
                          variant="primary"
                          className={cn(
                            `w-full ${!date ? "justify-end cursor-text" : "justify-between cursor-pointer"} border rounded-none text-left font-normal ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`
                          )}
                          onClick={() => {
                            if (!date) {
                              setDate(new Date());
                            }
                            setShowDatePicker(true);
                          }}
                        >
                          {date && format(date, "yyyy/MM/dd")}
                          <span className="cursor-pointer hover:text-[#AE9409]">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={typeof date === "string" ? new Date(date) : date ?? new Date()}
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
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.date}</p>
                    )}
                  </div>
                  <div className={forceMobileLayout ? "space-y-2 w-full" : "space-y-2 w-full min-[392px]:w-1/2"}>
                    <Label>Pick-Up Time</Label>
                    <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
                      <PopoverTrigger asChild>
                        <Button
                          ref={timeRef}
                          variant="primary"
                          className={`w-full border rounded-none ${!time ? "cursor-text justify-end" : "cursor-pointer justify-between"} text-left font-normal ${errors.time ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
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
                          <span className="mr-2 cursor-pointer hover:text-[#AE9409]"><Clock className="h-4 w-4" /></span>
                        </Button>
                      </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" >
                        <TimeKeeper
                          time={time}
                          onChange={(newTime) => {
                          const timeWithUpperCase = newTime.formatted12.replace(/am|pm/gi, (match) => match.toUpperCase());
                          setTime(timeWithUpperCase);
                          clearError('time');
                          }}
                          switchToMinuteOnHourSelect
                          closeOnMinuteSelect
                          doneButton={null}
                        />
                        </PopoverContent>
                    </Popover>
                    {errors.time && (
                      <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickup" className="mb-2">Pick-Up Location</Label>
                  <LocationAutocomplete
                    ref={pickupRef}
                    id="pickup"
                    value={pickupLocation}
                    onChange={(value) => { setPickupLocation(value); clearError('pickupLocation'); }}
                    onPlaceSelect={(place) => {
                      setPickupCoordinates(place.location);
                      console.log('Pickup place selected:', place);
                    }}
                    placeholder="Your pick-up location"
                    error={errors.pickupLocation}
                  />
                  <Button type="button" variant={"primary"} className="flex gap-1 ml-4 ring-0! cursor-pointer items-center text-[#AE9409] font-semibold text-xs" onClick={handleAddStop}>
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
                            <LocationAutocomplete
                              ref={(el) => { stopRefs.current[index] = el; }}
                              value={stop}
                              onChange={(value) => handleStopChange(index, value)}
                              onPlaceSelect={(place) => {
                                setStopsCoordinates(prev => {
                                  const newCoords = [...prev];
                                  newCoords[index] = place.location;
                                  return newCoords;
                                });
                                console.log('Stop place selected:', place);
                              }}
                              placeholder="Add Your Stop"
                              error={stopError === index ? 'Stop location is required' : ''}
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
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoff">Drop-Off Location</Label>
                  <LocationAutocomplete
                    ref={dropoffRef}
                    id="dropoff"
                    value={dropoffLocation}
                    onChange={(value) => { setDropoffLocation(value); clearError('dropoffLocation'); }}
                    onPlaceSelect={(place) => {
                      setDropoffCoordinates(place.location);
                      console.log('Dropoff place selected:', place);
                    }}
                    placeholder="Your drop-off location"
                    error={errors.dropoffLocation}
                  />
                </div>

                {/* Passenger and Luggage - Shows inline on screens 640px and above, below dropoff */}
                <div className={forceMobileLayout ? "hidden" : "hidden sm:flex gap-2 sm:gap-3 md:gap-4 flex-col min-[725px]:flex-row"}>
                  <div className="space-y-2 flex-1">
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
                  <div className="space-y-2 flex-1">
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
              
              {/* Map Preview - Shows from sm (640px) onwards on the right */}
              <div className={forceMobileLayout ? "hidden" : "hidden sm:block bg-gray-300 h-[400px] md:h-[450px] lg:h-[500px] w-full sm:w-1/2 rounded-md"}>
                {/* Map will be added here */}
              </div>
            </div>

            {/* Map Preview - Shows on small screens (below 640px) in the middle of form */}
            <div className={forceMobileLayout ? "block bg-gray-300 h-[250px] w-full rounded-md" : "block sm:hidden bg-gray-300 h-[250px] min-[392px]:h-[300px] w-full rounded-md"}>
              {/* Map will be added here */}
            </div>

            {/* Passenger and Luggage - Shows below map on mobile, inline with form on tablet+ */}
            <div className={forceMobileLayout ? "flex gap-2 flex-col" : "flex gap-2 sm:gap-3 md:gap-4 flex-col min-[392px]:flex-row sm:hidden"}>
              <div className="space-y-2 flex-1">
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
              <div className="space-y-2 flex-1">
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

            <div className={forceMobileLayout ? "flex justify-center" : "flex justify-center sm:justify-start"}>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold text-base sm:text-lg md:text-xl cursor-pointer py-3 md:py-4 px-8 md:px-10 lg:px-12 rounded-none shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

AddDetails.displayName = 'AddDetails';

export default AddDetails;