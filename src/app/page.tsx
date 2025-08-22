"use client";

import React, { useState } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingFormData, FareBreakdown } from '@/types/booking';
import { generateBookingId } from '@/lib/utils';

type BookingStep = 'form' | 'summary' | 'payment';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('form');
  const [bookingData, setBookingData] = useState<BookingFormData & { fareBreakdown: FareBreakdown } | null>(null);
  const [bookingId, setBookingId] = useState<string>('');

  const handleBookingSubmit = (data: BookingFormData & { fareBreakdown: FareBreakdown }) => {
    setBookingData(data);
    setBookingId(generateBookingId());
    setCurrentStep('summary');
  };

  const handleEditBooking = () => {
    setCurrentStep('form');
  };

  const handlePayment = () => {
    // In a real app, this would integrate with Razorpay/Stripe
    alert('Payment integration will be implemented here. For demo purposes, booking is confirmed!');
    setCurrentStep('payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'form' && (
        <BookingForm onSubmit={handleBookingSubmit} />
      )}

      {currentStep === 'summary' && bookingData && (
        <BookingSummary
          booking={bookingData}
          bookingId={bookingId}
          onPayment={handlePayment}
          onEdit={handleEditBooking}
        />
      )}

      {currentStep === 'payment' && (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your booking has been confirmed. You will receive a confirmation SMS and email shortly.</p>
          <p className="text-sm text-gray-500">Booking ID: <span className="font-mono font-bold">{bookingId}</span></p>
        </div>
      )}
    </div>
  );
}
