"use client";

import React, { createContext, useContext, useState } from 'react';

interface BookingDetails {
  serviceType: string;
  date: Date | undefined;
  time: string | null;
  pickupLocation: string;
  stops: string[];
  dropoffLocation: string;
  passengers: number;
  luggage: number;
}

interface BookingContextType {
  bookingDetails: BookingDetails;
  updateBookingDetails: (details: Partial<BookingDetails>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number[];
  completeStep: (step: number) => void;
  expandedSteps: number[];
  toggleStep: (step: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    serviceType: '',
    date: undefined,
    time: null,
    pickupLocation: '',
    stops: [],
    dropoffLocation: '',
    passengers: 1,
    luggage: 0,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]); // Step 1 is expanded by default

  const updateBookingDetails = (details: Partial<BookingDetails>) => {
    setBookingDetails(prev => ({ ...prev, ...details }));
  };

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const toggleStep = (step: number) => {
    setExpandedSteps(prev => {
      if (prev.includes(step)) {
        return prev.filter(s => s !== step);
      } else {
        return [...prev, step];
      }
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingDetails,
        updateBookingDetails,
        currentStep,
        setCurrentStep,
        completedSteps,
        completeStep,
        expandedSteps,
        toggleStep,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
