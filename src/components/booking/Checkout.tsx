'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import StepHeader from './StepHeader';
import { useBooking } from '@/context/BookingContext';
import LeadDetails from './LeadDetails';
import AddPassenger, { Passenger } from './AddPassenger';
import EditPassenger from './EditPassenger';
import Remarks from './Remarks';
import ReturnJourneyPanel from './ReturnJourneyPanel';
import { Edit, MapPin } from 'lucide-react';
import { format } from "date-fns";

interface CheckoutProps {
  isReturnJourney?: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({ isReturnJourney = false }) => {
  const { state, dispatch } = useBooking();
  const stepNumber = isReturnJourney ? 2 : 3;
  
  const [hasReturnJourney, setHasReturnJourney] = useState(state.returnEnabled);
  const [isReturnPanelOpen, setIsReturnPanelOpen] = useState(false);
  const [isReturnJourneySaved, setIsReturnJourneySaved] = useState(false);
  const isExpanded = isReturnJourney
    ? state.returnExpandedSteps.includes(stepNumber)
    : state.expandedSteps.includes(stepNumber);
  const isCompleted = isReturnJourney
    ? state.returnCompletedSteps.includes(stepNumber)
    : state.completedSteps.includes(stepNumber);
  const showSummary = isReturnJourney
    ? state.returnSummarySteps.includes(stepNumber)
    : state.summarySteps.includes(stepNumber);
  const isEditing = isExpanded && isCompleted;

  const [leadData, setLeadData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
console.log(state);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [remarks, setRemarks] = useState<string>('');

  const currentJourney = isReturnJourney ? state.returnJourney : state.onward;

  useEffect(() => {
    const user = currentJourney?.user;
    if (!user) {
      setLeadData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
      setPassengers([]);
      setRemarks(currentJourney?.remarks || '');
      return;
    }

    const userPassengers = user.passengers || [];

    if (userPassengers.length > 0) {
      const lead = userPassengers[0];
      const [firstName, ...name] = (lead.name || '').split(' ');
      setLeadData({
        firstName: firstName || '',
        lastName: name.join(' ') || '',
        phoneNumber: lead.phone || '',
        email: lead.email || ''
      });

      const additional = userPassengers.slice(1).map((p, i) => ({
        id: Date.now() + i,
        firstName: (p.name || '').split(' ')[0] || '',
        lastName: (p.name || '').split(' ').slice(1).join(' ') || '',
        phoneNumber: p.phone || '',
        email: p.email || ''
      }));
      setPassengers(additional);
    } else {
      setLeadData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
      setPassengers([]);
    }
    setRemarks(currentJourney?.remarks || '');
  }, [currentJourney]);

  const handlePassengersChange = (updatedPassengers: Passenger[]) => {
    setPassengers(updatedPassengers);
    
    const leadPassenger = {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: leadData.email || undefined,
      phone: leadData.phoneNumber || undefined
    };

    const additionalPassengers = updatedPassengers.map(p => ({
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || undefined,
      phone: p.phoneNumber || undefined
    }));
    
    dispatch({
      type: isReturnJourney ? "SET_RETURN_USER" : "SET_USER",
      payload: {
        ...currentJourney?.user,
        passengers: [leadPassenger, ...additionalPassengers]
      }
    });
  };

  const handleLeadUpdate = (updatedLeadData: { firstName: string; lastName: string; phoneNumber: string; email: string }) => {
    setLeadData(updatedLeadData);

    const updatedLead = {
      name: `${updatedLeadData.firstName} ${updatedLeadData.lastName}`,
      email: updatedLeadData.email || undefined,
      phone: updatedLeadData.phoneNumber || undefined
    };

    const additionalPassengers = passengers.map(p => ({
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || undefined,
      phone: p.phoneNumber || undefined
    }));
    
    dispatch({
      type: isReturnJourney ? "SET_RETURN_USER" : "SET_USER",
      payload: {
        ...currentJourney?.user,
        passengers: [updatedLead, ...additionalPassengers]
      }
    });
  };

  const handleEdit = () => {
    dispatch({ type: isReturnJourney ? "COLLAPSE_AFTER_RETURN_STEP" : "COLLAPSE_AFTER_STEP", payload: stepNumber });
    if (!isExpanded) dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_STEP" : "TOGGLE_STEP", payload: stepNumber });
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: isReturnJourney ? "TOGGLE_RETURN_SUMMARY" : "TOGGLE_SUMMARY", payload: stepNumber });
    }
  };

  const handleRemarksChange = (value: string) => {
    setRemarks(value);
    dispatch({ 
      type: isReturnJourney ? "ADD_RETURN_REMARKS" : "ADD_ONWARD_REMARKS", 
      payload: value 
    });
  };

  const handleEnableReturnJourney = () => {
    if (!isReturnJourneySaved) {
      setHasReturnJourney(true);
      dispatch({ type: "ENABLE_RETURN_JOURNEY", payload: true });
      dispatch({ type: "INITIALIZE_RETURN_JOURNEY" });
      setIsReturnPanelOpen(true);
    }
  };

  const handleDisableReturnJourney = () => {
    setHasReturnJourney(false);
    setIsReturnPanelOpen(false);
    setIsReturnJourneySaved(false);
    dispatch({ type: "ENABLE_RETURN_JOURNEY", payload: false });
    dispatch({ type: "CLEAR_RETURN_JOURNEY" });
  };

  

  const handleReturnJourneySave = () => {
    setIsReturnJourneySaved(true);
    return true;
  };

  const handleEditReturnJourney = () => {
    setIsReturnPanelOpen(true);
  };

  const summary = isCompleted ? (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="font-semibold text-gray-600 text-sm">Lead:</span>
        <span className="text-gray-700 text-sm">{leadData.firstName} {leadData.lastName}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-gray-600 text-sm">Phone:</span>
        <span className="text-gray-700 text-sm">{leadData.phoneNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-gray-600 text-sm">Email:</span>
        <span className="text-gray-700 text-sm">{leadData.email.split('@')[0]?.length > 11 ? leadData.email.split('@')[0].slice(0, 8) + '...@' + leadData.email.split('@')[1] : leadData.email}</span>
      </div>
    </div>
  ) : null;

  return (
    <>
    <div className='mt-4'>
      <StepHeader
        stepNumber={stepNumber}
        title="Checkout"
        isCompleted={isCompleted}
        isEditing={isEditing}
        showSummary={showSummary}
        onToggleSummary={handleToggleSummary}
        onEdit={handleEdit}
        summary={summary}
      />
      <div 
        className="overflow-hidden transition-all duration-900 ease-in-out"
        style={{
          maxHeight: isExpanded ? '5000px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0">
        <div className={`w-full ${!isReturnJourney ? 'md:w-1/2 px-3 sm:px-4 md:px-6' : ''} flex flex-col`}>
          <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">Passenger Information</h2>
          </div>
          <div className="py-3 sm:py-4 md:py-6">
            <LeadDetails
              lead={leadData}
              onLeadUpdate={handleLeadUpdate}
              isReturnJourney={isReturnJourney}
            />
            <AddPassenger
              passengers={passengers}
              onPassengersChange={handlePassengersChange}
              isReturnJourney={isReturnJourney}
            />
            <EditPassenger
              passengers={passengers}
              onPassengersChange={handlePassengersChange}
              isReturnJourney={isReturnJourney}
            />
            <Remarks value={remarks} handleRemarksChange={handleRemarksChange} onChange={setRemarks} />
          </div>
        </div>
        {!isReturnJourney && (
          <>
            <div className="hidden md:flex items-stretch">
              <div className="w-px bg-gray-300 mx-0 h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col px-3 sm:px-4 md:px-6">
          <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">Return Service</h2>
            {isReturnJourneySaved && (
              <button
              onClick={handleEditReturnJourney}
              className="flex items-center cursor-pointer gap-1 text-gray-700 hover:text-[#ae9409] transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            )}
          </div>
          <div className='flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center justify-between px-3 sm:px-4 md:px-6 mt-2 sm:mt-3 gap-2'>
            <p className="text-xs sm:text-sm md:text-base">Would you like to book return service?</p>
            <div className="flex w-full min-[420px]:w-auto">
              <Button
                type="button"
                onClick={handleEnableReturnJourney}
                disabled={isReturnJourneySaved}
                className={`rounded-none border font-medium sm:text-sm md:text-base py-2 px-6 flex-1 min-[420px]:flex-none ${
                  isReturnJourneySaved
                    ? 'border-[#AE9404] bg-[#AE9404] cursor-not-allowed'
                    : hasReturnJourney
                    ? 'border-[#AE9404] bg-[#AE9404] text-white hover:bg-[#8a7503] cursor-pointer'
                    : 'border-[#AE9404] text-[#AE9404] bg-transparent hover:text-white hover:bg-[#AE9404] cursor-pointer'
                }`}
              >
                Yes
              </Button>
              <Button
                type="button"
                onClick={handleDisableReturnJourney}
                disabled={!hasReturnJourney}
                className={`rounded-none cursor-pointer border font-medium sm:text-sm md:text-base py-2 px-6 flex-1 min-[420px]:flex-none ${
                  !hasReturnJourney
                    ? 'border-gray-500 bg-gray-500 hover:bg-gray-500 cursor-not-allowed text-white'
                    : 'border-gray-400 text-gray-600 bg-transparent hover:text-gray-400 hover:bg-gray-500'
                }`}
              >
                No
              </Button>
            </div>
          </div>
          
          {isReturnJourneySaved && state.returnJourney && (
            <div className={`grid grid-cols-2 gap-y-3 mx-2 md:mx-6! mt-1 p-3 bg-gray-100 border-l-4 border-[#ae9409]`}>
                <div className="space-y-2 sm:space-y-3 min-w-[114px]">
                  <div className="flex gap-1 flex-wrap">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      {state.returnJourney.date && format(state.returnJourney.date, "MM/dd/yyyy")}
                    </span>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      {state.returnJourney.time}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 text-sm">Passenger:</span>{' '}
                    <span className="text-gray-700 text-sm">{state.returnJourney.passengers}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 text-sm">Luggage:</span>{' '}
                    <span className="text-gray-700 text-sm">{state.returnJourney.luggage}</span>
                  </div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
                    Fare: <span className="text-yellow-600 text-sm sm:text-base font-semibold">$124.50</span>
                  </h1>
                </div>
                
                <div className="space-y-3 justify-self-end">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                    <span className="text-green-400 font-semibold text-sm break-words">{state.returnJourney.pickupLocation}</span>
                  </div>
                  {
                    state.returnJourney.stops && state.returnJourney.stops?.length > 0 && state.returnJourney.stops.map((stop, idx) => (
                      <div key={idx} className="flex ml-4 items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                        <span className="text-yellow-400 font-semibold text-sm break-words">{stop}</span>
                      </div>
                    ))
                  }
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                    <span className="text-red-400 font-semibold text-sm break-words">{state.returnJourney.dropoffLocation}</span>
                  </div>
                </div>
              </div>
          )}
          
          {/* Bottom  */}
          <div className="bg-gray-100 mt-3 sm:mt-4 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">Pricing</h2>
          </div>
          <div>
            <div className="bg-gray-50 flex justify-between mt-2 sm:mt-3 md:mt-4 px-3 sm:px-6 md:px-12 py-1 border-b border-gray-100">
              <p className='font-semibold text-gray-500 text-sm sm:text-base'>Base Fare</p>
              <p className='font-semibold text-gray-500 text-sm sm:text-base'>$6719.39</p>
            </div>
          </div>
          <div>
            <div className="bg-slate-800 rounded flex justify-between mt-2 sm:mt-3 md:mt-4 px-3 sm:px-6 md:px-12 py-3 sm:py-4 border-b border-gray-100">
              <p className='text-base sm:text-lg md:text-xl font-semibold text-gray-400'>Total</p>
              <p className='text-base sm:text-lg md:text-xl font-semibold text-gray-400'>$6719.39</p>
            </div>
          </div>
          <Button
            type="submit"
            className={`w-full mt-3 sm:mt-4 bg-[#AE9409] hover:bg-[#8B7507] cursor-pointer rounded-none text-white font-medium text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 transition-all duration-200 hover:shadow-lg transform
            }`}
          >
            Proceed to Payment
          </Button>
        </div>
          </>
        )}
      </div>
      </div>
    </div>
    
    {!isReturnJourney && (
      <ReturnJourneyPanel
        isOpen={isReturnPanelOpen}
        onClose={() => setIsReturnPanelOpen(false)}
        onSave={() => {
          if (handleReturnJourneySave()) {
            setIsReturnPanelOpen(false);
          }
        }}
        outboundBooking={{
          pickupLocation: state.onward.pickupLocation,
          dropoffLocation: state.onward.dropoffLocation,
          date: state.onward.date,
          time: state.onward.time,
          passengers: state.onward.passengers,
          luggage: state.onward.luggage,
        }}
      />
    )}
    </>
  );
};

export default Checkout;
