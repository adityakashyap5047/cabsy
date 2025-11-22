"use client";

import { useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface RouteMapProps {
  pickupCoordinates: { latitude: number; longitude: number } | null;
  dropoffCoordinates: { latitude: number; longitude: number } | null;
  stopsCoordinates?: Array<{ latitude: number; longitude: number } | null>;
  polyline?: string | null;
  className?: string;
}

const RouteMap = ({ 
  pickupCoordinates, 
  dropoffCoordinates, 
  stopsCoordinates = [],
  polyline,
  className = "h-[400px] w-full"
}: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polylineInstanceRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const updateMapRoute = useCallback(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers and polyline
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];
    if (polylineInstanceRef.current) {
      polylineInstanceRef.current.setMap(null);
    }

    if (!pickupCoordinates || !dropoffCoordinates) return;

    const bounds = new google.maps.LatLngBounds();

    // Create pin elements for markers using MapPin icon
    const createPinElement = (color: string) => {
      const pinElement = document.createElement('div');
      pinElement.style.display = 'inline-block';
      pinElement.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
      
      const iconSvg = renderToString(
        <MapPin 
          size={30} 
          fill={color} 
          stroke="white"
          strokeWidth={1}
        />
      );
      
      pinElement.innerHTML = iconSvg;
      return pinElement;
    };

    // Add pickup marker (green)
    const pickupMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: pickupCoordinates.latitude, lng: pickupCoordinates.longitude },
      map: mapInstanceRef.current,
      title: "Pickup Location",
      content: createPinElement("#22c55e"),
    });
    markersRef.current.push(pickupMarker);
    bounds.extend({ lat: pickupCoordinates.latitude, lng: pickupCoordinates.longitude });

    // Add stop markers (yellow)
    const validStops = stopsCoordinates?.filter(coord => coord !== null) || [];
    validStops.forEach((stop, index) => {
      if (stop) {
        const stopMarker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: stop.latitude, lng: stop.longitude },
          map: mapInstanceRef.current!,
          title: `Stop ${index + 1}`,
          content: createPinElement("#eab308"),
        });
        markersRef.current.push(stopMarker);
        bounds.extend({ lat: stop.latitude, lng: stop.longitude });
      }
    });

    // Add dropoff marker (red)
    const dropoffMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: dropoffCoordinates.latitude, lng: dropoffCoordinates.longitude },
      map: mapInstanceRef.current,
      title: "Dropoff Location",
      content: createPinElement("#ef4444"),
    });
    markersRef.current.push(dropoffMarker);
    bounds.extend({ lat: dropoffCoordinates.latitude, lng: dropoffCoordinates.longitude });

    // Draw route polyline if available
    if (polyline && window.google?.maps?.geometry) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      
      polylineInstanceRef.current = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current,
      });

      // Extend bounds to include all polyline points
      decodedPath.forEach(point => bounds.extend(point));
    }

    // Fit map to show all markers
    if (!bounds.isEmpty() && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      });
    }
  }, [pickupCoordinates, dropoffCoordinates, stopsCoordinates, polyline]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    // Create map centered on US (Kansas - geographic center)
    const defaultCenter = { lat: 39.8283, lng: -98.5795 };

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 3,
        center: defaultCenter,
        mapId: 'ROUTE_MAP',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      updateMapRoute();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [updateMapRoute]);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google?.maps?.Map) {
      // Check if script is already in the document
      const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com/maps/api/js"]`
      );
      
      if (existingScript) {
        // Script exists but not loaded yet, wait for it
        const checkGoogle = setInterval(() => {
          if (window.google?.maps?.Map) {
            clearInterval(checkGoogle);
            // Add extra delay to ensure all APIs are ready
            setTimeout(initializeMap, 200);
          }
        }, 100);
        return () => clearInterval(checkGoogle);
      }
      
      // Create new script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        // Wait for the API to fully initialize
        const checkReady = setInterval(() => {
          if (window.google?.maps?.Map && window.google?.maps?.marker?.AdvancedMarkerElement) {
            clearInterval(checkReady);
            initializeMap();
          }
        }, 100);
      };
    } else {
      initializeMap();
    }
  }, [initializeMap]);

  useEffect(() => {
    if (mapInstanceRef.current && pickupCoordinates && dropoffCoordinates) {
      updateMapRoute();
    }
  }, [pickupCoordinates, dropoffCoordinates, stopsCoordinates, polyline, updateMapRoute]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-md" />
    </div>
  );
};

export default RouteMap;
