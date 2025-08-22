export interface BookingStop {
  id: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  estimatedTime?: string;
  waitingTime?: number; // in minutes
}

export interface Journey {
  id: string;
  from: string;
  to: string;
  stops: BookingStop[];
  date: string;
  time: string;
  distance?: number;
  fare?: number;
  estimatedDuration?: number; // in minutes
}

export interface BookingFormData {
  pickup: string;
  destination: string;
  stops: BookingStop[];
  departureDate: string;
  departureTime: string;
  passengerCount: number;
  contactNumber: string;
  isReturnJourney: boolean;
  returnJourney?: {
    date: string;
    time: string;
    durationBetween?: number; // hours between forward and return journey
  };
  specialRequirements?: string;
}

export interface FareBreakdown {
  baseDistance: number;
  baseFare: number;
  stopCharges: number;
  totalStops: number;
  returnDiscount?: number;
  finalFare: number;
  perKmRate: number;
  stopRate: number;
}

export interface BookingDetails extends BookingFormData {
  id: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  forwardJourney: Journey;
  returnJourney?: Journey;
  totalFare: number;
  fareBreakdown: FareBreakdown;
  createdAt: string;
  updatedAt: string;
}

export type CabType = 'economy' | 'premium' | 'luxury';

export interface CabOption {
  type: CabType;
  name: string;
  capacity: number;
  priceMultiplier: number;
  features: string[];
}