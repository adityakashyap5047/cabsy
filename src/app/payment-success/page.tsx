"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Home, Calendar, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#AE9409', '#FFD700', '#FFA500']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#AE9409', '#FFD700', '#FFA500']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    useEffect(() => {
        // Countdown timer
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            router.push('/');
        }
    }, [countdown, router]);

    return (
        <div className='min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white'>
            <div className="max-w-md w-full">
                <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className='w-12 h-12 text-green-600' />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Booking Confirmed! 🎉
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your ride has been successfully booked and payment processed.
                    </p>

                    {/* Booking Details Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-6 text-left">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#AE9409]" />
                            Booking Details
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-semibold text-green-600">Confirmed</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment:</span>
                                <span className="font-semibold text-green-600">Successful</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Message */}
                    <div className="bg-[#AE9409]/10 border border-[#AE9409]/20 rounded-sm p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            You will receive a confirmation email shortly with your booking details and driver information.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/')}
                            className='w-full cursor-pointer flex items-center justify-center gap-2 bg-[#AE9409] text-white py-3 px-6 rounded-sm hover:bg-[#8B7507] transition-colors font-medium'
                        >
                            <Home className='w-4 h-4' />
                            Back to Home
                        </button>
                        
                        <button
                            onClick={() => router.push('/ride')}
                            className='w-full cursor-pointer flex items-center justify-center gap-2 bg-white text-[#AE9409] border-2 border-[#AE9409] py-3 px-6 rounded-sm hover:bg-[#AE9409] hover:text-white transition-colors font-medium'
                        >
                            <Calendar className='w-4 h-4' />
                            Book Again
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                        Redirecting to home in {countdown} seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}

const PaymentSuccessPage = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-[#AE9409]" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

export default PaymentSuccessPage;