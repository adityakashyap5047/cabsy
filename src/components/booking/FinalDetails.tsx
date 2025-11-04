'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepHeader from './StepHeader';
import { useBooking } from '@/context/BookingContext';

const FinalDetails = () => {
  const { state, dispatch } = useBooking();
  const step = 2;

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

  const isExpanded = state.expandedSteps.includes(step);
  const isCompleted = state.completedSteps.includes(step);
  const showSummary = state.summarySteps.includes(step);
  const isEditing = isExpanded && isCompleted;

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
    // Add login logic here
    // Save user data
    dispatch({
      type: "SET_USER",
      payload: {
        email: loginData.email
      }
    });
    
    dispatch({ type: "COMPLETE_STEP", payload: step });
    dispatch({ type: "TOGGLE_STEP", payload: step });
    
    setTimeout(() => {
      dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 1 });
      
      setTimeout(() => {
        const nextStepElement = document.querySelector(`[data-step="${step + 1}"]`);
        if (nextStepElement) {
          nextStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }, 100);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!guestData.firstName.trim() || !guestData.lastName.trim() || 
        !guestData.phoneNumber.trim() || !guestData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    dispatch({
      type: "SET_USER",
      payload: {
        name: `${guestData.firstName} ${guestData.lastName}`,
        email: guestData.email,
        phone: guestData.phoneNumber
      }
    });
    
    dispatch({ type: "COMPLETE_STEP", payload: step });
    dispatch({ type: "TOGGLE_STEP", payload: step });
    
    setTimeout(() => {
      if (!showSummary) {
        dispatch({ type: "TOGGLE_SUMMARY", payload: step });
      }
      dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 1 });
      
      setTimeout(() => {
        const nextStepElement = document.querySelector(`[data-step="${step + 1}"]`);
        if (nextStepElement) {
          nextStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }, 100);
  };

  const handleEdit = () => {
    dispatch({ type: "COLLAPSE_AFTER_STEP", payload: step });
    if (!isExpanded) dispatch({ type: "TOGGLE_STEP", payload: step });
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: "TOGGLE_SUMMARY", payload: step });
    }
  };

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
      <div>
        <span className="font-semibold text-gray-600">Guest:</span>{' '}
        <span className="text-gray-700">{guestData.firstName} {guestData.lastName}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Phone:</span>{' '}
        <span className="text-gray-700">{guestData.phoneNumber}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Email:</span>{' '}
        <span className="text-gray-700">{guestData.email}</span>
      </div>
    </div>
  );

  return (
    <div className='mb-4'>
      <StepHeader
        stepNumber={step}
        title="Account Info"
        isCompleted={isCompleted}
        isEditing={isEditing}
        showSummary={showSummary}
        onToggleSummary={handleToggleSummary}
        onEdit={handleEdit}
        summary={summary}
      />
      <div 
        className="overflow-hidden transition-all duration-900 ease-in-out"
        style={{
          maxHeight: isExpanded ? '5000px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0 md:px-8">
          <div className="w-full md:w-1/2 flex flex-col px-6">
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
          <div className="hidden md:flex items-stretch">
            <div className="w-px bg-gray-300 mx-0 h-full" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6">
            <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Continue as guest</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleGuestSubmit} className="space-y-6">
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
    </div>
  );
};

export default FinalDetails;
