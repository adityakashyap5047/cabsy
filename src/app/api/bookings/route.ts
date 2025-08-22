import { NextRequest, NextResponse } from 'next/server';
import { BookingFormData } from '@/types/booking';

// Mock database - in production, this would be MongoDB
// Using let because we need to modify the array
// eslint-disable-next-line prefer-const
let bookings: (BookingFormData & { 
  id: string; 
  status: string; 
  distance: number; 
  totalFare: number; 
  createdAt: string; 
  updatedAt: string; 
})[] = [];

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingFormData = await request.json();
    
    // Validate required fields
    if (!bookingData.pickup || !bookingData.destination || !bookingData.contactNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate booking ID
    const bookingId = 'CB' + Date.now().toString(36).toUpperCase();
    
    // Calculate distance and fare (mock implementation)
    const distance = Math.floor(Math.random() * 50) + 5;
    const baseFare = distance * 15;
    const stopCharges = bookingData.stops.length * 25;
    const returnDiscount = bookingData.isReturnJourney ? (baseFare + stopCharges) * 0.15 : 0;
    const finalFare = baseFare + stopCharges - returnDiscount;
    
    // Create booking record
    const booking = {
      id: bookingId,
      ...bookingData,
      status: 'confirmed',
      distance,
      totalFare: Math.round(finalFare),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to mock database
    bookings.push(booking);
    
    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    });
    
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('id');
    
    if (bookingId) {
      // Get specific booking
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ booking });
    } else {
      // Get all bookings (for admin/dashboard)
      return NextResponse.json({ bookings });
    }
    
  } catch (error) {
    console.error('Booking retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}