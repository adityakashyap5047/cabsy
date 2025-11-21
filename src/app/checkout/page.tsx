"use client";

import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { XCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface BookingData {
    sessionId: string;
    totalAmount: number;
    returnEnabled: boolean;
    passengers: Array<{
        firstName: string;
        lastName: string;
        email?: string | null;
        phoneNumber?: string | null;
    }>;
    onwardJourney: {
        serviceType: string;
        pickupDate: string;
        pickupTime: string;
        pickupLocation: string;
        pickupPostcode: string;
        dropoffLocation: string;
        dropoffPostcode: string;
        stops?: Array<{
            location: string;
            postcode: string;
        }> | null;
        passengers: number;
        luggage: number;
        remarks?: string | null;
    };
    returnJourney?: {
        serviceType: string;
        pickupDate: string;
        pickupTime: string;
        pickupLocation: string;
        pickupPostcode: string;
        dropoffLocation: string;
        dropoffPostcode: string;
        stops?: Array<{
            location: string;
            postcode: string;
        }> | null;
        passengers: number;
        luggage: number;
        remarks?: string | null;
    } | null;
    expiresAt: Date;
}

function CheckoutContent() {
    const { status } = useSession();
    const [clientSecret, setClientSecret] = useState("");
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = searchParams.get("sessionId");

    useEffect(() => {
        const fetchSessionAndClientSecret = async () => {
            if (!sessionId) {
                setError("Invalid session. Please try again.");
                setLoading(false);
                return;
            }

            try {
                // Verify payment session
                const verifyRes = await fetch(
                    `/api/payment/verify-session?sessionId=${sessionId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    throw new Error(verifyData.error || "Invalid payment session");
                }

                const { totalAmount } = verifyData.session;

                if (totalAmount === undefined || totalAmount === null || isNaN(totalAmount) || totalAmount <= 0) {
                    throw new Error("Invalid payment session data.");
                }

                setBookingData(verifyData.session);

                // Create payment intent
                const intentRes = await fetch('/api/payment/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: Math.round(totalAmount * 100), // Convert to cents
                        sessionId,
                    }),
                });

                const intentData = await intentRes.json();

                if (!intentRes.ok) {
                    throw new Error(intentData.error || "Failed to create payment intent");
                }

                setClientSecret(intentData.clientSecret);
            } catch (error) {
                console.error('Checkout error:', error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while preparing your payment"
                );
            } finally {
                setLoading(false);
            }
        };

        if (status !== 'loading') {
            fetchSessionAndClientSecret();
        }
    }, [sessionId, status]);

    const appearance: Appearance = {
        theme: "stripe",
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin w-8 h-8 text-[#AE9409]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] px-4">
                <div className="w-full text-center max-w-md">
                    <div className="flex justify-center mb-4">
                        <XCircle className="text-red-500 w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">
                        Payment Setup Failed
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        {error}
                        <br className="hidden sm:block" />
                        Please go back and try booking again.
                    </p>
                    <button
                        onClick={() => router.push("/ride")}
                        className="bg-[#AE9409] text-white px-6 py-3 rounded hover:bg-[#8B7507] transition-colors"
                    >
                        Back to Ride
                    </button>
                </div>
            </div>
        );
    }

    return (
        clientSecret && bookingData && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm bookingData={bookingData} sessionId={sessionId} />
            </Elements>
        )
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <Loader2 className="animate-spin w-8 h-8 text-[#AE9409]" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}

