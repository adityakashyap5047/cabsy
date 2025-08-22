import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to calculate distance between two points (mockup for now)
export function calculateDistance(_from: string, _to: string): number {
  // Mock calculation - in real app this would use Google Maps/Mapbox API
  const mockDistance = Math.floor(Math.random() * 50) + 5; // Random distance between 5-55 km
  return mockDistance;
}

// Utility function to calculate fare based on distance and stops
export function calculateFare(
  distance: number, 
  stops: number = 0, 
  isReturnJourney: boolean = false
): number {
  const baseFarePerKm = 15;
  const stopCharge = 25; // Additional charge per stop
  const returnJourneyDiscount = 0.15; // 15% discount for return journey
  
  let totalFare = distance * baseFarePerKm;
  totalFare += stops * stopCharge;
  
  if (isReturnJourney) {
    totalFare = totalFare * (1 - returnJourneyDiscount);
  }
  
  return Math.round(totalFare);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Generate unique booking ID
export function generateBookingId(): string {
  return 'CB' + Date.now().toString(36).toUpperCase();
}