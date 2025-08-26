'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FinalDetails = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [guestData, setGuestData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [showDataInfo, setShowDataInfo] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', loginData);
    // Add login logic here
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guest data:', guestData);
    // Add guest checkout logic here
  };

  return (
    <div>
      <div className="px-14 py-4">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            Your total is <span className="text-yellow-600 font-semibold">$124.50</span>
          </h1>
          <p className="text-gray-600">
            Please{' '}
            <span className="font-medium text-gray-800">Log In</span>
            {' '}to your account or{' '}
            <span className="font-medium text-gray-800">continue as guest</span>
            {' '}to book your reservation.
          </p>
        </div>
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0 md:px-8">
        {/* Login Section */}
        <div className="w-full md:w-1/2 flex flex-col px-6 py-8">
          <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Log In to your account</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-700 font-medium">
                  Email Address or Username
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="text"
                  placeholder="Email Address / Username"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                  required
                />
              </div>

              <div className="text-left">
                <button
                  type="button"
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Register Now
                </button>
              </div>

              <div className='text-center'>
                <Button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-18 rounded-none transition-colors duration-200"
                >
                    Log in
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:flex items-stretch">
          <div className="w-px bg-gray-300 mx-0 h-full" />
        </div>
        {/* Guest Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8">
          <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Continue as guest</h2>
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

              {/* Why do we need this data? */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowDataInfo(!showDataInfo)}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center"
                >
                  Why do we need this data?
                </button>
                {showDataInfo && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-gray-600">
                    We collect this information to:
                    <ul className="mt-1 ml-4 list-disc">
                      <li>Send you booking confirmations and updates</li>
                      <li>Contact you if there are any changes to your ride</li>
                      <li>Provide customer support when needed</li>
                    </ul>
                  </div>
                )}
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

export default FinalDetails;
