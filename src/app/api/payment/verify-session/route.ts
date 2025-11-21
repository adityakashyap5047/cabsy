import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        // Get sessionId from query parameters
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        // Fetch session data from MongoDB
        const paymentSession = await prisma.paymentSession.findUnique({
            where: { sessionId },
        });

        if (!paymentSession) {
            return NextResponse.json(
                { error: "Session not found or expired" },
                { status: 404 }
            );
        }

        // Check if session has expired
        if (paymentSession.expiresAt < new Date()) {
            // Delete expired session
            await prisma.paymentSession.delete({
                where: { id: paymentSession.id },
            });

            return NextResponse.json(
                { error: "Session expired" },
                { status: 410 } // 410 Gone
            );
        }

        // Verify session belongs to current user (or is a guest session)
        if (paymentSession.userId !== null && paymentSession.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized access to this session" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            session: {
                sessionId: paymentSession.sessionId,
                totalAmount: paymentSession.totalAmount,
                returnEnabled: paymentSession.returnEnabled,
                passengers: paymentSession.passengers,
                onwardJourney: paymentSession.onwardJourney,
                returnJourney: paymentSession.returnJourney,
                expiresAt: paymentSession.expiresAt,
            },
        });
    } catch (error) {
        console.error("Error verifying payment session:", error);
        return NextResponse.json(
            { error: "Failed to verify payment session" },
            { status: 500 }
        );
    }
}