"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FareEstimate {
  base: number;
  stoppages: number;
  total: number;
}

const serviceTypes = [
  { value: "from_airport", label: "From Airport" },
  { value: "to_airport", label: "To Airport" },
  { value: "point_to_point", label: "Point-to-Point" },
  { value: "hourly", label: "Hourly Car Service" },
  { value: "wedding", label: "Wedding Car Service" },
];

const cabTypes = [
  { value: "sedan", label: "Sedan", price: 25 },
  { value: "suv", label: "SUV", price: 35 },
  { value: "luxury", label: "Luxury", price: 50 },
  { value: "mini", label: "Mini", price: 20 },
];

const RidePage = () => {
  const [formData, setFormData] = useState({
    serviceType: "point_to_point",
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropLocation: "",
    returnRide: false,
    durationBetweenTrips: 30,
    cabType: "sedan",
  });

  const [stoppages, setStoppages] = useState([""]);
  const [fareEstimate, setFareEstimate] = useState<FareEstimate | null>(null);

  const addStoppage = () => setStoppages([...stoppages, ""]);
  
  const removeStoppage = (idx: number) => {
    const stops = stoppages.filter((_, i) => i !== idx);
    setStoppages(stops.length === 0 ? [""] : stops);
  };

  const updateStoppage = (idx: number, value: string) => {
    const stops = [...stoppages];
    stops[idx] = value;
    setStoppages(stops);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateFare = () => {
    const baseCab = cabTypes.find(cab => cab.value === formData.cabType);
    const baseRate = baseCab ? baseCab.price : 25;
    const stoppageRate = stoppages.filter(stop => stop.trim()).length * 10;
    const subtotal = baseRate + stoppageRate;
    const total = formData.returnRide ? Math.round(subtotal * 1.8) : subtotal;
    
    setFareEstimate({
      base: baseRate,
      stoppages: stoppageRate,
      total: total
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculateFare();
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#d4a574' }} className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              Cabsy
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-yellow-100 transition">
                Home
              </Link>
              <Link href="/dashboard" className="text-white hover:text-yellow-100 transition">
                Dashboard
              </Link>
              <Link href="/captain" className="text-white hover:text-yellow-100 transition">
                Captain
              </Link>
              <Link href="/auth" className="text-white hover:text-yellow-100 transition">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px]">
              <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#f8f8f5' }}>
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
                  <p className="text-gray-500">Live tracking and route optimization</p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                      <span className="text-sm text-gray-600">Pickup Location</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                      <span className="text-sm text-gray-600">Drop Location</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
                      <span className="text-sm text-gray-600">Stop Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: '#fef3c7' }}>
                  <svg className="w-6 h-6" style={{ color: '#d4a574' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8V7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Book Your Ride</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  >
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Pick-Up Date</label>
                    <input 
                      type="date" 
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Pick-Up Time</label>
                    <input 
                      type="time" 
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      required 
                    />
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#22c55e' }}></span>
                        Pick-Up Location
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      placeholder="Enter pick-up location" 
                      required 
                    />
                  </div>
                  
                  {/* Stoppages */}
                  {stoppages.map((stop, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <span className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#f59e0b' }}></span>
                          Stop {idx + 1} (Optional)
                        </span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder={`Stop ${idx + 1} location`}
                          value={stop}
                          onChange={e => updateStoppage(idx, e.target.value)}
                        />
                        {stoppages.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeStoppage(idx)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                          >
                            ✕
                          </button>
                        )}
                        {idx === stoppages.length - 1 && (
                          <Button onClick={addStoppage}
                            className="px-6 py-2 text-red-500 rounded-xl hover:opacity-90 transition-all font-semibold"
                            style={{ backgroundColor: '#d4a574' }} variant={"ghost"}>
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#ef4444' }}></span>
                        Drop-Off Location
                      </span>
                    </label>
                    <input 
                      type="text" 
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      placeholder="Enter drop-off location" 
                      required 
                    />
                  </div>
                </div>

                {/* Return Ride Option */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#fef3c7' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <input 
                      type="checkbox" 
                      id="returnRide"
                      name="returnRide"
                      checked={formData.returnRide}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300"
                      style={{ accentColor: '#d4a574' }}
                    />
                    <label htmlFor="returnRide" className="text-sm font-semibold text-gray-700">
                      Return Journey
                    </label>
                  </div>
                  {formData.returnRide && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Duration Between Trips (minutes)
                      </label>
                      <input 
                        type="number" 
                        name="durationBetweenTrips"
                        value={formData.durationBetweenTrips}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        min="15" 
                        max="480"
                        placeholder="Duration between trips" 
                      />
                    </div>
                  )}
                </div>

                {/* Cab Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Choose Cab Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cabTypes.map((cab) => (
                      <div key={cab.value} className="relative">
                        <input
                          type="radio"
                          id={cab.value}
                          name="cabType"
                          value={cab.value}
                          checked={formData.cabType === cab.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={cab.value}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.cabType === cab.value
                              ? 'border-opacity-100 text-white'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          style={formData.cabType === cab.value ? { 
                            backgroundColor: '#d4a574', 
                            borderColor: '#d4a574' 
                          } : {}}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{cab.label}</div>
                            <div className="text-sm opacity-75">${cab.price}/base</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full text-white py-5 px-6 rounded-xl font-bold text-lg hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ backgroundColor: '#d4a574' }}
                >
                  Calculate Fare & Book Ride
                </button>
              </form>

              {/* Fare Display */}
              {fareEstimate && (
                <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Fare Estimate</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Rate:</span>
                      <span className="font-semibold">${fareEstimate.base}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stoppages:</span>
                      <span className="font-semibold">${fareEstimate.stoppages}</span>
                    </div>
                    {formData.returnRide && (
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Return Multiplier:</span>
                        <span className="font-semibold">×1.8</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                        ${fareEstimate.total}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RidePage;