"use client";

interface Passenger {
  name: string;
  email?: string; 
  phone?: string;
}

export interface JourneyDetails {
  serviceType: string;
  date: Date | undefined;
  time: string | null;
  pickupLocation: string;
  stops: string[];
  dropoffLocation: string;
  passengers: number;
  luggage: number;
  vehicle?: string;
  remarks?: string;
  user?: { name?: string; email?: string; phone?: string; passengers?: Passenger[] } | null;
}

export interface BookingState {
  onward: JourneyDetails;
  returnEnabled: boolean;
  returnJourney?: JourneyDetails;
  
  payment: { method?: string; amount?: number; status?: string } | null;

  currentStep: number;
  completedSteps: number[];
  expandedSteps: number[];
  summarySteps: number[];
  
  // Separate step tracking for return journey
  returnCompletedSteps: number[];
  returnExpandedSteps: number[];
  returnSummarySteps: number[];
}

export type BookingAction =
  | { type: "UPDATE_ONWARD_DETAILS"; payload: Partial<JourneyDetails> }
  | { type: "UPDATE_RETURN_DETAILS"; payload: Partial<JourneyDetails> }
  | { type: "UPDATE_BOOKING_DETAILS"; payload: Partial<JourneyDetails> } // Backward compatibility
  | { type: "ENABLE_RETURN_JOURNEY"; payload: boolean }
  | { type: "INITIALIZE_RETURN_JOURNEY" }
  | { type: "SET_VEHICLE"; payload: string }
  | { type: "SET_USER"; payload: { name?: string; email?: string; phone?: string; passengers?: Passenger[] } }
  | { type: "SET_RETURN_USER"; payload: { name?: string; email?: string; phone?: string; passengers?: Passenger[] } }
  | { type: "ADD_PASSENGER"; payload: Passenger }
  | { type: "UPDATE_PASSENGER"; payload: { index: number; data: Partial<Passenger> } }
  | { type: "REMOVE_PASSENGER"; payload: number }
  | { type: "ADD_RETURN_PASSENGER"; payload: Passenger }
  | { type: "UPDATE_RETURN_PASSENGER"; payload: { index: number; data: Partial<Passenger> } }
  | { type: "REMOVE_RETURN_PASSENGER"; payload: number }
  | { type: "SET_PAYMENT"; payload: { method?: string; amount?: number; status?: string } }
  | { type: "SET_STEP"; payload: number }
  | { type: "COMPLETE_STEP"; payload: number }
  | { type: "TOGGLE_STEP"; payload: number }
  | { type: "COLLAPSE_AFTER_STEP"; payload: number }
  | { type: "EXPAND_ONLY_STEP"; payload: number }
  | { type: "TOGGLE_SUMMARY"; payload: number }
  | { type: "COMPLETE_RETURN_STEP"; payload: number }
  | { type: "TOGGLE_RETURN_STEP"; payload: number }
  | { type: "COLLAPSE_AFTER_RETURN_STEP"; payload: number }
  | { type: "EXPAND_ONLY_RETURN_STEP"; payload: number }
  | { type: "TOGGLE_RETURN_SUMMARY"; payload: number }
  | { type: "ADD_ONWARD_REMARKS"; payload: string }
  | { type: "ADD_RETURN_REMARKS"; payload: string }
  | { type: "CLEAR_RETURN_JOURNEY" }
  | { type: "RESET" };

export const initialState: BookingState = {
  onward: {
    serviceType: "",
    date: undefined,
    time: null,
    pickupLocation: "",
    stops: [],
    dropoffLocation: "",
    passengers: 1,
    luggage: 0,
    remarks: "",
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
};

export default function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "UPDATE_ONWARD_DETAILS":
      return { ...state, onward: { ...state.onward, ...action.payload } };

    case "UPDATE_RETURN_DETAILS":
      return { 
        ...state, 
        returnJourney: state.returnJourney 
          ? { ...state.returnJourney, ...action.payload } 
          : undefined 
      };

    case "ENABLE_RETURN_JOURNEY":
      return { ...state, returnEnabled: action.payload };

    case "CLEAR_RETURN_JOURNEY":
      return {
        ...state,
        returnJourney: undefined,
        returnCompletedSteps: [],
        returnExpandedSteps: [1],
        returnSummarySteps: [],
      };

    case "INITIALIZE_RETURN_JOURNEY":
      return {
        ...state,
        returnJourney: {
          serviceType: state.onward.serviceType,
          date: undefined,
          time: null,
          pickupLocation: state.onward.dropoffLocation || "",
          dropoffLocation: state.onward.pickupLocation || "",
          stops: [...state.onward.stops].reverse(),
          passengers: state.onward.passengers,
          luggage: state.onward.luggage,
          vehicle: undefined,
          remarks: "",
          user: state.onward.user ? { ...state.onward.user } : null,
        }
      };

    case "UPDATE_BOOKING_DETAILS":
      // Backward compatibility - update onward journey
      return { ...state, onward: { ...state.onward, ...action.payload } };

    case "SET_VEHICLE":
      return { ...state, onward: { ...state.onward, vehicle: action.payload }, currentStep: 2 };

    case "SET_USER":
      return { 
        ...state, 
        onward: { 
          ...state.onward, 
          user: { ...state.onward.user, ...action.payload } 
        }, 
        currentStep: 3 
      };

    case "SET_RETURN_USER":
      return { 
        ...state, 
        returnJourney: state.returnJourney 
          ? { 
              ...state.returnJourney, 
              user: { ...state.returnJourney.user, ...action.payload } 
            }
          : undefined
      };

    case "ADD_PASSENGER":
      return {
        ...state,
        onward: {
          ...state.onward,
          user: {
            ...state.onward.user,
            passengers: [...(state.onward.user?.passengers || []), action.payload],
          },
        },
      };

    case "ADD_RETURN_PASSENGER":
      return {
        ...state,
        returnJourney: state.returnJourney 
          ? {
              ...state.returnJourney,
              user: {
                ...state.returnJourney.user,
                passengers: [...(state.returnJourney.user?.passengers || []), action.payload],
              },
            }
          : undefined,
      };
    
    case "UPDATE_PASSENGER":
      return {
        ...state,
        onward: {
          ...state.onward,
          user: {
            ...state.onward.user,
            passengers: state.onward.user?.passengers?.map((p, i) =>
                i === action.payload.index ? { ...p, ...action.payload.data } : p
            ) || [],
          },
        },
      };

    case "UPDATE_RETURN_PASSENGER":
      return {
        ...state,
        returnJourney: state.returnJourney
          ? {
              ...state.returnJourney,
              user: {
                ...state.returnJourney.user,
                passengers: state.returnJourney.user?.passengers?.map((p, i) =>
                    i === action.payload.index ? { ...p, ...action.payload.data } : p
                ) || [],
              },
            }
          : undefined,
      };

    case "REMOVE_PASSENGER":
      return {
        ...state,
        onward: {
          ...state.onward,
          user: {
            ...state.onward.user,
            passengers: state.onward.user?.passengers?.filter((_, i) => i !== action.payload) || [],
          },
        },
      };

    case "REMOVE_RETURN_PASSENGER":
      return {
        ...state,
        returnJourney: state.returnJourney
          ? {
              ...state.returnJourney,
              user: {
                ...state.returnJourney.user,
                passengers: state.returnJourney.user?.passengers?.filter((_, i) => i !== action.payload) || [],
              },
            }
          : undefined,
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

    case "COLLAPSE_AFTER_STEP":
      return {
        ...state,
        expandedSteps: state.expandedSteps.filter(s => s <= action.payload)
      };

    case "EXPAND_ONLY_STEP":
      return {
        ...state,
        expandedSteps: [action.payload]
      };

    case "TOGGLE_SUMMARY":
      return state.summarySteps.includes(action.payload)
        ? { ...state, summarySteps: state.summarySteps.filter(s => s !== action.payload) }
        : { ...state, summarySteps: [...state.summarySteps, action.payload] };
    
    case "COMPLETE_RETURN_STEP":
      return state.returnCompletedSteps.includes(action.payload)
        ? state
        : { ...state, returnCompletedSteps: [...state.returnCompletedSteps, action.payload] };

    case "TOGGLE_RETURN_STEP":
      return state.returnExpandedSteps.includes(action.payload)
        ? { ...state, returnExpandedSteps: state.returnExpandedSteps.filter(s => s !== action.payload) }
        : { ...state, returnExpandedSteps: [...state.returnExpandedSteps, action.payload] };

    case "COLLAPSE_AFTER_RETURN_STEP":
      return {
        ...state,
        returnExpandedSteps: state.returnExpandedSteps.filter(s => s <= action.payload)
      };

    case "EXPAND_ONLY_RETURN_STEP":
      return {
        ...state,
        returnExpandedSteps: [action.payload]
      };

    case "TOGGLE_RETURN_SUMMARY":
      return state.returnSummarySteps.includes(action.payload)
        ? { ...state, returnSummarySteps: state.returnSummarySteps.filter(s => s !== action.payload) }
        : { ...state, returnSummarySteps: [...state.returnSummarySteps, action.payload] };
    
    case "ADD_ONWARD_REMARKS":
      return { 
        ...state, 
        onward: { ...state.onward, remarks: action.payload } 
      };

    case "ADD_RETURN_REMARKS":
      return { 
        ...state, 
        returnJourney: state.returnJourney 
          ? { ...state.returnJourney, remarks: action.payload }
          : undefined
      };

    case "RESET":
      return initialState;    
      
    default:
      return state;
  }
}
