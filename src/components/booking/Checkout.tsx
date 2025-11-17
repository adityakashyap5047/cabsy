'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepHeader from './StepHeader';
import { useBooking } from '@/context/BookingContext';
import LeadDetails from './LeadDetails';
import AddPassenger, { Passenger } from './AddPassenger';
import EditPassenger from './EditPassenger';
import Remarks from './Remarks';
import ReturnJourneyPanel from './ReturnJourneyPanel';

interface CheckoutProps {
  isReturnJourney?: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({ isReturnJourney = false }) => {
  const { state, dispatch } = useBooking();
  const stepNumber = isReturnJourney ? 2 : 3;
  
  const [hasReturnJourney, setHasReturnJourney] = useState(state.returnEnabled);
  const [isReturnPanelOpen, setIsReturnPanelOpen] = useState(false);
  const isExpanded = state.expandedSteps.includes(stepNumber);
  const isCompleted = state.completedSteps.includes(stepNumber);
  const showSummary = state.summarySteps.includes(stepNumber);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(true);
    dispatch({ type: "COLLAPSE_AFTER_STEP", payload: stepNumber });
    if (!isExpanded) dispatch({ type: "TOGGLE_STEP", payload: stepNumber });
  };

  const handleToggleSummary = () => {
    if (isCompleted) {
      dispatch({ type: "TOGGLE_SUMMARY", payload: stepNumber });
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
    setHasReturnJourney(true);
    dispatch({ type: "ENABLE_RETURN_JOURNEY", payload: true });
    dispatch({ type: "INITIALIZE_RETURN_JOURNEY" });
    setIsReturnPanelOpen(true);
  };

  const handleDisableReturnJourney = () => {
    setHasReturnJourney(false);
    setIsReturnPanelOpen(false);
    dispatch({ type: "ENABLE_RETURN_JOURNEY", payload: false });
  };

  const summary = true ? (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Payment Method:</span>
        {/* <span className="font-medium">{paymentMethod}</span> */}
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Amount Paid:</span>
        {/* <span className="font-medium">${paymentAmount.toFixed(2)}</span> */}
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
        className="overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          maxHeight: isExpanded ? '6000px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center p-0 md:px-8">
        <div className={`w-full ${!isReturnJourney ? 'md:w-1/2' : ''} flex flex-col px-4 sm:px-6 py-8`}>
          <div className="bg-gray-100 px-4 sm:px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Passenger Information</h2>
          </div>
          <div className="p-4 sm:p-6">
            <LeadDetails
              lead={leadData}
              onLeadUpdate={handleLeadUpdate}
            />
            <AddPassenger
              passengers={passengers}
              onPassengersChange={handlePassengersChange}
            />
            <EditPassenger
              passengers={passengers}
              onPassengersChange={handlePassengersChange}
            />
            <Remarks value={remarks} handleRemarksChange={handleRemarksChange} onChange={setRemarks} />
          </div>
        </div>
        {!isReturnJourney && (
          <>
            <div className="hidden md:flex items-stretch">
              <div className="w-px bg-gray-300 mx-0 h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col px-4 sm:px-6 py-8">
          <div className="bg-gray-100 px-4 sm:px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Return Service</h2>
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 mt-2 gap-2'>
            <p className="text-sm sm:text-base">Would you like to book return service?</p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleEnableReturnJourney}
                className={`rounded-none cursor-pointer border font-medium px-4 sm:px-6 flex-1 sm:flex-none ${
                  hasReturnJourney
                    ? 'border-[#AE9404] bg-[#AE9404] text-white hover:bg-[#8a7503]'
                    : 'border-[#AE9404] text-[#AE9404] bg-transparent hover:text-white hover:bg-[#AE9404]'
                }`}
              >
                Yes
              </Button>
              <Button
                type="button"
                onClick={handleDisableReturnJourney}
                className={`rounded-none cursor-pointer border font-medium px-4 sm:px-6 flex-1 sm:flex-none ${
                  !hasReturnJourney
                    ? 'border-gray-400 bg-gray-500 text-white hover:bg-gray-600'
                    : 'border-gray-400 text-gray-600 bg-transparent hover:text-white hover:bg-gray-500'
                }`}
              >
                No
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 mt-4 px-4 sm:px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Promo Code</h2>
          </div>
          <div className="p-4 sm:p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    name="promoCode"
                    type="text"
                    placeholder="Enter Promo Code"
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    required
                  />
                </div>

                <Button type='button' variant={"primary"} className='border border-[#AE9404] text-[#AE9404] rounded-none hover:text-white hover:bg-[#AE9404]'>Apply Promo Code</Button>
              </div>
            </form>
          </div>
          <div className="bg-gray-100 mt-4 px-4 sm:px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Pricing</h2>
          </div>
          <div>
            <div className="bg-gray-50 flex justify-between mt-4 px-4 sm:px-12 py-1 border-b border-gray-100">
              <p className='font-semibold text-gray-500'>Base Fare</p>
              <p className='font-semibold text-gray-500'>$6719.39</p>
            </div>
          </div>
          <div>
            <div className="bg-slate-800 rounded flex justify-between mt-4 px-4 sm:px-12 py-4 border-b border-gray-100">
              <p className='text-xl font-semibold text-gray-400'>Total</p>
              <p className='text-xl font-semibold text-gray-400'>$6719.39</p>
            </div>
          </div>
          <Button
            type="submit"
            className={`w-full mt-4 bg-[#AE9409] hover:bg-[#8B7507] cursor-pointer rounded-none text-white font-medium py-3 px-6 transition-all duration-200 hover:shadow-lg transform
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
          console.log('Return journey saved');
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
