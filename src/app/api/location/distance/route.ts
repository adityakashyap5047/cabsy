import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, waypoints } = body;

    // Validate required fields
    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    // Validate coordinates format
    if (
      !origin.latitude ||
      !origin.longitude ||
      !destination.latitude ||
      !destination.longitude
    ) {
      return NextResponse.json(
        { error: "Invalid coordinate format. Both latitude and longitude are required." },
        { status: 400 }
      );
    }

    // Validate waypoints if provided
    if (waypoints && waypoints.length > 0) {
      for (const waypoint of waypoints) {
        if (!waypoint.latitude || !waypoint.longitude) {
          return NextResponse.json(
            { error: "Invalid waypoint coordinate format" },
            { status: 400 }
          );
        }
      }
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    // Build URL for Directions API
    const params = new URLSearchParams({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      mode: "driving",
      key: apiKey,
    });

    // Add waypoints if provided
    if (waypoints && waypoints.length > 0) {
      const waypointsStr = waypoints
        .map((wp: { latitude: number; longitude: number }) => `${wp.latitude},${wp.longitude}`)
        .join("|");
      params.append("waypoints", `optimize:false|${waypointsStr}`);
    }
    // Call Google Directions API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Directions API error:", errorText);
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: response.status }
      );
    }
    const data = await response.json();

    if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
      return NextResponse.json(
        { error: data.error_message || "No routes found" },
        { status: 404 }
      );
    }

    const route = data.routes[0];

    // Calculate total distance and duration for all legs
    let totalDistance = 0;
    let totalDuration = 0;

    route.legs.forEach((leg: { distance: { value: number }; duration: { value: number } }) => {
      totalDistance += leg.distance.value; // in meters
      totalDuration += leg.duration.value; // in seconds
    });

    // Convert to miles and minutes
    const distanceKm = totalDistance / 1000;
    const distanceMiles = distanceKm * 0.621371;
    const durationMinutes = Math.ceil(totalDuration / 60);

    // Get the overview polyline for the entire route
    const polyline = route.overview_polyline?.points || null;

    return NextResponse.json({
      distance: parseFloat(distanceMiles.toFixed(2)), // in miles
      duration: durationMinutes, // in minutes
      distanceMeters: totalDistance,
      durationSeconds: totalDuration,
      polyline: polyline, // Encoded polyline for displaying route on map
      bounds: route.bounds, // Bounding box for map display
      legs: route.legs.map((leg: {
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        start_address: string;
        end_address: string;
        start_location: { lat: number; lng: number };
        end_location: { lat: number; lng: number };
      }) => ({
        distance: leg.distance.text,
        duration: leg.duration.text,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        startLocation: leg.start_location,
        endLocation: leg.end_location,
      })),
    });
  } catch (error) {
    console.error("Distance calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
