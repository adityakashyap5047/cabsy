import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { 
  getClientIP, 
  logSecurityEvent,
  SECURITY_HEADERS,
  sanitizeMetadata,
  verifyPaymentSession
} from '@/lib/security';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  
  try {
    // Security Headers
    const headers = new Headers();
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers }
      );
    }

    const { paymentIntentId, bookingDetails, sessionToken } = body;

    // Validate required fields
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        error: 'Invalid payment intent ID'
      });
      
      return NextResponse.json(
        { error: 'Valid Payment Intent ID is required' },
        { status: 400, headers }
      );
    }

    // Verify session token if provided
    if (sessionToken && !verifyPaymentSession(sessionToken)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        paymentIntentId,
        error: 'Invalid or expired session token'
      });
      
      return NextResponse.json(
        { error: 'Invalid or expired payment session' },
        { status: 400, headers }
      );
    }

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify the payment intent wasn't tampered with
    if (paymentIntent.metadata.clientIP && 
        !paymentIntent.metadata.clientIP.includes(clientIP.slice(0, 10))) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        paymentIntentId,
        error: 'IP address mismatch'
      });
      
      // Still allow payment but log for investigation
      console.warn('IP address mismatch detected:', {
        originalIP: paymentIntent.metadata.clientIP,
        currentIP: clientIP
      });
    }

    if (paymentIntent.status === 'succeeded') {
      // Sanitize booking details
      const sanitizedBookingDetails = sanitizeMetadata(bookingDetails || {});
      
      logSecurityEvent({
        type: 'payment_success',
        ip: clientIP,
        userAgent,
        paymentIntentId,
        amount: paymentIntent.amount_received / 100
      });
      
      // Payment was successful - save booking to database
      console.log('Payment successful for booking:', sanitizedBookingDetails);
      
      // TODO: Save booking details to your database here
      // const booking = await saveBookingToDatabase(sanitizedBookingDetails, paymentIntent);

      return NextResponse.json({
        success: true,
        paymentStatus: paymentIntent.status,
        message: 'Payment confirmed and booking created successfully',
        bookingId: `BOOK_${Date.now()}`, // Replace with actual booking ID from database
        paymentIntentId: paymentIntent.id,
        amountReceived: paymentIntent.amount_received / 100, // Convert from cents
      }, { headers });
    } else {
      logSecurityEvent({
        type: 'payment_failure',
        ip: clientIP,
        userAgent,
        paymentIntentId,
        error: `Payment not completed: ${paymentIntent.status}`
      });
      
      return NextResponse.json({
        success: false,
        paymentStatus: paymentIntent.status,
        message: 'Payment not completed',
      }, { status: 400, headers });
    }

  } catch (error: unknown) {
    console.error('Error confirming payment:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    logSecurityEvent({
      type: 'payment_failure',
      ip: clientIP,
      userAgent,
      error: errorMessage
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to confirm payment',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
