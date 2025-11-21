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

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                stripeSignature,
                process.env.STRIPE_WEBHOOK_SECRET!
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
                stops: string[];
                dropoffLocation: string;
                passengers: number;
                luggage: number;
                passengerDetails: Array<{
                    firstName: string;
                    lastName: string;
                    email?: string | null;
                    phoneNumber?: string | null;
                }>;
                vehicleType?: string;
                remarks?: string;
            };

            const onwardJourney = await prisma.journey.create({
                data: {
                    journeyType: "ONWARD",
                    serviceType: onwardJourneyData.serviceType,
                    pickupDate: onwardJourneyData.pickupDate,
                    pickupTime: onwardJourneyData.pickupTime,
                    pickupLocation: onwardJourneyData.pickupLocation,
                    stops: onwardJourneyData.stops || [],
                    dropoffLocation: onwardJourneyData.dropoffLocation,
                    passengers: onwardJourneyData.passengers,
                    luggage: onwardJourneyData.luggage || 0,
                    passengerDetails: onwardJourneyData.passengerDetails,
                    vehicleType: onwardJourneyData.vehicleType || null,
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
                    stops: string[];
                    dropoffLocation: string;
                    passengers: number;
                    luggage: number;
                    passengerDetails: Array<{
                        firstName: string;
                        lastName: string;
                        email?: string | null;
                        phoneNumber?: string | null;
                    }>;
                    vehicleType?: string;
                    remarks?: string;
                };

                returnJourney = await prisma.journey.create({
                    data: {
                        journeyType: "RETURN",
                        serviceType: returnJourneyData.serviceType,
                        pickupDate: returnJourneyData.pickupDate,
                        pickupTime: returnJourneyData.pickupTime,
                        pickupLocation: returnJourneyData.pickupLocation,
                        stops: returnJourneyData.stops || [],
                        dropoffLocation: returnJourneyData.dropoffLocation,
                        passengers: returnJourneyData.passengers,
                        luggage: returnJourneyData.luggage || 0,
                        passengerDetails: returnJourneyData.passengerDetails,
                        vehicleType: returnJourneyData.vehicleType || null,
                        remarks: returnJourneyData.remarks || null,
                    },
                });
            }

            // Create booking
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