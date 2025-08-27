'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, PenBox, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const Checkout = () => {

    const [guestData, setGuestData] = useState({
        firstName: 'Aditya',
        lastName: 'Kumar',
        phoneNumber: '9341543488',
        email: 'adityakumar247365@gmail.com'
    });

    const [passengers, setPassengers] = useState<Array<{
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
    }>>([]);
  
    const [showAddPassenger, setShowAddPassenger] = useState(false);
    const [newPassenger, setNewPassenger] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });
  
    const [passengerErrors, setPassengerErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });

    const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPassenger(prev => ({
          ...prev,
          [name]: value
        }));
        // Clear error when user starts typing
        if (passengerErrors[name as keyof typeof passengerErrors]) {
          setPassengerErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      };
    
      const validatePassenger = () => {
        const errors = {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: ''
        };
    
        if (!newPassenger.firstName.trim()) {
          errors.firstName = 'First name is required';
        }
    
        if (!newPassenger.lastName.trim()) {
          errors.lastName = 'Last name is required';
        }
    
        if (newPassenger.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(newPassenger.phoneNumber)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        }
    
        if (newPassenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPassenger.email)) {
          errors.email = 'Please enter a valid email address';
        }
    
        setPassengerErrors(errors);
        return !errors.firstName && !errors.lastName && !errors.phoneNumber && !errors.email;
      };
    
      const handleAddPassenger = () => {
        if (validatePassenger()) {
          const passenger = {
            id: Date.now(),
            ...newPassenger
          };
          setPassengers(prev => [...prev, passenger]);
          setShowAddPassenger(false);
          setNewPassenger({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
          });
        }
      };
    
      const handleRemovePassenger = (id: number) => {
        setPassengers(prev => prev.filter(p => p.id !== id));
      };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guest data:', guestData);
    // Add guest checkout logic here
  };

  return (
    <div className='mt-4'>
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0 md:px-8">
        {/* Login Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8">
          <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Passenger Information</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleGuestSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-firstname" className="text-gray-700 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="guest-firstname"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={guestData.firstName}
                    onChange={handleGuestChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-lastname" className="text-gray-700 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="guest-lastname"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={guestData.lastName}
                    onChange={handleGuestChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="guest-phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="guest-phone"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={guestData.phoneNumber}
                  onChange={handleGuestChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="guest-email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="guest-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={guestData.email}
                  onChange={handleGuestChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>
            </form>
            {/* <div className="flex justify-end my-2"> */}
            <div className="space-y-4">
                {/* Add Passenger Button */}
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant={"primary"} 
                    className={`flex gap-2 ml-4 cursor-pointer items-center font-semibold text-xs transition-all duration-300 transform hover:scale-105 text-[#AE9409]`}
                    onClick={() => setShowAddPassenger(!showAddPassenger)}
                  >
                    <div className={`transition-transform duration-300 ${showAddPassenger ? 'rotate-180' : 'rotate-0'}`}>
                      {showAddPassenger ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                    <span className="hover:underline transition-all duration-200">
                      Add Passenger 
                    </span>
                  </Button>
                </div>
                
                {/* Add Passenger Form */}
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  showAddPassenger 
                    ? 'max-h-[600px] opacity-100 transform translate-y-0 scale-100' 
                    : 'max-h-0 opacity-0 transform -translate-y-6 scale-95'
                }`}>
                  <div className={`p-4 space-y-4 transition-all duration-500 ease-in-out ${
                    showAddPassenger 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform -translate-y-4 opacity-0'
                  }`}>
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="passenger-first-name" className="text-gray-700 font-medium">
                            First Name
                            </Label>
                            <Input
                            id="passenger-first-name"
                            name="firstName"
                            placeholder="First Name"
                            value={newPassenger.firstName}
                            onChange={handlePassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                passengerErrors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                            />
                            {passengerErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{passengerErrors.firstName}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <Label htmlFor="passenger-last-name" className="text-gray-700 font-medium">
                            Last Name
                            </Label>
                            <Input
                            id="passenger-last-name"
                            name="lastName"
                            placeholder="Last Name"
                            value={newPassenger.lastName}
                            onChange={handlePassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                passengerErrors.lastName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                            />
                            {passengerErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{passengerErrors.lastName}</p>
                            )}
                        </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                        <Label htmlFor="passenger-phone" className="text-gray-700 font-medium">
                            Phone Number (Optional)
                        </Label>
                        <Input
                            id="passenger-phone"
                            name="phoneNumber"
                            placeholder="(555) 555-5555"
                            value={newPassenger.phoneNumber}
                            onChange={handlePassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                            passengerErrors.phoneNumber ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                        />
                        <p className="text-xs text-gray-500">International must have preceding + sign and country code</p>
                        {passengerErrors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{passengerErrors.phoneNumber}</p>
                        )}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1">
                        <Label htmlFor="passenger-email" className="text-gray-700 font-medium">
                            Email Address (Optional)
                        </Label>
                        <Input
                            id="passenger-email"
                            name="email"
                            type="email"
                            placeholder=""
                            value={newPassenger.email}
                            onChange={handlePassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                            passengerErrors.email ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                        />
                        {passengerErrors.email && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{passengerErrors.email}</p>
                        )}
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-end">
                        <Button
                            type="button"
                            variant={"primary"}
                            onClick={handleAddPassenger}
                            className="rounded-none cursor-pointer border border-[#AE9409] text-[#AE9409] hover:text-white hover:bg-[#AE9409] font-medium py-2 px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                          Add
                        </Button>
                        </div>
                    </div>
                </div>

                {/* Passenger List */}
                {passengers.length > 0 && (
                    <div className="space-y-3 mb-4">
                    <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800">Additional Passenger</h2>
                  </div>
                    {passengers.map((passenger) => (
                        <div key={passenger.id} className="p-3 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">
                                {passenger.firstName} {passenger.lastName}
                            </p>
                            {passenger.phoneNumber && (
                                <p className="text-sm font-semibold text-gray-400">{passenger.phoneNumber}</p>
                            )}
                            {passenger.email && (
                                <p className="text-sm font-semibold text-gray-400">{passenger.email}</p>
                            )}
                            </div>
                            <button
                            type="button"
                            onClick={() => handleRemovePassenger(passenger.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            >
                              <Trash2 />
                            </button>
                            <button
                            type="button"
                            onClick={() => handleRemovePassenger(passenger.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            >
                              <PenBox />
                            </button>
                          </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
            {/* </div> */}
            <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Additional Information</h2>
            </div>
            <Label className='mt-4 mb-2'>Other Comments or Special Requests (Optional)</Label>
            <Textarea className='rounded-none' />
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:flex items-stretch">
          <div className="w-px bg-gray-300 mx-0 h-full" />
        </div>
        {/* Guest Section */}
        <div className="w-full md:w-1/2 flex flex-col px-6 py-8">
          <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Return Service</h2>
          </div>
          <div className='flex items-center px-4 mt-2'>
            <p>Would you like to book return service?</p>
            <Button variant={"primary"} className='bg-red-500 rounded-none ml-4'>Yes</Button>
            <Button variant={"primary"} className='bg-slate-700 rounded-none'>No</Button>
          </div>
          <div className="p-6">
            <form onSubmit={handleGuestSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-firstname" className="text-gray-700 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="guest-firstname"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={guestData.firstName}
                    onChange={handleGuestChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-lastname" className="text-gray-700 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="guest-lastname"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={guestData.lastName}
                    onChange={handleGuestChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="guest-phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="guest-phone"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={guestData.phoneNumber}
                  onChange={handleGuestChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="guest-email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="guest-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={guestData.email}
                  onChange={handleGuestChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-white hover:bg-gray-50 text-yellow-600 border-2 border-yellow-600 font-medium py-3 px-8 rounded-none transition-colors duration-200"
                >
                  Continue as guest
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
