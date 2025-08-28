import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, bookingDetails } = await request.json();

    // Validate required fields
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful - you can now save booking to database
      console.log('Payment successful for booking:', bookingDetails);
      
      // TODO: Save booking details to your database here
      // const booking = await saveBookingToDatabase(bookingDetails, paymentIntent);

      return NextResponse.json({
        success: true,
        paymentStatus: paymentIntent.status,
        message: 'Payment confirmed and booking created successfully',
        bookingId: `BOOK_${Date.now()}`, // Replace with actual booking ID from database
        paymentIntentId: paymentIntent.id,
        amountReceived: paymentIntent.amount_received / 100, // Convert from cents
      });
    } else {
      return NextResponse.json({
        success: false,
        paymentStatus: paymentIntent.status,
        message: 'Payment not completed',
      }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('Error confirming payment:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to confirm payment',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
