"use client";

interface Passenger {
  name: string;
  email?: string; 
  phone?: string;
}

interface BookingState {
  bookingDetails: {
    serviceType: string;
    date: Date | undefined;
    time: string | null;
    pickupLocation: string;
    stops: string[];
    dropoffLocation: string;
    passengers: number;
    luggage: number;
  };
  vehicle: string | null;
  user: { name?: string; email?: string; phone?: string; passengers?: Passenger[] } | null;
  payment: { method?: string; amount?: number; status?: string } | null;
  currentStep: number;
  completedSteps: number[];
  expandedSteps: number[];
}

type BookingAction =
  | { type: "UPDATE_BOOKING_DETAILS"; payload: Partial<BookingState["bookingDetails"]> }
  | { type: "SET_VEHICLE"; payload: string }
  | { type: "SET_USER"; payload: { name?: string; email?: string; phone?: string; passengers?: Passenger[] } }
  | { type: "ADD_PASSENGER"; payload: Passenger }
  | { type: "UPDATE_PASSENGER"; payload: { index: number; data: Partial<Passenger> } }
  | { type: "REMOVE_PASSENGER"; payload: number }
  | { type: "SET_PAYMENT"; payload: { method?: string; amount?: number; status?: string } }
  | { type: "SET_STEP"; payload: number }
  | { type: "COMPLETE_STEP"; payload: number }
  | { type: "TOGGLE_STEP"; payload: number }
  | { type: "RESET" };

export const initialState: BookingState = {
  bookingDetails: {
    serviceType: "",
    date: undefined,
    time: null,
    pickupLocation: "",
    stops: [],
    dropoffLocation: "",
    passengers: 1,
    luggage: 0,
  },
  vehicle: null,
  user: null,
  payment: null,
  currentStep: 1,
  completedSteps: [],
  expandedSteps: [1],
};

export default function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "UPDATE_BOOKING_DETAILS":
      return { ...state, bookingDetails: { ...state.bookingDetails, ...action.payload } };

    case "SET_VEHICLE":
      return { ...state, vehicle: action.payload, currentStep: 2 };

    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.payload }, currentStep: 3 };

    case "ADD_PASSENGER":
        return {
            ...state,
            user: {
            ...state.user,
            passengers: [...(state.user?.passengers || []), action.payload],
            },
        };
    
    case "UPDATE_PASSENGER":
        return {
            ...state,
            user: {
            ...state.user,
            passengers: state.user?.passengers?.map((p, i) =>
                i === action.payload.index ? { ...p, ...action.payload.data } : p
            ) || [],
            },
        };

    case "REMOVE_PASSENGER":
        return {
            ...state,
            user: {
            ...state.user,
            passengers: state.user?.passengers?.filter((_, i) => i !== action.payload) || [],
            },
        };

    case "SET_PAYMENT":
      return { ...state, payment: action.payload };

    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "COMPLETE_STEP":
      return state.completedSteps.includes(action.payload)
        ? state
        : { ...state, completedSteps: [...state.completedSteps, action.payload] };

    case "TOGGLE_STEP":
      return state.expandedSteps.includes(action.payload)
        ? { ...state, expandedSteps: state.expandedSteps.filter(s => s !== action.payload) }
        : { ...state, expandedSteps: [...state.expandedSteps, action.payload] };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
