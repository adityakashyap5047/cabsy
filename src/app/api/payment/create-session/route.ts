import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const body = await request.json();
        const {
            onwardJourney,
            returnJourney,
            totalAmount,
            guestData,
        } = body;

        // Validate required fields
        if (!onwardJourney || !onwardJourney.passengerDetails || onwardJourney.passengerDetails.length === 0) {
            return NextResponse.json(
                { error: "Onward journey and passengers are required!" },
                { status: 400 }
            );
        }

        // Create normalized booking data for comparison
        const normalizedBooking = JSON.stringify({
            userId: userId || null,
            guestEmail: guestData?.email || null,
            onwardJourney,
            returnJourney: returnJourney || null,
            totalAmount,
        });

        // Check for existing valid session with same booking data
        const now = new Date();
        const existingSessions = await prisma.paymentSession.findMany({
            where: {
                userId: userId || undefined,
                guestEmail: guestData?.email || undefined,
                expiresAt: {
                    gt: now,
                },
            },
        });

        // Check if any existing session matches current booking
        for (const existingSession of existingSessions) {
            const existingBooking = JSON.stringify({
                userId: existingSession.userId,
                guestEmail: existingSession.guestEmail,
                onwardJourney: existingSession.onwardJourney,
                returnJourney: existingSession.returnJourney,
                totalAmount: existingSession.totalAmount,
            });

            if (existingBooking === normalizedBooking) {
                return NextResponse.json(
                    { sessionId: existingSession.sessionId },
                    { status: 200 }
                );
            } else {
                // Delete outdated session
                await prisma.paymentSession.delete({
                    where: { id: existingSession.id },
                });
            }
        }

        // Create new session
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await prisma.paymentSession.create({
            data: {
                sessionId,
                userId: userId || null,
                guestFirstName: guestData?.firstName || null,
                guestLastName: guestData?.lastName || null,
                guestEmail: guestData?.email || null,
                guestPhoneNumber: guestData?.phoneNumber || null,
                totalAmount: totalAmount || 0,
                returnEnabled: !!returnJourney,
                passengers: onwardJourney.passengerDetails,
                onwardJourney: {
                    journeyType: "ONWARD",
                    serviceType: onwardJourney.serviceType,
                    pickupDate: onwardJourney.pickupDate,
                    pickupTime: onwardJourney.pickupTime,
                    pickupLocation: onwardJourney.pickupLocation,
                    stops: onwardJourney.stops || [],
                    dropoffLocation: onwardJourney.dropoffLocation,
                    passengers: onwardJourney.passengers,
                    luggage: onwardJourney.luggage || 0,
                    passengerDetails: onwardJourney.passengerDetails,
                    amount: onwardJourney.amount || null,
                    remarks: onwardJourney.remarks || null,
                },
                returnJourney: returnJourney
                    ? {
                          journeyType: "RETURN",
                          serviceType: returnJourney.serviceType,
                          pickupDate: returnJourney.pickupDate,
                          pickupTime: returnJourney.pickupTime,
                          pickupLocation: returnJourney.pickupLocation,
                          stops: returnJourney.stops || [],
                          dropoffLocation: returnJourney.dropoffLocation,
                          passengers: returnJourney.passengers,
                          luggage: returnJourney.luggage || 0,
                          passengerDetails: returnJourney.passengerDetails,
                          amount: returnJourney.amount || null,
                          remarks: returnJourney.remarks || null,
                      }
                    : null,
                expiresAt,
            },
        });

        return NextResponse.json({ sessionId }, { status: 201 });
    } catch (error) {
        console.error("Error creating payment session:", error);
        return NextResponse.json(
            { error: "Failed to create payment session" },
            { status: 500 }
        );
    }
}