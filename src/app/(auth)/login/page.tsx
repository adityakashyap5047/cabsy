'use client';

import React, { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, AlertCircle, ArrowRight, X, EyeOff, Eye } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    setErrors({ email: '', password: '', general: '' });
    
    // Validation
    let hasError = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      // Focus on first error field
      if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.password && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setErrors(prev => ({ ...prev, general: 'Invalid email or password' }));
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back! You are now logged in.');
        router.push('/');
      }
    } catch {
      setErrors(prev => ({ ...prev, general: 'An error occurred. Please try again.' }));
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setErrors(prev => ({ ...prev, general: '' }));
  };

  return (
    <div className="min-h-main flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                  className={`pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

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
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Don&apos;t have an account?</span>
            </div>
          </div>

          <Link href="/register"
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
              Create Account
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;