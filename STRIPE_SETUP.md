# Stripe Payment Integration Setup

This guide explains how to set up and configure the Stripe payment integration for the cab booking system.

## 🚀 Quick Start

### 1. Environment Setup

Update your `.env.local` file with your Stripe keys:

```bash
# Get these from https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Get this from https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Stripe Dashboard Configuration

#### Create a Webhook Endpoint
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/webhook/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_method.attached`
5. Copy the webhook secret to `.env.local`

## 📁 API Endpoints

### `/api/create-payment-intent` (POST)
Creates a payment intent for processing payments.

**Request:**
```json
{
  "amount": 299.99,
  "currency": "usd",
  "metadata": {
    "bookingType": "cab_booking",
    "timestamp": "2025-08-28T..."
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### `/api/confirm-payment` (POST)
Confirms and verifies payment completion.

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "bookingDetails": {
    "amount": 299.99,
    "billingDetails": {...},
    "timestamp": "2025-08-28T..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentStatus": "succeeded",
  "message": "Payment confirmed and booking created successfully",
  "bookingId": "BOOK_1724875200000",
  "paymentIntentId": "pi_xxx",
  "amountReceived": 299.99
}
```

### `/api/webhook/stripe` (POST)
Handles Stripe webhook events for payment updates.

## 🔧 Component Usage

### StripePayment Component

```tsx
import StripePayment from '@/components/payment/StripePayment';

<StripePayment
  amount={299.99}
  onPaymentSuccess={(paymentMethod) => {
    console.log('Payment successful:', paymentMethod);
    // Redirect to confirmation page
  }}
  onPaymentError={(error) => {
    console.error('Payment failed:', error);
    // Show error message to user
  }}
  disabled={false}
/>
```

## 🔐 Security Features

- **PCI Compliance**: Stripe handles all sensitive card data
- **Webhook Verification**: All webhook events are cryptographically verified
- **Environment Variables**: API keys stored securely in environment variables
- **HTTPS Required**: Webhooks only work with HTTPS endpoints in production

## 🧪 Testing

### Test Card Numbers
Use these test cards in development:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`
- **3D Secure**: `4000000000003220`

### Test Flow
1. Fill in billing information
2. Use test card number: `4242424242424242`
3. Use any future expiry date and any 3-digit CVV
4. Submit payment

## 🚀 Production Deployment

### 1. Update Environment Variables
Replace test keys with live keys:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### 2. Webhook URL
Update webhook endpoint URL to your production domain:
`https://yourdomain.com/api/webhook/stripe`

### 3. SSL Certificate
Ensure your production site has a valid SSL certificate (Stripe requires HTTPS).

## 📝 Database Integration

To complete the payment system, integrate with your database:

### Update `confirm-payment` API
```typescript
// In /api/confirm-payment/route.ts
import { saveBookingToDatabase } from '@/lib/database';

if (paymentIntent.status === 'succeeded') {
  // Save booking to database
  const booking = await saveBookingToDatabase({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount_received / 100,
    billingDetails,
    status: 'confirmed',
    createdAt: new Date()
  });
  
  return NextResponse.json({
    success: true,
    bookingId: booking.id,
    // ... other response data
  });
}
```

### Update Webhook Handler
```typescript
// In /api/webhook/stripe/route.ts
case 'payment_intent.succeeded':
  await updateBookingStatus(paymentIntent.metadata.bookingId, 'paid');
  break;
```

## 🔍 Monitoring

Monitor payments in the [Stripe Dashboard](https://dashboard.stripe.com/):
- View all transactions
- Track payment success/failure rates
- Monitor webhook delivery
- Set up email notifications for failed payments

## 🆘 Troubleshooting

### Common Issues

1. **"No such payment intent"**
   - Check that payment intent was created successfully
   - Verify the payment intent ID is being passed correctly

2. **"Invalid webhook signature"**
   - Verify webhook secret in environment variables
   - Check that the webhook URL is correct

3. **"Card declined"**
   - User should contact their bank
   - Try a different payment method

### Debug Mode
Enable detailed logging by adding to your API routes:
```typescript
console.log('Payment Intent:', paymentIntent);
console.log('Billing Details:', billingDetails);
```
