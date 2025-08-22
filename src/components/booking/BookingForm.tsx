"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Minus, MapPin, Clock, Calendar, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookingStop, BookingFormData, FareBreakdown } from '@/types/booking';
import { calculateDistance, calculateFare, formatCurrency, generateBookingId } from '@/lib/utils';

interface BookingFormProps {
  onSubmit: (data: BookingFormData & { fareBreakdown: FareBreakdown }) => void;
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    pickup: '',
    destination: '',
    stops: [],
    departureDate: '',
    departureTime: '',
    passengerCount: 1,
    contactNumber: '',
    isReturnJourney: false,
    specialRequirements: '',
  });

  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown>({
    baseDistance: 0,
    baseFare: 0,
    stopCharges: 0,
    totalStops: 0,
    finalFare: 0,
    perKmRate: 15,
    stopRate: 25,
  });

  const [currentStop, setCurrentStop] = useState('');

  // Calculate fare whenever form data changes
  useEffect(() => {
    if (formData.pickup && formData.destination) {
      const distance = calculateDistance(formData.pickup, formData.destination);
      const totalStops = formData.stops.length;
      const baseFare = distance * 15; // ₹15 per km
      const stopCharges = totalStops * 25; // ₹25 per stop
      const finalFare = calculateFare(distance, totalStops, formData.isReturnJourney);
      
      setFareBreakdown({
        baseDistance: distance,
        baseFare,
        stopCharges,
        totalStops,
        returnDiscount: formData.isReturnJourney ? baseFare * 0.15 : undefined,
        finalFare,
        perKmRate: 15,
        stopRate: 25,
      });
    }
  }, [formData.pickup, formData.destination, formData.stops, formData.isReturnJourney]);

  const addStop = () => {
    if (currentStop.trim()) {
      const newStop: BookingStop = {
        id: generateBookingId(),
        location: currentStop.trim(),
        waitingTime: 10, // Default 10 minutes waiting time
      };
      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, newStop],
      }));
      setCurrentStop('');
    }
  };

  const removeStop = (stopId: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.id !== stopId),
    }));
  };

  const updateStopWaitingTime = (stopId: string, waitingTime: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map(stop =>
        stop.id === stopId ? { ...stop, waitingTime } : stop
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, fareBreakdown });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Cab</h1>
        <p className="text-gray-600">Plan your journey with multiple stops and return options</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup and Destination */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Pickup Location
            </label>
            <Input
              type="text"
              placeholder="Enter pickup location"
              value={formData.pickup}
              onChange={(e) => setFormData(prev => ({ ...prev, pickup: e.target.value }))}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Destination
            </label>
            <Input
              type="text"
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Multiple Stops */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Stops</h3>
          
          {/* Add Stop Input */}
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Add a stop location"
              value={currentStop}
              onChange={(e) => setCurrentStop(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())}
            />
            <Button type="button" onClick={addStop} disabled={!currentStop.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Add Stop
            </Button>
          </div>

          {/* Current Stops */}
          {formData.stops.length > 0 && (
            <div className="space-y-3">
              {formData.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                  <div className="flex-1">
                    <span className="font-medium">Stop {index + 1}: {stop.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Wait time:</label>
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={stop.waitingTime || 10}
                      onChange={(e) => updateStopWaitingTime(stop.id, parseInt(e.target.value) || 10)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">min</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStop(stop.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Departure Date
            </label>
            <Input
              type="date"
              min={today}
              value={formData.departureDate}
              onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Departure Time
            </label>
            <Input
              type="time"
              value={formData.departureTime}
              onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Return Journey */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="returnJourney"
              checked={formData.isReturnJourney}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                isReturnJourney: e.target.checked,
                returnJourney: e.target.checked ? { date: '', time: '' } : undefined
              }))}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="returnJourney" className="font-medium text-gray-900">
              Book Return Journey (15% discount)
            </label>
          </div>

          {formData.isReturnJourney && (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                <Input
                  type="date"
                  min={formData.departureDate || today}
                  value={formData.returnJourney?.date || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    returnJourney: { ...prev.returnJourney!, date: e.target.value }
                  }))}
                  required={formData.isReturnJourney}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Time</label>
                <Input
                  type="time"
                  value={formData.returnJourney?.time || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    returnJourney: { ...prev.returnJourney!, time: e.target.value }
                  }))}
                  required={formData.isReturnJourney}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stay Duration (hours)</label>
                <Input
                  type="number"
                  min="1"
                  max="720"
                  placeholder="24"
                  value={formData.returnJourney?.durationBetween || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    returnJourney: { ...prev.returnJourney!, durationBetween: parseInt(e.target.value) || undefined }
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Number of Passengers
            </label>
            <Input
              type="number"
              min="1"
              max="8"
              value={formData.passengerCount}
              onChange={(e) => setFormData(prev => ({ ...prev, passengerCount: parseInt(e.target.value) || 1 }))}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Contact Number
            </label>
            <Input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.contactNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements (Optional)
          </label>
          <Textarea
            placeholder="Any special requirements or instructions..."
            value={formData.specialRequirements || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
            className="w-full"
            rows={3}
          />
        </div>

        {/* Fare Summary */}
        {fareBreakdown.finalFare > 0 && (
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fare Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base fare ({fareBreakdown.baseDistance} km × ₹{fareBreakdown.perKmRate}/km):</span>
                <span>{formatCurrency(fareBreakdown.baseFare)}</span>
              </div>
              {fareBreakdown.totalStops > 0 && (
                <div className="flex justify-between">
                  <span>Stop charges ({fareBreakdown.totalStops} stops × ₹{fareBreakdown.stopRate}):</span>
                  <span>{formatCurrency(fareBreakdown.stopCharges)}</span>
                </div>
              )}
              {fareBreakdown.returnDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Return journey discount (15%):</span>
                  <span>-{formatCurrency(fareBreakdown.returnDiscount)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Fare:</span>
                <span className="text-green-600">{formatCurrency(fareBreakdown.finalFare)}</span>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-lg" disabled={fareBreakdown.finalFare === 0}>
          Book Cab - {formatCurrency(fareBreakdown.finalFare)}
        </Button>
      </form>
    </div>
  );
}