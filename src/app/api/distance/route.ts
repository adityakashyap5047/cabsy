import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { from, to, stops = [] } = await request.json();
    
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }
    
    // Mock distance calculation
    // In production, this would integrate with Google Maps Distance Matrix API or Mapbox
    const baseDistance = Math.floor(Math.random() * 40) + 10; // 10-50 km base distance
    const stopDistance = stops.length * Math.floor(Math.random() * 5) + 2; // 2-7 km per stop
    const totalDistance = baseDistance + stopDistance;
    
    // Mock route data
    const route = {
      distance: totalDistance,
      duration: Math.floor(totalDistance * 1.5) + Math.floor(Math.random() * 30), // Estimated time in minutes
      legs: [
        {
          from,
          to: stops.length > 0 ? stops[0] : to,
          distance: stops.length > 0 ? Math.floor(totalDistance * 0.4) : totalDistance,
          duration: Math.floor(totalDistance * 0.6) + Math.floor(Math.random() * 15),
        },
        ...stops.map((stop: string, index: number) => ({
          from: stop,
          to: index < stops.length - 1 ? stops[index + 1] : to,
          distance: Math.floor(Math.random() * 10) + 5,
          duration: Math.floor(Math.random() * 20) + 10,
        })),
      ],
      toll_cost: Math.floor(Math.random() * 200) + 50, // Random toll cost
      fuel_cost: Math.floor(totalDistance * 2.5), // Estimated fuel cost
    };
    
    return NextResponse.json({
      success: true,
      route,
      message: 'Distance calculated successfully'
    });
    
  } catch (error) {
    console.error('Distance calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for getting distance between two points
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Both from and to parameters are required' },
        { status: 400 }
      );
    }
    
    // Simple distance calculation (mock)
    const distance = Math.floor(Math.random() * 50) + 5;
    const duration = Math.floor(distance * 1.5) + Math.floor(Math.random() * 30);
    
    return NextResponse.json({
      success: true,
      distance,
      duration,
      from,
      to
    });
    
  } catch (error) {
    console.error('Distance lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}