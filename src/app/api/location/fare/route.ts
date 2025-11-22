import { NextRequest, NextResponse } from "next/server";

interface FareCalculationRequest {
  distance: number; // in miles
  serviceType: string; // 'standard' or 'out-of-area'
  duration?: number; // in minutes (optional, for wait time)
  waitTimeMinutes?: number; // Additional wait time at stops
}

interface FareCalculationResponse {
  baseFare: number;
  distanceFare: number;
  waitTimeFare: number;
  totalFare: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const body: FareCalculationRequest = await req.json();
    const { distance, serviceType, waitTimeMinutes = 5 } = body;

    // Validate inputs
    if (!distance || distance < 0) {
      return NextResponse.json(
        { error: "Valid distance is required" },
        { status: 400 }
      );
    }

    if (!serviceType || !['standard', 'out-of-area'].includes(serviceType)) {
      return NextResponse.json(
        { error: "Service type must be 'standard' or 'out-of-area'" },
        { status: 400 }
      );
    }

    let baseFare = 0;
    let distanceFare = 0;
    let waitTimeFare = 0;
    const breakdown: { description: string; amount: number }[] = [];

    // Standard Area Rates (Within 25 Miles)
    if (serviceType === 'standard') {
      // $10.00 for the first 4 miles
      const baseDistance = 4;
      const baseFareAmount = 10.00;
      const perMileRate = 2.20;
      const minimumCharge = 10.00;

      if (distance <= baseDistance) {
        // For trips under or equal to 4 miles, use base fare or minimum charge
        baseFare = Math.max(baseFareAmount, minimumCharge);
        breakdown.push({
          description: `Base fare (first ${baseDistance} miles)`,
          amount: baseFare
        });
      } else {
        // For trips over 4 miles
        baseFare = baseFareAmount;
        breakdown.push({
          description: `Base fare (first ${baseDistance} miles)`,
          amount: baseFare
        });

        // Calculate additional distance fare
        const additionalMiles = distance - baseDistance;
        distanceFare = additionalMiles * perMileRate;
        breakdown.push({
          description: `${additionalMiles.toFixed(2)} additional miles @ $${perMileRate.toFixed(2)}/mile`,
          amount: distanceFare
        });
      }
    }
    
    // Out-of-Area Rates
    else if (serviceType === 'out-of-area') {
      // $15.00 for the first 4 miles
      const baseDistance = 4;
      const baseFareAmount = 15.00;
      const perMileRate = 3.30;
      const minimumCharge = 100.00; // Can be $100-$150

      if (distance <= baseDistance) {
        // Apply minimum charge for short trips
        baseFare = Math.max(baseFareAmount, minimumCharge);
        breakdown.push({
          description: `Minimum charge (trips under ${baseDistance} miles)`,
          amount: baseFare
        });
      } else {
        // For trips over 4 miles
        baseFare = baseFareAmount;
        breakdown.push({
          description: `Base fare (first ${baseDistance} miles)`,
          amount: baseFare
        });

        // Calculate additional distance fare
        const additionalMiles = distance - baseDistance;
        distanceFare = additionalMiles * perMileRate;
        breakdown.push({
          description: `${additionalMiles.toFixed(2)} additional miles @ $${perMileRate.toFixed(2)}/mile`,
          amount: distanceFare
        });

        // Calculate total before minimum check
        const calculatedFare = baseFare + distanceFare;
        
        // Apply minimum charge if calculated fare is less
        if (calculatedFare < minimumCharge) {
          baseFare = minimumCharge;
          distanceFare = 0;
          breakdown.length = 0; // Clear previous breakdown
          breakdown.push({
            description: `Minimum charge for out-of-area service`,
            amount: minimumCharge
          });
        }
      }
    }

    // Wait Time Calculation ($1.00 per minute)
    if (waitTimeMinutes > 0) {
      const waitTimeRate = 1.00;
      waitTimeFare = waitTimeMinutes * waitTimeRate;
      breakdown.push({
        description: `Wait time (${waitTimeMinutes} minutes @ $${waitTimeRate.toFixed(2)}/min)`,
        amount: waitTimeFare
      });
    }

    // Calculate total fare
    const totalFare = baseFare + distanceFare + waitTimeFare;

    const response: FareCalculationResponse = {
      baseFare: parseFloat(baseFare.toFixed(2)),
      distanceFare: parseFloat(distanceFare.toFixed(2)),
      waitTimeFare: parseFloat(waitTimeFare.toFixed(2)),
      totalFare: parseFloat(totalFare.toFixed(2)),
      breakdown: breakdown.map(item => ({
        description: item.description,
        amount: parseFloat(item.amount.toFixed(2))
      }))
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Fare calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate fare" },
      { status: 500 }
    );
  }
}
