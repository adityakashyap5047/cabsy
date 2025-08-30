'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, MapPin, Clock, Users, Car, CreditCard } from 'lucide-react';
import { usePaymentGuard } from '@/hooks/useRouteGuard';

const ConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  usePaymentGuard(); // Just call the hook without destructuring unused functions
  const [bookingDetails, setBookingDetails] = useState<{
    bookingId: string;
    paymentIntentId: string;
    amount: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    vehicle: string;
    passengers: number;
    driverName: string;
    driverPhone: string;
    estimatedArrival: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check if user is authorized to view this page
  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    
    // Check if this is a valid redirect from payment (has required parameters)
    if (!paymentIntentId || !amount || status !== 'success') {
      // Redirect to ride booking page if accessing directly
      router.replace('/ride');
      return;
    }

    // Only set if not already authorized (prevent infinite re-renders)
    if (!isAuthorized) {
      setIsAuthorized(true);
      // Use direct sessionStorage instead of setSession to avoid dependency issues
      sessionStorage.setItem('payment_confirmed', 'true');
      sessionStorage.setItem('confirmation_timestamp', Date.now().toString());
      
      // In a real app, you'd fetch booking details from your backend using the payment intent ID
      // For now, we'll use mock data or localStorage
      const mockBookingDetails = {
        bookingId: `CB1423ljlsfjl432`,
        paymentIntentId: paymentIntentId || 'pi_mock_123',
        amount: amount || '299.99',
        pickup: 'New York City, NY',
        dropoff: 'LaGuardia Airport, NY',
        date: new Date().toLocaleDateString(),
        time: '2:30 PM',
        vehicle: 'Premium Sedan',
        passengers: 2,
        driverName: 'John Smith',
        driverPhone: '+1 (555) 123-4567',
        estimatedArrival: '2:25 PM'
      };

      setBookingDetails(mockBookingDetails);
    }
  }, [searchParams, router, isAuthorized]);

  // Auto redirect countdown
  useEffect(() => {
    if (!isAuthorized) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthorized]);

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isAuthorized) {
      // Clear confirmation session and redirect to journey
      sessionStorage.removeItem('payment_confirmed');
      sessionStorage.setItem('journey_active', 'true');
      router.replace('/journey');
    }
  }, [countdown, isAuthorized, router]);

  const handleGoToJourney = () => {
    // Clear confirmation session and redirect to journey
    sessionStorage.removeItem('payment_confirmed');
    sessionStorage.setItem('journey_active', 'true');
    router.replace('/journey');
  };

  const handleBookAnother = () => {
    // Clear all sessions and go to ride booking
    sessionStorage.removeItem('payment_confirmed');
    sessionStorage.removeItem('journey_active');
    router.replace('/ride');
  };

  // Show loading while checking authorization
  if (!isAuthorized || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your cab has been booked successfully. Payment processed.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.pickup}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drop-off Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.dropoff}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900">{bookingDetails.date} at {bookingDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Car className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium text-gray-900">{bookingDetails.vehicle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-medium text-gray-900">{bookingDetails.passengers} person(s)</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">${bookingDetails.amount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="text-lg font-bold text-gray-900 font-mono">{bookingDetails.bookingId}</p>
            </div>
          </div>

          {/* Driver Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Information</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{bookingDetails.driverName}</p>
                <p className="text-sm text-gray-500">{bookingDetails.driverPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Arrival</p>
                <p className="font-medium text-gray-900">{bookingDetails.estimatedArrival}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              Redirecting to journey tracking in <span className="font-bold text-yellow-900">{countdown}</span> seconds...
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoToJourney}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-3 px-8 rounded-lg"
            >
              Track Your Journey
            </Button>
            
            <Button
              onClick={handleBookAnother}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-lg"
            >
              Book Another Ride
            </Button>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-2">Important Information:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your driver will arrive 5 minutes before the scheduled time</li>
            <li>• Please be ready with a valid ID for verification</li>
            <li>• You can track your ride in real-time on the journey page</li>
            <li>• For any issues, call our support at +1 (800) CABSY-24</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
