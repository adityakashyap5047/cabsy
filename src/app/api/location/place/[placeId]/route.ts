import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const { placeId } = await params;

    // Validate placeId
    if (!placeId || typeof placeId !== 'string') {
      return NextResponse.json(
        { error: "Invalid placeId parameter" },
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
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "location,displayName,formattedAddress"
        },
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch place details" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Place details API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
