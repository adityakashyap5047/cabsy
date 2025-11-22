import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const latlng = searchParams.get('latlng');

    // Validate latlng parameter
    if (!latlng || typeof latlng !== 'string') {
      return NextResponse.json(
        { error: "Invalid latlng parameter" },
        { status: 400 }
      );
    }

    // Validate latlng format (should be "latitude,longitude")
    const coords = latlng.split(',');
    if (coords.length !== 2 || isNaN(Number(coords[0])) || isNaN(Number(coords[1]))) {
      return NextResponse.json(
        { error: "Invalid latlng format. Expected: 'latitude,longitude'" },
        { status: 400 }
      );
    }

    // Validate API key exists
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.error("GOOGLE_MAPS_API_KEY is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (!res.ok) {
      console.error("Google Geocoding API error:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch geocoding data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
