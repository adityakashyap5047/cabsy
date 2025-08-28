// Types for Stripe payment integration

export interface PaymentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface BookingDetails {
  amount: number;
  billingDetails: BillingDetails;
  timestamp: string;
  passengerCount?: number;
  vehicleType?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  scheduledTime?: string;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PaymentConfirmationRequest {
  paymentIntentId: string;
  bookingDetails: BookingDetails;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  paymentStatus: string;
  message: string;
  bookingId?: string;
  paymentIntentId?: string;
  amountReceived?: number;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export interface ApiError {
  error: string;
  details?: string;
}
