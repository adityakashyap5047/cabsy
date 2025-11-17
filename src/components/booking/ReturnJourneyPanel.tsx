'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AddDetails from './AddDetails';
import Checkout from './Checkout';

interface ReturnJourneyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  outboundBooking: {
    pickupLocation: string;
    dropoffLocation: string;
    date: Date | undefined;
    time: string | null;
    passengers: number;
    luggage: number;
  };
}

const ReturnJourneyPanel: React.FC<ReturnJourneyPanelProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  
  const handleSaveReturnJourney = () => {
    onSave();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Return Journey</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close panel"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Step 1: Return Ride Details */}
          <AddDetails isReturnJourney={true} />

          {/* Step 2: Passenger Management */}
          <Checkout isReturnJourney={true} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none border-gray-400 text-gray-600 hover:bg-gray-100 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveReturnJourney}
            className="rounded-none bg-[#AE9404] hover:bg-[#8a7503] text-white font-medium px-4 sm:px-8 w-full sm:w-auto"
          >
            Save Return Journey
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReturnJourneyPanel;
