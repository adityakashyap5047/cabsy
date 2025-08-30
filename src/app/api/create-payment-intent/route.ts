import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { 
  validatePaymentAmount, 
  validateCurrency, 
  sanitizeMetadata, 
  checkRateLimit, 
  getClientIP, 
  logSecurityEvent,
  SECURITY_CONFIG,
  SECURITY_HEADERS,
  generateSecureToken
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

    // Rate limiting
    if (!checkRateLimit(clientIP, SECURITY_CONFIG.MAX_PAYMENT_ATTEMPTS_PER_HOUR, 60 * 60 * 1000)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        error: 'Rate limit exceeded'
      });
      
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again later.' },
        { status: 429, headers }
      );
    }

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

    const { amount, currency = 'usd', metadata = {} } = body;

    // Validate required fields
    if (!validatePaymentAmount(amount)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        amount,
        error: 'Invalid payment amount'
      });
      
      return NextResponse.json(
        { error: `Invalid amount. Must be between $${SECURITY_CONFIG.MIN_PAYMENT_AMOUNT} and $${SECURITY_CONFIG.MAX_PAYMENT_AMOUNT}` },
        { status: 400, headers }
      );
    }

    if (!validateCurrency(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency' },
        { status: 400, headers }
      );
    }

    // Sanitize metadata
    const sanitizedMetadata = sanitizeMetadata(metadata);
    
    // Generate secure session token
    const sessionToken = generateSecureToken();

    logSecurityEvent({
      type: 'payment_attempt',
      ip: clientIP,
      userAgent,
      amount
    });

    // Create payment intent with enhanced security
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...sanitizedMetadata,
        bookingTimestamp: new Date().toISOString(),
        clientIP: clientIP.slice(0, 50), // Store partial IP for fraud detection
        sessionToken,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Add statement descriptor for better customer recognition
      statement_descriptor: 'CABSY RIDE',
      statement_descriptor_suffix: 'BOOKING',
    });

    logSecurityEvent({
      type: 'payment_success',
      ip: clientIP,
      userAgent,
      amount,
      paymentIntentId: paymentIntent.id
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      sessionToken, // Return session token for validation
    }, { headers });

  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    logSecurityEvent({
      type: 'payment_failure',
      ip: clientIP,
      userAgent,
      error: errorMessage
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
