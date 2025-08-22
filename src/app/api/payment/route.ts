import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, paymentMethod = 'razorpay' } = await request.json();
    
    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Amount and booking ID are required' },
        { status: 400 }
      );
    }
    
    // Mock payment processing
    // In production, this would integrate with Razorpay or Stripe
    
    const paymentId = 'PAY_' + Date.now().toString(36).toUpperCase();
    const transactionId = 'TXN_' + Math.random().toString(36).substring(2, 15).toUpperCase();
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock payment success (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const payment = {
        id: paymentId,
        transactionId,
        bookingId,
        amount,
        currency: 'INR',
        status: 'completed',
        paymentMethod,
        processedAt: new Date().toISOString(),
        gateway: paymentMethod === 'razorpay' ? 'Razorpay' : 'Stripe',
      };
      
      return NextResponse.json({
        success: true,
        payment,
        message: 'Payment processed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Payment failed. Please try again.',
        errorCode: 'PAYMENT_FAILED'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking payment status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');
    const bookingId = searchParams.get('bookingId');
    
    if (!paymentId && !bookingId) {
      return NextResponse.json(
        { error: 'Either payment ID or booking ID is required' },
        { status: 400 }
      );
    }
    
    // Mock payment status lookup
    const paymentStatus = {
      id: paymentId || 'PAY_MOCK',
      bookingId: bookingId || 'CB_MOCK',
      status: 'completed',
      amount: 323,
      currency: 'INR',
      processedAt: new Date().toISOString(),
      gateway: 'Razorpay'
    };
    
    return NextResponse.json({
      success: true,
      payment: paymentStatus
    });
    
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}