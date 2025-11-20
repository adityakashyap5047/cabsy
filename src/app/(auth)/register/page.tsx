'use client';

import React, { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, AlertCircle, ArrowRight, User, Phone, X, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      phoneNumber: '', 
      password: '', 
      confirmPassword: '', 
      general: '' 
    });
    
    // Validation
    let hasError = false;
    const newErrors = { 
      firstName: '', 
      lastName: '', 
      email: '', 
      phoneNumber: '', 
      password: '', 
      confirmPassword: '', 
      general: '' 
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      hasError = true;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      hasError = true;
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      if (newErrors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (newErrors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.phoneNumber && phoneNumberRef.current) {
        phoneNumberRef.current.focus();
      } else if (newErrors.password && passwordRef.current) {
        passwordRef.current.focus();
      } else if (newErrors.confirmPassword && confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(prev => ({ ...prev, general: data.message || 'Registration failed' }));
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        router.push('/login');
      } else {
        router.push('/');
      }
    } catch {
      setErrors(prev => ({ ...prev, general: 'An error occurred. Please try again.' }));
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setErrors(prev => ({ ...prev, general: '' }));
  };

  return (
    <div className="min-h-main flex items-center justify-center px-4">
      <div className="w-full max-w-xl">

        {/* Register Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          
            <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 flex-1">{errors.general}</p>
                <button
                  onClick={dismissError}
                  className="cursor-pointer text-red-600 hover:text-red-800 transition-colors focus:ring-0"
                  type="button"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Name Fields Row */}
            <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    ref={firstNameRef}
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`pl-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    ref={lastNameRef}
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`pl-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`pl-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={phoneNumberRef}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`pl-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login" 
            className={isLoading ? "pointer-events-none" : ""}
          >
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              className={`w-full h-12 border-2 border-gray-200 hover:bg-[#AE9409] text-gray-700 hover:text-white font-semibold text-base transition-all duration-300 ${
                isLoading ? 'cursor-default opacity-50' : 'cursor-pointer'
              }`}
            >
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;