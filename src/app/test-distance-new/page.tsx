"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

// Custom Location Icon Component
const LocationCrosshairIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    {/* Outer circle */}
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="#3B82F6"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Horizontal line - left side (outside and inside) */}
    <line
      x1="4"
      y1="12"
      x2="6"
      y2="12"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Horizontal line - right side (inside and outside) */}
    <line
      x1="18"
      y1="12"
      x2="20"
      y2="12"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Vertical line - top side (outside and inside) */}
    <line
      x1="12"
      y1="4"
      x2="12"
      y2="6"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Vertical line - bottom side (inside and outside) */}
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="20"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Center blue dot */}
    <circle
      cx="12"
      cy="12"
      r="3.5"
      fill="#3B82F6"
    />
  </svg>
);

// Type definitions for Google Places API responses
interface PlacePrediction {
  text: {
    text: string;
  };
  structuredFormat?: {
    mainText: {
      text: string;
    };
    secondaryText?: {
      text: string;
    };
  };
  placeId: string;
}

interface AutocompleteSuggestion {
  placePrediction: PlacePrediction;
}

interface PlaceLocation {
  latitude: number;
  longitude: number;
}

interface PlaceDetails {
  location: PlaceLocation;
  displayName: {
    text: string;
  };
  formattedAddress: string;
}

export default function TestPage() {
  const [pickupQuery, setPickupQuery] = useState("");
  const [dropoffQuery, setDropoffQuery] = useState("");

  const [pickupResults, setPickupResults] = useState<AutocompleteSuggestion[]>([]);
  const [dropoffResults, setDropoffResults] = useState<AutocompleteSuggestion[]>([]);

  const [pickupPlace, setPickupPlace] = useState<PlaceDetails | null>(null);
  const [dropoffPlace, setDropoffPlace] = useState<PlaceDetails | null>(null);

  const [distance, setDistance] = useState<{ distance: string; duration: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const [dropoffError, setDropoffError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // --------------------------------------------------------------
  // NEW PLACES API (v1) - AUTOCOMPLETE
  // --------------------------------------------------------------
  const fetchAutocomplete = async (query: string, setResults: (results: AutocompleteSuggestion[]) => void) => {
    if (!query) return setResults([]);

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey!,
            "X-Goog-FieldMask": "suggestions.placePrediction.structuredFormat,suggestions.placePrediction.placeId,suggestions.placePrediction.text"
          },
          body: JSON.stringify({
            input: query
          })
        }
      );

      const data = await res.json();
      setResults(data?.suggestions || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setResults([]);
    }
  };

  // --------------------------------------------------------------
  // NEW PLACES API - GET PLACE DETAILS (COORDS)
  // --------------------------------------------------------------
  const fetchPlaceDetails = async (placeId: string, setPlace: (place: PlaceDetails) => void) => {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey!,
            "X-Goog-FieldMask": "location,displayName,formattedAddress"
          },
        }
      );

      const data = await res.json();
      console.log("Place details:", data);
      setPlace(data);
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  // --------------------------------------------------------------
  // GEOLOCATION - GET CURRENT LOCATION
  // --------------------------------------------------------------
  const getCurrentLocation = async (type: 'pickup' | 'dropoff') => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          
          const data = await res.json();
          
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            const placeData = {
              location: {
                latitude,
                longitude
              },
              displayName: { text: "Current Location" },
              formattedAddress: address
            };

            if (type === 'pickup') {
              setPickupQuery(address);
              setPickupPlace(placeData);
              setPickupResults([]);
              setShowPickupDropdown(false);
            } else {
              setDropoffQuery(address);
              setDropoffPlace(placeData);
              setDropoffResults([]);
              setShowDropoffDropdown(false);
            }
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          alert("Failed to get address for your location");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please enable location access.");
        setGettingLocation(false);
      }
    );
  };

  // --------------------------------------------------------------
  // DISTANCE MATRIX - Using Routes API (New) instead of Distance Matrix
  // The old Distance Matrix has CORS issues from client-side
  // --------------------------------------------------------------
  const calculateDistance = async () => {
    // Validation
    let hasError = false;
    
    if (!pickupPlace) {
      setPickupError("Please select a location from the suggestions");
      hasError = true;
    }
    
    if (!dropoffPlace) {
      setDropoffError("Please select a location from the suggestions");
      hasError = true;
    }
    
    if (hasError || !pickupPlace || !dropoffPlace) {
      return;
    }

    setLoading(true);

    try {
      // Use the new Routes API (Compute Routes)
      const res = await fetch(
        `https://routes.googleapis.com/directions/v2:computeRoutes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey!,
            "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: pickupPlace.location.latitude,
                  longitude: pickupPlace.location.longitude
                }
              }
            },
            destination: {
              location: {
                latLng: {
                  latitude: dropoffPlace.location.latitude,
                  longitude: dropoffPlace.location.longitude
                }
              }
            },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE"
          })
        }
      );

      const data = await res.json();
      console.log("Routes response:", data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distanceMeters / 1000).toFixed(2);
        const durationMin = Math.round(parseInt(route.duration.replace('s', '')) / 60);

        setDistance({
          distance: `${distanceKm} km`,
          duration: `${durationMin} mins`,
        });
      } else {
        alert("Could not calculate route");
      }
    } catch (error) {
      console.error("Distance calculation error:", error);
      alert("Error calculating distance. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
        Google Places API v1 (New REST API)
      </h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
        Uses new Places API + Routes API (compute routes)
      </p>

      {/* PICKUP */}
      <div className="space-y-2" style={{ marginBottom: 20, position: 'relative' }}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Pick-Up Location
        </label>
        <input
          className={`flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm ${
            pickupError 
              ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/80 focus-visible:ring-[1px]' 
              : 'border-gray-300 focus-visible:border-[#AE9409]/40 focus-visible:ring-[#AE9409]/80 focus-visible:ring-[1px]'
          }`}
          placeholder="Your pick-up location"
          value={pickupQuery}
          onChange={(e) => {
            setPickupQuery(e.target.value);
            setShowPickupDropdown(true);
            setPickupError("");
            setPickupPlace(null);
            fetchAutocomplete(e.target.value, setPickupResults);
          }}
          onFocus={() => setShowPickupDropdown(true)}
          onBlur={() => setTimeout(() => setShowPickupDropdown(false), 300)}
        />

        {showPickupDropdown && (
          <ul className="border border-gray-300 mt-0.5 bg-white max-h-96 overflow-y-auto absolute w-full z-10 shadow-sm">
            <li
              onMouseDown={(e) => {
                e.preventDefault();
                getCurrentLocation('pickup');
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2.5 text-sm"
            >
              <LocationCrosshairIcon />
              <span className="font-normal text-gray-700">
                {gettingLocation ? 'Getting location...' : 'Your current location'}
              </span>
            </li>
            {pickupResults.map((s, i) => {
              const prediction = s.placePrediction;
              const mainText = prediction.structuredFormat?.mainText?.text || prediction.text.text;
              const secondaryText = prediction.structuredFormat?.secondaryText?.text || '';
              
              return (
                <li
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setPickupQuery(prediction.text.text);
                    setPickupResults([]);
                    setShowPickupDropdown(false);
                    setPickupError("");
                    fetchPlaceDetails(prediction.placeId, setPickupPlace);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2.5 border-b border-gray-50 last:border-b-0 text-sm"
                >
                  <span className="text-gray-400"><MapPin className="h-4 w-4" /></span>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <span className="text-gray-900 font-normal">
                      {mainText}
                      {secondaryText && (
                        <span className="text-gray-500">, {secondaryText}</span>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pickupError && (
          <p className="text-red-500 text-sm mt-1">{pickupError}</p>
        )}

      </div>

      {/* DROPOFF */}
      <div className="space-y-2" style={{ marginBottom: 20, position: 'relative' }}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Drop-Off Location
        </label>
        <input
          className={`flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm ${
            dropoffError 
              ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/80 focus-visible:ring-[1px]' 
              : 'border-gray-300 focus-visible:border-[#AE9409]/40 focus-visible:ring-[#AE9409]/80 focus-visible:ring-[1px]'
          }`}
          placeholder="Your drop-off location"
          value={dropoffQuery}
          onChange={(e) => {
            setDropoffQuery(e.target.value);
            setShowDropoffDropdown(true);
            setDropoffError("");
            setDropoffPlace(null);
            fetchAutocomplete(e.target.value, setDropoffResults);
          }}
          onFocus={() => setShowDropoffDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropoffDropdown(false), 300)}
        />

        {showDropoffDropdown && (
          <ul className="border border-gray-300 mt-0.5 bg-white max-h-96 overflow-y-auto absolute w-full z-10 shadow-sm">
            <li
              onMouseDown={(e) => {
                e.preventDefault();
                getCurrentLocation('dropoff');
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2.5 text-sm"
            >
              <LocationCrosshairIcon />
              <span className="font-normal text-gray-700">
                {gettingLocation ? 'Getting location...' : 'Your current location'}
              </span>
            </li>
            {dropoffResults.map((s, i) => {
              const prediction = s.placePrediction;
              const mainText = prediction.structuredFormat?.mainText?.text || prediction.text.text;
              const secondaryText = prediction.structuredFormat?.secondaryText?.text || '';
              
              return (
                <li
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDropoffQuery(prediction.text.text);
                    setDropoffResults([]);
                    setShowDropoffDropdown(false);
                    setDropoffError("");
                    fetchPlaceDetails(prediction.placeId, setDropoffPlace);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2.5 border-b border-gray-50 last:border-b-0 text-sm"
                >
                  <span className="text-gray-400"><MapPin className="h-4 w-4" /></span>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <span className="text-gray-900 font-normal">
                      {mainText}
                      {secondaryText && (
                        <span className="text-gray-500">, {secondaryText}</span>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {dropoffError && (
          <p className="text-red-500 text-sm mt-1">{dropoffError}</p>
        )}
      </div>

      <button
        className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors w-full font-medium text-base"
        onClick={calculateDistance}
      >
        {loading ? "Calculating..." : "Calculate Distance"}
      </button>

      {distance && (
        <div className="mt-6 p-6 border rounded bg-green-50">
          <h2 className="text-xl font-bold mb-4">Ride Details</h2>
          <div style={{ fontSize: 18 }}>
            <p style={{ marginBottom: 10 }}>
              <strong>🚗 Distance:</strong> {distance.distance}
            </p>
            <p>
              <strong>⏳ Duration:</strong> {distance.duration}
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 30, padding: 15, backgroundColor: '#e8f5e9', borderRadius: 5 }}>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#2e7d32' }}>
          ✨ New API Features:
        </h3>
        <ul style={{ fontSize: 13, paddingLeft: 20 }}>
          <li><strong>Places API v1</strong> - New REST autocomplete endpoint</li>
          <li><strong>Routes API v2</strong> - Compute routes for distance calculation</li>
          <li>No CORS issues (proper REST endpoints)</li>
          <li>Modern JSON responses with better typing</li>
          <li>Field masks for efficient data fetching</li>
        </ul>
      </div>

      <div style={{ marginTop: 20, padding: 15, backgroundColor: '#fff3e0', borderRadius: 5 }}>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          📝 Note:
        </h3>
        <p style={{ fontSize: 13 }}>
          This uses the <strong>new REST APIs</strong> which are fully supported and do not have deprecation warnings.
          These APIs work from client-side but can also be called from server-side for better security.
        </p>
      </div>
    </div>
  );
}