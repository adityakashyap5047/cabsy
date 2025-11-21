'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface BookingData {
  sessionId: string;
  totalAmount: number;
  returnEnabled: boolean;
  passengers: Array<{
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
  }>;
  onwardJourney: {
    serviceType: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: string;
    pickupPostcode: string;
    dropoffLocation: string;
    dropoffPostcode: string;
    stops?: Array<{
      location: string;
      postcode: string;
    }> | null;
    passengers: number;
    luggage: number;
    vehicleType?: string | null;
    remarks?: string | null;
  };
  returnJourney?: {
    serviceType: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: string;
    pickupPostcode: string;
    dropoffLocation: string;
    dropoffPostcode: string;
    stops?: Array<{
      location: string;
      postcode: string;
    }> | null;
    passengers: number;
    luggage: number;
    vehicleType?: string | null;
    remarks?: string | null;
  } | null;
  expiresAt: Date;
}

interface CheckoutFormProps {
  bookingData: BookingData;
  sessionId: string | null;
}

const CheckoutForm = ({ bookingData, sessionId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const total = bookingData.totalAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);
    setStatus(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const res = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?sessionId=${sessionId}`,
      },
    });

    console.log(res);
    if (res.error) {
      setErrorMessage(res.error.message || 'An unexpected error occurred.');
      setStatus('failed');
    } else {
      setStatus('success');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 my-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-md shadow space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Secure Payment Checkout
        </h2>

        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
          <div className="flex justify-between text-sm pb-1">
            <span>Ride Booking</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {bookingData.returnEnabled && (
            <div className="flex justify-between text-xs text-gray-600 pb-1">
              <span>• Return journey included</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-gray-600 pb-1">
            <span>• {bookingData.passengers.length} passenger{bookingData.passengers.length > 1 ? 's' : ''}</span>
          </div>

          <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <PaymentElement />

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full flex items-center justify-center gap-2 bg-[#AE9409] text-white py-3 rounded-md hover:bg-[#8B7507] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>

        {errorMessage && (
          <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
            <XCircle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
            <CheckCircle className="w-5 h-5" />
            Payment successful!
          </div>
        )}

        {status === 'failed' && (
          <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
            <XCircle className="w-5 h-5" />
            Payment failed. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;