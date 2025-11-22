import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: "Invalid input parameter" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.error("GOOGLE_MAPS_API_KEY is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.structuredFormat,suggestions.placePrediction.placeId,suggestions.placePrediction.text"
        },
        body: JSON.stringify({ 
          input,
          includedRegionCodes: ["us"]
        })
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch autocomplete suggestions" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Autocomplete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
