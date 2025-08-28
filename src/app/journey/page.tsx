'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Car, 
  Phone, 
  MessageCircle, 
  Navigation, 
  User, 
  Star,
  Timer,
  Route
} from 'lucide-react';

interface JourneyStatus {
  status: 'assigned' | 'on_way' | 'arrived' | 'in_progress' | 'completed';
  driverLocation: { lat: number; lng: number; };
  estimatedArrival: string;
  currentLocation: string;
  completedPercentage: number;
}

const JourneyPage = () => {
  const router = useRouter();
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>({
    status: 'assigned',
    driverLocation: { lat: 40.7128, lng: -74.0060 },
    estimatedArrival: '2:25 PM',
    currentLocation: 'Heading to pickup location',
    completedPercentage: 0
  });

  const [bookingDetails] = useState({
    bookingId: `CB${Date.now()}`,
    pickup: 'New York City, NY',
    dropoff: 'LaGuardia Airport, NY',
    vehicle: 'Premium Sedan',
    driverName: 'John Smith',
    driverPhone: '+1 (555) 123-4567',
    driverRating: 4.8,
    licensePlate: 'NYC 1234',
    amount: '299.99'
  });

  // Simulate journey progress
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setJourneyStatus(prev => {
        let newStatus = prev.status;
        let newPercentage = prev.completedPercentage;
        let newLocation = prev.currentLocation;

        if (prev.completedPercentage < 25 && prev.status === 'assigned') {
          newStatus = 'on_way';
          newLocation = 'Driver is on the way to pickup location';
        } else if (prev.completedPercentage >= 25 && prev.completedPercentage < 30 && prev.status === 'on_way') {
          newStatus = 'arrived';
          newLocation = 'Driver has arrived at pickup location';
        } else if (prev.completedPercentage >= 30 && prev.completedPercentage < 35 && prev.status === 'arrived') {
          newStatus = 'in_progress';
          newLocation = 'Journey in progress to destination';
        } else if (prev.completedPercentage >= 100) {
          newStatus = 'completed';
          newLocation = 'Journey completed';
          clearInterval(progressTimer);
        }

        newPercentage = Math.min(prev.completedPercentage + 2, 100);

        return {
          ...prev,
          status: newStatus,
          completedPercentage: newPercentage,
          currentLocation: newLocation
        };
      });
    }, 1000);

    return () => clearInterval(progressTimer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500';
      case 'on_way': return 'bg-yellow-500';
      case 'arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Driver Assigned';
      case 'on_way': return 'Driver On Way';
      case 'arrived': return 'Driver Arrived';
      case 'in_progress': return 'Journey in Progress';
      case 'completed': return 'Journey Completed';
      default: return 'Unknown Status';
    }
  };

  const handleCallDriver = () => {
    window.open(`tel:${bookingDetails.driverPhone}`);
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a chat interface
    alert('Chat feature will be available soon!');
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Current Journey',
        text: `I'm on my way from ${bookingDetails.pickup} to ${bookingDetails.dropoff}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Journey link copied to clipboard!');
    }
  };

  const handleBackToBooking = () => {
    router.push('/ride');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Journey
          </h1>
          <p className="text-gray-600">
            Booking ID: <span className="font-mono font-medium">{bookingDetails.bookingId}</span>
          </p>
        </div>

        {/* Status Progress */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Journey Status</h2>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(journeyStatus.status)}`}>
              {getStatusText(journeyStatus.status)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{journeyStatus.completedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${journeyStatus.completedPercentage}%` }}
              ></div>
            </div>
          </div>

          <p className="text-gray-700">{journeyStatus.currentLocation}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Driver</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-200 rounded-full p-3">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{bookingDetails.driverName}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{bookingDetails.driverRating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{bookingDetails.vehicle}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  #
                </div>
                <span className="text-gray-700">{bookingDetails.licensePlate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Timer className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">ETA: {journeyStatus.estimatedArrival}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleCallDriver}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                onClick={handleMessageDriver}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </Card>

          {/* Trip Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.pickup}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full mt-1">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Drop-off Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.dropoff}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Estimated Arrival</p>
                  <p className="font-medium text-gray-900">{journeyStatus.estimatedArrival}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Fare</span>
                  <span className="text-lg font-bold text-gray-900">${bookingDetails.amount}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
            <Button
              onClick={handleShareLocation}
              variant="outline"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Share Location
            </Button>
          </div>
          
          {/* Map Placeholder - In a real app, integrate with Google Maps or similar */}
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <Route className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map will be displayed here</p>
              <p className="text-sm text-gray-500">Real-time tracking of your journey</p>
            </div>
          </div>
        </Card>

        {/* Additional Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            onClick={handleBackToBooking}
            variant="outline"
            className="px-6 py-2"
          >
            Book Another Ride
          </Button>
          
          {journeyStatus.status === 'completed' && (
            <Button
              onClick={() => router.push('/ride')}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2"
            >
              Rate Your Experience
            </Button>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium">Emergency Support</p>
          <p className="text-red-600 text-sm">
            For urgent assistance, call: <span className="font-bold">+1 (800) CABSY-24</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JourneyPage;
