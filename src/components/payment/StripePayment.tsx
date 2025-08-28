'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole } from 'lucide-react';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#424770',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#9e2146'
    }
  },
  hidePostalCode: true
};

interface PaymentFormProps {
  onPaymentSuccess: (paymentMethod: import('@stripe/stripe-js').PaymentMethod) => void;
  onPaymentError: (error: string) => void;
  amount: number;
  disabled?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPaymentSuccess, 
  onPaymentError, 
  amount, 
  disabled = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || disabled) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Here you would typically send the payment method to your backend
      // to create a payment intent and process the payment
      console.log('Payment Method:', paymentMethod);
      onPaymentSuccess(paymentMethod);
      
    } catch (err: unknown) {
      console.error('Payment error:', err);
      onPaymentError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Payment Method Section */}
      <div className="p-4 pt-0 pb-0">
        {/* Stripe Card Element */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </Label>
          <div className={`p-3 border bg-white ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="">
        <h3 className="text-lg bg-gray-300 px-2 font-medium text-gray-600 mb-4">Billing Information</h3>
        
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billing-name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              id="billing-name"
              name="name"
              type="text"
              value={billingDetails.name}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="billing-email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="billing-email"
              name="email"
              type="email"
              value={billingDetails.email}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="billing-phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="billing-phone"
              name="phone"
              type="tel"
              value={billingDetails.phone}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
            />
          </div>
          
          <div>
            <Label htmlFor="billing-address" className="text-sm font-medium text-gray-700">
              Address *
            </Label>
            <Input
              id="billing-address"
              name="address.line1"
              type="text"
              value={billingDetails.address.line1}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="billing-city" className="text-sm font-medium text-gray-700">
              City *
            </Label>
            <Input
              id="billing-city"
              name="address.city"
              type="text"
              value={billingDetails.address.city}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="billing-state" className="text-sm font-medium text-gray-700">
              State *
            </Label>
            <Input
              id="billing-state"
              name="address.state"
              type="text"
              value={billingDetails.address.state}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="billing-zip" className="text-sm font-medium text-gray-700">
              ZIP Code *
            </Label>
            <Input
              id="billing-zip"
              name="address.postal_code"
              type="text"
              value={billingDetails.address.postal_code}
              onChange={handleBillingChange}
              className="mt-1"
              disabled={disabled}
              required
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-4 text-sm text-gray-600 bg-green-100 p-3 mb-4 border border-green-200">
        <LockKeyhole className="h-4 w-4 text-green-600" />
        <span>All transactions are safe and secure. Your payment information is encrypted and protected by Stripe.</span>
      </div>

      {/* Payment Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || disabled}
        className={`w-full bg-[#AE9409] hover:bg-[#8B7507] cursor-pointer rounded-none text-white font-medium py-3 px-6 transition-all duration-200 ${
          isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

// Main component that wraps PaymentForm with Stripe Elements
interface StripePaymentProps {
  amount: number;
  onPaymentSuccess: (paymentMethod: import('@stripe/stripe-js').PaymentMethod) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;
