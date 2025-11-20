'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepHeader from './StepHeader';
import { useBooking } from '@/context/BookingContext';

const FinalDetails = () => {
  const { state, dispatch } = useBooking();
  const { data: session, status, update } = useSession();
  const step = 2;

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingLoginComplete, setPendingLoginComplete] = useState(false);

  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);

  const [guestData, setGuestData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [guestErrors, setGuestErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [showDataInfo, setShowDataInfo] = useState(false);

  const isExpanded = state.expandedSteps.includes(step);
  const isCompleted = state.completedSteps.includes(step);
  const showSummary = state.summarySteps.includes(step);
  const isEditing = isExpanded && isCompleted;
  const isLoggedIn = status === 'authenticated' && session?.user;

  useEffect(() => {
    if (isLoggedIn && isCompleted && session.user) {
      const nameParts = session.user.name?.split(' ') || ['', ''];
      setGuestData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: session.user.phone || '',
        email: session.user.email || ''
      });
    }
  }, [isLoggedIn, isCompleted, session]);

  useEffect(() => {
    if (pendingLoginComplete && session?.user) {
      dispatch({
        type: "SET_USER",
        payload: {
          name: session.user.name || '',
          email: session.user.email || '',
          phone: session.user.phone || '',
          passengers: [{
            name: session.user.name || '',
            email: session.user.email || '',
            phone: session.user.phone || ''
          }]
        }
      });
      
      dispatch({ type: "COMPLETE_STEP", payload: step });
      dispatch({ type: "TOGGLE_STEP", payload: step });
      
      setTimeout(() => {
        if (!showSummary) {
          dispatch({ type: "TOGGLE_SUMMARY", payload: step });
        }
        dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 1 });
      }, 100);
      
      setPendingLoginComplete(false);
    }
  }, [pendingLoginComplete, session, dispatch, step, showSummary]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const dismissLoginError = () => {
    setLoginErrors(prev => ({ ...prev, general: '' }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
    if (guestErrors[name as keyof typeof guestErrors]) {
      setGuestErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setLoginErrors({ email: '', password: '', general: '' });
    
    let hasError = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setLoginErrors(newErrors);
      // Focus on first error field
      if (newErrors.email && loginEmailRef.current) {
        loginEmailRef.current.focus();
      } else if (newErrors.password && loginPasswordRef.current) {
        loginPasswordRef.current.focus();
      }
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });

      if (result?.error) {
        setLoginErrors(prev => ({ ...prev, general: 'Invalid email or password' }));
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back! You are now logged in.');
        
        // Refresh session
        await update();
        
        // Set flag to complete login flow once session updates
        setPendingLoginComplete(true);
      }
    } catch {
      setLoginErrors(prev => ({ ...prev, general: 'An error occurred. Please try again.' }));
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Reset errors
    setGuestErrors({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });

    // Validation
    let hasError = false;
    const newErrors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    };

    if (!guestData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      hasError = true;
    }

    if (!guestData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      hasError = true;
    }

    if (!guestData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      hasError = true;
    } else if (!validatePhone(guestData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      hasError = true;
    }

    if (!guestData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(guestData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (hasError) {
      setGuestErrors(newErrors);
      if (newErrors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (newErrors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (newErrors.phoneNumber && phoneNumberRef.current) {
        phoneNumberRef.current.focus();
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    
    dispatch({
      type: "SET_USER",
      payload: {
        name: `${guestData.firstName} ${guestData.lastName}`,
        email: guestData.email,
        phone: guestData.phoneNumber,
        passengers: [{
          name: `${guestData.firstName} ${guestData.lastName}`,
          email: guestData.email,
          phone: guestData.phoneNumber
        }]
      }
    });
    
    dispatch({ type: "COMPLETE_STEP", payload: step });
    dispatch({ type: "TOGGLE_STEP", payload: step });
    
    setTimeout(() => {
      if (!showSummary) {
        dispatch({ type: "TOGGLE_SUMMARY", payload: step });
      }
      dispatch({ type: "EXPAND_ONLY_STEP", payload: step + 1 });
    }, 100);
  };

  const handleEdit = () => {
    dispatch({ type: "COLLAPSE_AFTER_STEP", payload: step });
    if (!isExpanded) dispatch({ type: "TOGGLE_STEP", payload: step });
  };

  const handleLogout = async () => {
    dispatch({
      type: "SET_USER",
      payload: {
        name: '',
        email: '',
        phone: '',
        passengers: []
      }
    });

    setGuestData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });

    setGuestErrors({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });

    setLoginData({
      email: '',
      password: ''
    });

    setLoginErrors({
      email: '',
      password: '',
      general: ''
    });
    
    dispatch({ type: "UNCOMPLETE_STEP", payload: step });
    
    dispatch({ type: "COLLAPSE_AFTER_STEP", payload: step - 1 });
    
    if (showSummary) {
      dispatch({ type: "TOGGLE_SUMMARY", payload: step });
    }
    
    setTimeout(() => {
      dispatch({ type: "EXPAND_ONLY_STEP", payload: step });
    }, 100);
    
    await signOut({ redirect: false });
    toast.success('You have been logged out successfully.');
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: "TOGGLE_SUMMARY", payload: step });
    }
  };

  const summary = (
    <div className="grid grid-cols-1 min-[440px]:grid-cols-2 min-[768px]:grid-cols-4 min-[960px]:grid-cols-3 gap-y-3">
      <div>
        <span className="font-semibold text-gray-600">Name:</span>{' '}
        <span className="text-gray-700 text-sm">{guestData.firstName} {guestData.lastName}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Phone:</span>{' '}
        <span className="text-gray-700 text-sm">{guestData.phoneNumber}</span>
      </div>
      <div className='max-[440px]:col-span-1 max-[960px]:col-span-2'>
        <span className="font-semibold text-gray-600">Email:</span>{' '}
        <span className="text-gray-700 text-sm">{guestData.email}</span>
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
        onEdit={isLoggedIn ? undefined : handleEdit}
        onLogout={isLoggedIn ? handleLogout : undefined}
        summary={summary}
      />
      <div 
        className="overflow-hidden transition-all duration-900 ease-in-out"
        style={{
          maxHeight: isExpanded ? '5000px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0">
          <div className="w-full md:w-1/2 flex flex-col px-3 sm:px-4 md:px-6">
            <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-800">Log In to your account</h2>
            </div>
            
            <div className="p-3 sm:p-4 md:p-6">
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* General Error */}
                {loginErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-sm p-3 flex items-center justify-between gap-2">
                    <p className="text-sm text-red-600">{loginErrors.general}</p>
                    <button
                      type="button"
                      onClick={dismissLoginError}
                      className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-col min-[420px]:flex-row min-[420px]:gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium text-sm sm:text-base">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      ref={loginEmailRef}
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      disabled={isLoggingIn}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                        loginErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      }`}
                    />
                    {loginErrors.email && (
                      <p className="text-xs text-red-600">{loginErrors.email}</p>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 mt-3 min-[420px]:mt-0">
                    <Label htmlFor="login-password" className="text-gray-700 font-medium text-sm sm:text-base">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        ref={loginPasswordRef}
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        disabled={isLoggingIn}
                        className={`w-full pl-3 sm:px-4 py-2 sm:py-3 pr-10! border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                          loginErrors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-xs text-red-600">{loginErrors.password}</p>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <button
                    type="button"
                    className="cursor-pointer text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="text-center text-xs sm:text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Register Now
                  </button>
                </div>

                <div className='text-center'>
                  <Button
                      type="submit"
                      disabled={isLoggingIn}
                      className={`bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 sm:py-3 px-12 sm:px-18 rounded-none transition-colors duration-200 text-sm sm:text-base ${
                        isLoggingIn ? 'cursor-default opacity-50' : 'cursor-pointer'
                      }`}
                  >
                      {isLoggingIn ? 'Logging in...' : 'Log in'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className="hidden md:flex items-stretch">
            <div className="w-px bg-gray-300 mx-0 h-full" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center px-3 sm:px-4 md:px-6">
            <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-800">Continue as guest</h2>
            </div>
            
            <div className="p-3 sm:p-4 md:p-6">
              <form onSubmit={handleGuestSubmit} noValidate className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex flex-col min-[420px]:flex-row min-[420px]:gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="guest-firstname" className="text-gray-700 font-medium text-sm sm:text-base">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      ref={firstNameRef}
                      id="guest-firstname"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={guestData.firstName}
                      onChange={handleGuestChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                        guestErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      }`}
                    />
                    {guestErrors.firstName && (
                      <p className="text-xs text-red-600">{guestErrors.firstName}</p>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 mt-3 min-[420px]:mt-0">
                    <Label htmlFor="guest-lastname" className="text-gray-700 font-medium text-sm sm:text-base">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      ref={lastNameRef}
                      id="guest-lastname"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={guestData.lastName}
                      onChange={handleGuestChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                        guestErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      }`}
                    />
                    {guestErrors.lastName && (
                      <p className="text-xs text-red-600">{guestErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col min-[420px]:flex-row min-[420px]:gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="guest-phone" className="text-gray-700 font-medium text-sm sm:text-base">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      ref={phoneNumberRef}
                      id="guest-phone"
                      name="phoneNumber"
                      type="tel"
                      placeholder="1234567890"
                      value={guestData.phoneNumber}
                      onChange={handleGuestChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                        guestErrors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      }`}
                    />
                    {guestErrors.phoneNumber && (
                      <p className="text-xs text-red-600">{guestErrors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 mt-3 min-[420px]:mt-0">
                    <Label htmlFor="guest-email" className="text-gray-700 font-medium text-sm sm:text-base">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      ref={emailRef}
                      id="guest-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={guestData.email}
                      onChange={handleGuestChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 text-sm sm:text-base ${
                        guestErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'
                      }`}
                    />
                    {guestErrors.email && (
                      <p className="text-xs text-red-600">{guestErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Why do we need this data? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDataInfo(!showDataInfo)}
                    className="text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-medium flex items-center"
                  >
                    Why do we need this data?
                  </button>
                  {showDataInfo && (
                    <div className="mt-2 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs sm:text-sm text-gray-600">
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
                    className="bg-white cursor-pointer hover:text-white hover:bg-[#AE9409] text-[#AE9409] border-2 border-[#AE9409] font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-none transition-colors duration-200 text-sm sm:text-base"
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
