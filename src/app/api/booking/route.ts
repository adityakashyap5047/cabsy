import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
    try {
        const stripeSignature = request.headers.get("stripe-signature");

        if (!stripeSignature) {
            return NextResponse.json(
                { error: "Missing Stripe signature" },
                { status: 400 }
            );
        }

        // Get raw body for webhook verification
        const rawBody = await request.text();

        // Use different webhook secrets for development vs production
        const webhookSecret = process.env.NODE_ENV === 'production' 
            ? process.env.STRIPE_WEBHOOK_SECRET_LIVE 
            : process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("Stripe webhook secret not configured");
            return NextResponse.json(
                { error: "Webhook configuration error" },
                { status: 500 }
            );
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                stripeSignature,
                webhookSecret
            );
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error verifying Stripe webhook signature:", errorMessage);
            return NextResponse.json(
                { error: `Webhook Error: ${errorMessage}` },
                { status: 400 }
            );
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const sessionId = paymentIntent.metadata.sessionId;
            const userId = paymentIntent.metadata.userId;

            if (!sessionId) {
                console.warn("Missing sessionId in payment intent metadata");
                return NextResponse.json({ received: true }, { status: 200 });
            }

            // Fetch session data from MongoDB
            const paymentSession = await prisma.paymentSession.findUnique({
                where: { sessionId },
            });

            if (!paymentSession) {
                console.warn("Session data expired or missing for", sessionId);
                return NextResponse.json(
                    { received: true, message: "No session found, skipping booking creation" },
                    { status: 200 }
                );
            }

            // Create onward journey
            const onwardJourneyData = paymentSession.onwardJourney as {
                journeyType: string;
                serviceType: string;
                pickupDate: string;
                pickupTime: string;
                pickupLocation: string;
                pickupLatitude?: number;
                pickupLongitude?: number;
                stops: string[];
                stopsLatitudes?: number[];
                stopsLongitudes?: number[];
                dropoffLocation: string;
                dropoffLatitude?: number;
                dropoffLongitude?: number;
                distance?: number;
                duration?: number;
                passengers: number;
                luggage: number;
                passengerDetails: Array<{
                    firstName: string;
                    lastName: string;
                    email?: string | null;
                    phoneNumber?: string | null;
                }>;
                amount?: number;
                remarks?: string;
            };

            const onwardJourney = await prisma.journey.create({
                data: {
                    journeyType: "ONWARD",
                    serviceType: onwardJourneyData.serviceType,
                    pickupDate: onwardJourneyData.pickupDate,
                    pickupTime: onwardJourneyData.pickupTime,
                    pickupLocation: onwardJourneyData.pickupLocation,
                    pickupLatitude: onwardJourneyData.pickupLatitude ?? null,
                    pickupLongitude: onwardJourneyData.pickupLongitude ?? null,
                    stops: onwardJourneyData.stops || [],
                    stopsLatitudes: onwardJourneyData.stopsLatitudes || [],
                    stopsLongitudes: onwardJourneyData.stopsLongitudes || [],
                    dropoffLocation: onwardJourneyData.dropoffLocation,
                    dropoffLatitude: onwardJourneyData.dropoffLatitude ?? null,
                    dropoffLongitude: onwardJourneyData.dropoffLongitude ?? null,
                    distance: onwardJourneyData.distance ?? null,
                    duration: onwardJourneyData.duration ?? null,
                    passengers: onwardJourneyData.passengers,
                    luggage: onwardJourneyData.luggage || 0,
                    passengerDetails: onwardJourneyData.passengerDetails,
                    amount: onwardJourneyData.amount ?? null,
                    remarks: onwardJourneyData.remarks || null,
                },
            });

            // Create return journey if exists
            let returnJourney = null;
            if (paymentSession.returnJourney) {
                const returnJourneyData = paymentSession.returnJourney as {
                    journeyType: string;
                    serviceType: string;
                    pickupDate: string;
                    pickupTime: string;
                    pickupLocation: string;
                    pickupLatitude?: number;
                    pickupLongitude?: number;
                    stops: string[];
                    stopsLatitudes?: number[];
                    stopsLongitudes?: number[];
                    dropoffLocation: string;
                    dropoffLatitude?: number;
                    dropoffLongitude?: number;
                    distance?: number;
                    duration?: number;
                    passengers: number;
                    luggage: number;
                    passengerDetails: Array<{
                        firstName: string;
                        lastName: string;
                        email?: string | null;
                        phoneNumber?: string | null;
                    }>;
                    amount?: number;
                    remarks?: string;
                };

                returnJourney = await prisma.journey.create({
                    data: {
                        journeyType: "RETURN",
                        serviceType: returnJourneyData.serviceType,
                        pickupDate: returnJourneyData.pickupDate,
                        pickupTime: returnJourneyData.pickupTime,
                        pickupLocation: returnJourneyData.pickupLocation,
                        pickupLatitude: returnJourneyData.pickupLatitude ?? null,
                        pickupLongitude: returnJourneyData.pickupLongitude ?? null,
                        stops: returnJourneyData.stops || [],
                        stopsLatitudes: returnJourneyData.stopsLatitudes || [],
                        stopsLongitudes: returnJourneyData.stopsLongitudes || [],
                        dropoffLocation: returnJourneyData.dropoffLocation,
                        dropoffLatitude: returnJourneyData.dropoffLatitude ?? null,
                        dropoffLongitude: returnJourneyData.dropoffLongitude ?? null,
                        distance: returnJourneyData.distance ?? null,
                        duration: returnJourneyData.duration ?? null,
                        passengers: returnJourneyData.passengers,
                        luggage: returnJourneyData.luggage || 0,
                        passengerDetails: returnJourneyData.passengerDetails,
                        amount: returnJourneyData.amount ?? null,
                        remarks: returnJourneyData.remarks || null,
                    },
                });
            }

            const booking = await prisma.booking.create({
                data: {
                    userId: paymentSession.userId || null,
                    guestFirstName: paymentSession.guestFirstName || null,
                    guestLastName: paymentSession.guestLastName || null,
                    guestEmail: paymentSession.guestEmail || null,
                    guestPhoneNumber: paymentSession.guestPhoneNumber || null,
                    onwardJourneyId: onwardJourney.id,
                    returnEnabled: paymentSession.returnEnabled,
                    returnJourneyId: returnJourney?.id || null,
                    paymentMethod: "CARD",
                    totalAmount: paymentSession.totalAmount || 0,
                    paymentStatus: "COMPLETED",
                    status: "CONFIRMED",
                },
            });

            // Fetch user details for email if user is authenticated
            if (userId) {
                await prisma.user.findUnique({
                    where: { id: userId },
                });

                // TODO: Send confirmation email to user
                // Uncomment when email service is set up
                // const user = await prisma.user.findUnique({ where: { id: userId } });
                // const name = `${user.firstName} ${user.lastName}`;
                // const email = user.email;
                // await sendEmail(
                //     email,
                //     "Your Cabsy Booking Confirmation",
                //     "booking-confirmation",
                //     {
                //         name,
                //         booking,
                //         totalAmount: paymentSession.totalAmount || 0,
                //         trackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${booking.id}`
                //     }
                // );
            }

            // Delete payment session after successful booking
            await prisma.paymentSession.delete({
                where: { id: paymentSession.id },
            });

            console.log(`✅ Booking ${booking.id} created and confirmed for session ${sessionId}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing booking webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}