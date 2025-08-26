'use client';

import Image from 'next/image';
import { Users, Info, BriefcaseBusinessIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface Vehicle {
  id: string;
  name: string;
  passengers: number;
  luggage: number;
  price: number;
  image: string;
  isSelected?: boolean;
}

const SelectVehicle = () => {
  const vehicles: Vehicle[] = [
    {
      id: 'luxury-sedan',
      name: 'Luxury Sedan',
      passengers: 2,
      luggage: 6,
      price: 124.50,
      image: '/cabsy/cabsy.png',
      isSelected: true
    },
    {
      id: 'luxury-suv',
      name: 'Luxury SUV',
      passengers: 6,
      luggage: 8,
      price: 149.36,
      image: '/cabsy/cabsy.png'
    },
    {
      id: 'luxury-suv-se',
      name: 'Luxury SUV & SE...',
      passengers: 9,
      luggage: 12,
      price: 278.18,
      image: '/cabsy/cabsy.png'
    },
    {
      id: 'full-size-suvs',
      name: '(2) Full Size SUVs',
      passengers: 12,
      luggage: 17,
      price: 305.30,
      image: '/cabsy/cabsy.png'
    },
    {
      id: 'large-party-vehicle',
      name: 'Large Party Vehi...',
      passengers: 35,
      luggage: 40,
      price: 0, // Request Quote
      image: '/cabsy/cabsy.png'
    }
  ];

  const handleBookNow = (vehicle: Vehicle) => {
    console.log('Booking vehicle:', vehicle);
    // Handle booking logic here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4 mb-8">
    {vehicles.map((vehicle) => (
        <div
        key={vehicle.id}
        className={`w-60 overflow-hidden transition-all hover:ring-1 hover:ring-yellow-500 hover:border-yellow-500`}
        >
        <h3 className="font-semibold text-lg text-gray-800 my-3 text-center">{vehicle.name}</h3>
        {/* Vehicle Image */}
        <div className="relative h-40 bg-gray-100 flex items-center justify-center">
            <Image
            src="/cabsy/cabsy.png"
            alt={vehicle.name}
            width={200}
            height={120}
            className="object-contain"
            onError={(e) => {
                // Fallback to a placeholder div if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
            }}
            />
            {/* Fallback placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-32 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Vehicle</span>
            </div>
            </div>
        </div>

        {/* Vehicle Info */}
        <div className="p-4">            
            {/* Passengers and Luggage */}
            <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-gray-600">
                <Button type="button" variant={"primary"} className="border w-1/5 !px-4 cursor-context-menu rounded-none border-gray-400">
                <Users/>
              </Button>
                <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                {vehicle.passengers}
              </Button>
            </div>
            <div className="flex items-center justify-end text-gray-600">
              <Button type="button" variant={"primary"} className="border w-1/5 !px-4 cursor-context-menu rounded-none border-gray-400">
                <BriefcaseBusinessIcon />
              </Button>
              <Button type="button" variant={"primary"} className="border w-1/5 cursor-context-menu rounded-none border-gray-400">
                {vehicle.luggage}
              </Button>
            </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold flex-1 text-yellow-600">
                <p className='text-center'>${vehicle.price.toFixed(2)}</p>
            </div>
            <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>

            {/* Book Now Button */}
            <button
            onClick={(e) => {
                e.stopPropagation();
                handleBookNow(vehicle);
            }}
            className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
            Book Now
            </button>
        </div>
        </div>
    ))}
    </div>
  );
};

export default SelectVehicle;
