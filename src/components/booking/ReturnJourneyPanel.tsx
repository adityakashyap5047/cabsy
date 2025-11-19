'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AddDetails, { AddDetailsRef } from './AddDetails';
import Checkout from './Checkout';
import { useBooking } from '@/context/BookingContext';

interface ReturnJourneyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
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
  onCancel,
  onSave,
}) => {
  const { state, dispatch } = useBooking();
  const addDetailsRef = React.useRef<AddDetailsRef>(null);
  const step = 2;
  const showSummary = state.returnSummarySteps.includes(step);
  const isExpanded = state.returnExpandedSteps.includes(step);
  const is1Expanded = state.returnExpandedSteps.includes(1);
  const is1HasSummary = state.returnSummarySteps.includes(1);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleCancel = () => {
    // Reset the return journey form and disable return service
    onCancel();
  };

  const handleSaveReturnJourney = () => {
    const isStep1Valid = addDetailsRef.current?.validateAndFocus();
    if (!isStep1Valid) {
      return;
    }
    if(is1Expanded) {
      dispatch({ type: "COMPLETE_RETURN_STEP", payload: 1 });
      dispatch({ type: "TOGGLE_RETURN_STEP", payload: 1 });
      if (!is1HasSummary) {
        setTimeout(() => {
          dispatch({ type: "TOGGLE_RETURN_SUMMARY", payload: 1 });
        }, 50);
      }
      if (!showSummary) {
        setTimeout(() => {
          dispatch({ type: "TOGGLE_RETURN_SUMMARY", payload: step });
        }, 50);
      }
    }
    dispatch({ type: "COMPLETE_RETURN_STEP", payload: step });
    setTimeout(() => {
      if(isExpanded && !showSummary) dispatch({ type: "TOGGLE_RETURN_SUMMARY", payload: step });
      setTimeout(() => {
        if(isExpanded) dispatch({ type: "TOGGLE_RETURN_STEP", payload: step });
        setTimeout(() => {
          onSave();
        }, (isExpanded || is1Expanded) ? 1300 : 0);
      }, 100);
    }, 50);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed right-0 top-1/2 transform transition-transform duration-700 ease-in-out ${
          isOpen ? 'translate-x-0 -translate-y-1/2' : 'translate-x-full -translate-y-1/2'
        } bg-white shadow-2xl z-50 overflow-y-auto h-[96vh] max-h-[90vh] border-y-4 border-y-gray-400 border-l-4 border-l-gray-400`}
        style={{ scrollbarWidth: 'none', width: '340px', maxWidth: '90vw' }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Return Journey</h2>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full transition-colors"
            aria-label="Close panel"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-6">
          <AddDetails ref={addDetailsRef} isReturnJourney={true} forceMobileLayout={true} />
          <Checkout isReturnJourney={true} />
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 max-[360px]:px-4 px-6 py-4">
          <div className="flex flex-row gap-0 justify-between items-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-none cursor-pointer border border-gray-400 text-gray-600 bg-transparent hover:text-white hover:bg-gray-500 transition-all duration-200 transform hover:scale-105 w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReturnJourney}
              className="cursor-pointer rounded-none bg-[#AE9404] hover:bg-[#8a7503] text-white font-medium px-8 w-auto"
            >
              Save Return Journey
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnJourneyPanel;
