"use client";

import React from 'react';
import { Calendar, Clock, MapPin, Users, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingFormData, FareBreakdown } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface BookingSummaryProps {
  booking: BookingFormData & { fareBreakdown: FareBreakdown };
  bookingId: string;
  onPayment: () => void;
  onEdit: () => void;
}

export function BookingSummary({ booking, bookingId, onPayment, onEdit }: BookingSummaryProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-xl text-gray-600">Booking ID: <span className="font-mono font-bold text-blue-600">{bookingId}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Journey Details */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">Pickup</p>
                  <p className="text-gray-600">{booking.pickup}</p>
                </div>
              </div>

              {booking.stops.length > 0 && (
                <div className="ml-8 space-y-2">
                  {booking.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mt-2"></div>
                      <div>
                        <p className="font-medium">Stop {index + 1}</p>
                        <p className="text-gray-600">{stop.location}</p>
                        <p className="text-sm text-gray-500">Wait time: {stop.waitingTime} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="font-medium">Destination</p>
                  <p className="text-gray-600">{booking.destination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Journey */}
          {booking.isReturnJourney && booking.returnJourney && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Journey</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(booking.returnJourney.date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(booking.returnJourney.time)}</span>
                </div>
                {booking.returnJourney.durationBetween && (
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4" />
                    <span>Stay duration: {booking.returnJourney.durationBetween} hours</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Requirements */}
          {booking.specialRequirements && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h3>
              <p className="text-gray-600">{booking.specialRequirements}</p>
            </div>
          )}
        </div>

        {/* Booking & Fare Details */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-medium">Departure Date</p>
                  <p className="text-gray-600">{formatDate(booking.departureDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-medium">Departure Time</p>
                  <p className="text-gray-600">{formatTime(booking.departureTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-medium">Passengers</p>
                  <p className="text-gray-600">{booking.passengerCount} person(s)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">{booking.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fare Breakdown */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fare Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base fare ({booking.fareBreakdown.baseDistance} km):</span>
                <span>{formatCurrency(booking.fareBreakdown.baseFare)}</span>
              </div>
              
              {booking.fareBreakdown.totalStops > 0 && (
                <div className="flex justify-between">
                  <span>Stop charges ({booking.fareBreakdown.totalStops} stops):</span>
                  <span>{formatCurrency(booking.fareBreakdown.stopCharges)}</span>
                </div>
              )}
              
              {booking.fareBreakdown.returnDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Return journey discount:</span>
                  <span>-{formatCurrency(booking.fareBreakdown.returnDiscount)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Total Amount:</span>
                <span className="text-green-600">{formatCurrency(booking.fareBreakdown.finalFare)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={onPayment} className="w-full h-12 text-lg">
              Proceed to Payment - {formatCurrency(booking.fareBreakdown.finalFare)}
            </Button>
            <Button onClick={onEdit} variant="outline" className="w-full">
              Edit Booking Details
            </Button>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Information:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Please be ready 10 minutes before the scheduled pickup time</li>
          <li>• Driver details will be shared 30 minutes before pickup</li>
          <li>• Cancellation charges apply if cancelled less than 4 hours before pickup</li>
          <li>• For any changes or queries, contact our support team</li>
        </ul>
      </div>
    </div>
  );
}