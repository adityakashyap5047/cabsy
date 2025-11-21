import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest){
    const { amount, sessionId } = await request.json();

    try {
        // Get user session (optional - supports guest bookings)
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                sessionId,
                ...(userId && { userId }), // Only include userId if user is logged in
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