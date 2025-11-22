"use client";

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
      x1="2"
      y1="12"
      x2="8"
      y2="12"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Horizontal line - right side (inside and outside) */}
    <line
      x1="16"
      y1="12"
      x2="22"
      y2="12"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Vertical line - top side (outside and inside) */}
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="8"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Vertical line - bottom side (inside and outside) */}
    <line
      x1="12"
      y1="16"
      x2="12"
      y2="22"
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

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onPlaceSelect?: (place: PlaceDetails) => void;
    placeholder?: string;
    error?: string;
    id?: string;
    onError?: (errorMessage: string) => void;
}

export interface LocationAutocompleteRef {
    validateLocation: () => boolean;
    focus: () => void;
}

const LocationAutocomplete = forwardRef<LocationAutocompleteRef, LocationAutocompleteProps>(({
    value,
    onChange,
    onPlaceSelect,
    placeholder = "Enter location",
    error = "",
    id,
    onError
}, ref) => {
    const [results, setResults] = useState<AutocompleteSuggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // When value is pre-filled from parent (e.g., autofill from onward to return journey),
    // mark it as valid so validation passes
    useEffect(() => {
        if (value && value.trim() !== '') {
            setIsValidLocation(true);
        }
    }, [value]);

  // Fetch autocomplete suggestions
    const fetchAutocomplete = async (query: string) => {
        if (!query) {
        setResults([]);
        return;
        }

        try {
        const res = await fetch('/api/location/autocomplete', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: query })
        });

        if (!res.ok) {
            throw new Error('Failed to fetch autocomplete suggestions');
        }

        const data = await res.json();
        setResults(data?.suggestions || []);
        } catch (error) {
        console.error("Autocomplete error:", error);
        setResults([]);
        }
    };

  // Fetch place details
    const fetchPlaceDetails = async (placeId: string) => {
        try {
        const res = await fetch(`/api/location/place/${placeId}`);

        if (!res.ok) {
            throw new Error('Failed to fetch place details');
        }

        const data = await res.json();
        if (onPlaceSelect) {
            onPlaceSelect(data);
        }
        } catch (error) {
        console.error("Place details error:", error);
        }
    };

  // Get current location
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
        if (onError) {
            onError("Geolocation is not supported by your browser");
        }
        return;
        }

        setGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
            // Reverse geocode to get address
            const res = await fetch(
                `/api/location/geocode?latlng=${latitude},${longitude}`
            );

            if (!res.ok) {
                throw new Error('Failed to reverse geocode location');
            }
            
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                const address = data.results[0].formatted_address;
                const placeData: PlaceDetails = {
                location: {
                    latitude,
                    longitude
                },
                displayName: { text: "Current Location" },
                formattedAddress: address
                };

                onChange(address);
                setResults([]);
                setShowDropdown(false);
                setIsValidLocation(true); // Mark as valid for current location
                
                if (onPlaceSelect) {
                onPlaceSelect(placeData);
                }
            }
            } catch (error) {
            console.error("Reverse geocoding error:", error);
            if (onError) {
                onError("Failed to get address for your location");
            }
            } finally {
            setGettingLocation(false);
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            let errorMessage = "Failed to get your location";
            
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = "Location access denied. Please enable location permissions.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage = "Location information is unavailable";
            } else if (error.code === error.TIMEOUT) {
                errorMessage = "Location request timed out";
            }
            
            if (onError) {
                onError(errorMessage);
            }
            setGettingLocation(false);
        }
        );
    };

  // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowDropdown(true);
        setIsValidLocation(false); // Reset validation when user types
        fetchAutocomplete(newValue);
    };

  // Handle suggestion selection
    const handleSelectSuggestion = (prediction: PlacePrediction) => {
        onChange(prediction.text.text);
        setResults([]);
        setShowDropdown(false);
        setIsValidLocation(true); // Mark as valid when suggestion is selected
        fetchPlaceDetails(prediction.placeId);
    };

    // Expose validation method via ref
    useImperativeHandle(ref, () => ({
        validateLocation: () => {
            return isValidLocation && value.trim() !== '';
        },
        focus: () => {
            inputRef.current?.focus();
        }
    }));

    return (
        <div className="space-y-2 relative">
        <input
            ref={inputRef}
            id={id}
            autoComplete="off"
            className={cn(
            "flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
            error
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/80 focus-visible:ring-[1px]"
                : "border-gray-300 focus-visible:border-[#AE9409]/40 focus-visible:ring-[#AE9409]/80 focus-visible:ring-[1px]"
            )}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
        />

        {showDropdown && (
            <ul className="border border-gray-300 mt-0.5 bg-white max-h-96 overflow-y-auto absolute w-full z-10 shadow-sm">
            <li
                onMouseDown={(e) => {
                e.preventDefault();
                getCurrentLocation();
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2.5 text-sm"
            >
                <LocationCrosshairIcon />
                <span className="font-normal text-gray-700">
                {gettingLocation ? 'Getting location...' : 'Your current location'}
                </span>
            </li>
            {results.map((s, i) => {
                const prediction = s.placePrediction;
                const mainText = prediction.structuredFormat?.mainText?.text || prediction.text.text;
                const secondaryText = prediction.structuredFormat?.secondaryText?.text || '';
                
                return (
                <li
                    key={i}
                    onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(prediction);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2.5 border-b border-gray-50 last:border-b-0 text-sm"
                >
                    <span className="text-gray-400 text-base flex-shrink-0">✈️</span>
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

        {error && (
            <p className="text-red-500 text-xs mt-1 animate-pulse">{error}</p>
        )}
        </div>
    );
});

LocationAutocomplete.displayName = 'LocationAutocomplete';

export default LocationAutocomplete;
export type { PlaceDetails, PlaceLocation };