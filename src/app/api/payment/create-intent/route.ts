import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest){
    const { amount, sessionId } = await request.json();

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            application_fee_amount: platformFee,
            transfer_data: {
                destination: sellersStripeAccountId,
            },
            metadata: {
                sessionId,
                userId: request.user.id
            }
        });

        return NextResponse.json(
            {
                clientSecret: paymentIntent.client_secret
            },
            {
                status: 201
            }
        );
    } catch (error) {
        console.error("Error creating payment intent", error);
        return NextResponse.json(
            { message: "Failed to create payment intent" },
            { status: 500 }
        );
    }
}