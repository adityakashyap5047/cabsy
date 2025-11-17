'use client';

import React, { useReducer, createContext } from 'react';
import AddDetails from './AddDetails';
import bookingReducer, { BookingState, BookingAction } from '@/reducer/BookingReducer';

interface ReturnAddDetailsWrapperProps {
  initialPickup: string;
  initialDropoff: string;
  initialPassengers: number;
  initialLuggage: number;
}

// Create a separate context for return journey
export const ReturnBookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

const ReturnAddDetailsWrapper: React.FC<ReturnAddDetailsWrapperProps> = ({
  initialPickup,
  initialDropoff,
  initialPassengers,
  initialLuggage,
}) => {
  // Initialize return journey state with reversed locations
  const returnInitialState: BookingState = {
    onward: {
      serviceType: 'point-to-point',
      pickupLocation: initialPickup,
      stops: [],
      dropoffLocation: initialDropoff,
      date: undefined,
      time: null,
      passengers: initialPassengers,
      luggage: initialLuggage,
      remarks: '',
      user: null,
    },
    returnEnabled: false,
    returnJourney: undefined,
    payment: null,
  currentStep: 1,
  completedSteps: [],
  expandedSteps: [1],
  summarySteps: [],
  returnCompletedSteps: [],
  returnExpandedSteps: [1],
  returnSummarySteps: [],
};  const [state, dispatch] = useReducer(bookingReducer, returnInitialState);

  return (
    <ReturnBookingContext.Provider value={{ state, dispatch }}>
      <AddDetails />
    </ReturnBookingContext.Provider>
  );
};

export default ReturnAddDetailsWrapper;
