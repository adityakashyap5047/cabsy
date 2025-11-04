'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, PenBox, Plus, Trash2 } from 'lucide-react';

export interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface PassengerFormProps {
  guestData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  guestData,
  passengers,
  onPassengersChange
}) => {
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [editingPassengerId, setEditingPassengerId] = useState<number | null>(null);
  
  const [newPassenger, setNewPassenger] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [addPassengerErrors, setAddPassengerErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [editPassenger, setEditPassenger] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [editPassengerErrors, setEditPassengerErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const handleAddPassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassenger(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (addPassengerErrors[name as keyof typeof addPassengerErrors]) {
      setAddPassengerErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle changes for EDIT form
  const handleEditPassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPassenger(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (editPassengerErrors[name as keyof typeof editPassengerErrors]) {
      setEditPassengerErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate ADD passenger
  const validateAddPassenger = () => {
    const errors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    };

    if (!newPassenger.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!newPassenger.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (newPassenger.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(newPassenger.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (newPassenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPassenger.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setAddPassengerErrors(errors);
    return !errors.firstName && !errors.lastName && !errors.phoneNumber && !errors.email;
  };

  // Validate EDIT passenger
  const validateEditPassenger = () => {
    const errors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    };

    if (!editPassenger.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!editPassenger.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (editPassenger.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(editPassenger.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (editPassenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editPassenger.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setEditPassengerErrors(errors);
    return !errors.firstName && !errors.lastName && !errors.phoneNumber && !errors.email;
  };

  const handleAddPassenger = () => {
    if (validateAddPassenger()) {
      const passenger = {
        id: Date.now(),
        ...newPassenger
      };
      onPassengersChange([...passengers, passenger]);
      setShowAddPassenger(false);
      setNewPassenger({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      });
      setAddPassengerErrors({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      });
    }
  };

  const handleRemovePassenger = (id: number) => {
    onPassengersChange(passengers.filter(p => p.id !== id));
  };

  const handleEditPassengerClick = (passenger: Passenger) => {
    setEditingPassengerId(passenger.id);
    setEditPassenger({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      phoneNumber: passenger.phoneNumber,
      email: passenger.email
    });
    setEditPassengerErrors({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });
  };

  const handleUpdatePassenger = () => {
    if (validateEditPassenger() && editingPassengerId !== null) {
      onPassengersChange(
        passengers.map(p =>
          p.id === editingPassengerId
            ? { ...p, ...editPassenger }
            : p
        )
      );
      setEditingPassengerId(null);
      setEditPassenger({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      });
      setEditPassengerErrors({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPassengerId(null);
    setEditPassenger({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });
    setEditPassengerErrors({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });
  };

  return (
    <div className="p-6">
      {/* Main Guest Display */}
      <div className="group flex justify-between items-start mb-4">
        <div>
          <p className="font-medium text-gray-800">
            {guestData.firstName} {guestData.lastName}
          </p>
          {guestData.phoneNumber && (
            <p className="text-sm font-semibold text-gray-400">{guestData.phoneNumber}</p>
          )}
          {guestData.email && (
            <p className="text-sm font-semibold text-gray-400">{guestData.email}</p>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant={"primary"}
            className="hover:text-[#AE9409]"
          >
            <PenBox />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Add Passenger Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant={"primary"}
            className="flex gap-2 ml-4 cursor-pointer items-center font-semibold text-xs transition-all duration-300 transform hover:scale-105 text-[#AE9409]"
            onClick={() => setShowAddPassenger(!showAddPassenger)}
          >
            <div className={`transition-transform duration-300 ${showAddPassenger ? 'rotate-180' : 'rotate-0'}`}>
              {showAddPassenger ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            <span className="hover:underline transition-all duration-200">
              Add Passenger
            </span>
          </Button>
        </div>

        {/* Add Passenger Form */}
        <div className={`overflow-hidden transition-all duration-900 ease-in-out ${
          showAddPassenger
            ? 'max-h-[600px] opacity-100 transform translate-y-0 scale-100'
            : 'max-h-0 opacity-0 transform -translate-y-6 scale-95'
        }`}>
          <div className={`p-4 space-y-4 transition-all duration-500 ease-in-out ${
            showAddPassenger
              ? 'transform translate-y-0 opacity-100'
              : 'transform -translate-y-4 opacity-0'
          }`}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="passenger-first-name" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <Input
                  id="passenger-first-name"
                  name="firstName"
                  placeholder="First Name"
                  value={newPassenger.firstName}
                  onChange={handleAddPassengerChange}
                  className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                    addPassengerErrors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                />
                {addPassengerErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{addPassengerErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="passenger-last-name" className="text-gray-700 font-medium">
                  Last Name
                </Label>
                <Input
                  id="passenger-last-name"
                  name="lastName"
                  placeholder="Last Name"
                  value={newPassenger.lastName}
                  onChange={handleAddPassengerChange}
                  className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                    addPassengerErrors.lastName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                  }`}
                />
                {addPassengerErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{addPassengerErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="passenger-phone" className="text-gray-700 font-medium">
                Phone Number (Optional)
              </Label>
              <Input
                id="passenger-phone"
                name="phoneNumber"
                placeholder="(555) 555-5555"
                value={newPassenger.phoneNumber}
                onChange={handleAddPassengerChange}
                className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                  addPassengerErrors.phoneNumber ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                }`}
              />
              <p className="text-xs text-gray-500">International must have preceding + sign and country code</p>
              {addPassengerErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{addPassengerErrors.phoneNumber}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="passenger-email" className="text-gray-700 font-medium">
                Email Address (Optional)
              </Label>
              <Input
                id="passenger-email"
                name="email"
                type="email"
                placeholder=""
                value={newPassenger.email}
                onChange={handleAddPassengerChange}
                className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                  addPassengerErrors.email ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                }`}
              />
              {addPassengerErrors.email && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{addPassengerErrors.email}</p>
              )}
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant={"primary"}
                onClick={handleAddPassenger}
                className="rounded-none cursor-pointer border border-[#AE9409] text-[#AE9409] hover:text-white hover:bg-[#AE9409] font-medium py-2 px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Passenger List */}
        {passengers.length > 0 && (
          <div className="space-y-3 mb-4">
            <div className="bg-gray-100 px-6 py-1 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Additional Passenger</h2>
            </div>
            {passengers.map((passenger) => (
              <div key={passenger.id} className="p-3 border-b">
                <div className="group flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                    {passenger.phoneNumber && (
                      <p className="text-sm font-semibold text-gray-400">{passenger.phoneNumber}</p>
                    )}
                    {passenger.email && (
                      <p className="text-sm font-semibold text-gray-400">{passenger.email}</p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant={"primary"}
                      className="hover:text-[#AE9409]"
                      onClick={() => handleEditPassengerClick(passenger)}
                    >
                      <PenBox />
                    </Button>
                    <Button
                      onClick={() => handleRemovePassenger(passenger.id)}
                      className="hover:text-[#AE9409] -ml-3"
                      variant={"primary"}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>

                {/* Inline Edit Form */}
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  editingPassengerId === passenger.id
                    ? 'max-h-[600px] opacity-100 transform translate-y-0 mt-4'
                    : 'max-h-0 opacity-0 transform -translate-y-4'
                }`}>
                  <div className="p-4 space-y-4 rounded transition-all duration-700 ease-in-out">
                    <div className="px-4 py-2">
                      <h3 className="text-md font-medium text-gray-800">Edit Passenger Information</h3>
                    </div>
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor={`edit-passenger-first-name-${passenger.id}`} className="text-gray-700 font-medium">
                            First Name
                          </Label>
                          <Input
                            id={`edit-passenger-first-name-${passenger.id}`}
                            name="firstName"
                            placeholder="First Name"
                            value={editPassenger.firstName}
                            onChange={handleEditPassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                              editPassengerErrors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                          />
                          {editPassengerErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{editPassengerErrors.firstName}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`edit-passenger-last-name-${passenger.id}`} className="text-gray-700 font-medium">
                            Last Name
                          </Label>
                          <Input
                            id={`edit-passenger-last-name-${passenger.id}`}
                            name="lastName"
                            placeholder="Last Name"
                            value={editPassenger.lastName}
                            onChange={handleEditPassengerChange}
                            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                              editPassengerErrors.lastName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                          />
                          {editPassengerErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{editPassengerErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <Label htmlFor={`edit-passenger-phone-${passenger.id}`} className="text-gray-700 font-medium">
                          Phone Number (Optional)
                        </Label>
                        <Input
                          id={`edit-passenger-phone-${passenger.id}`}
                          name="phoneNumber"
                          placeholder="(555) 555-5555"
                          value={editPassenger.phoneNumber}
                          onChange={handleEditPassengerChange}
                          className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                            editPassengerErrors.phoneNumber ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                          }`}
                        />
                        <p className="text-xs text-gray-500">International must have preceding + sign and country code</p>
                        {editPassengerErrors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1 animate-pulse">{editPassengerErrors.phoneNumber}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <Label htmlFor={`edit-passenger-email-${passenger.id}`} className="text-gray-700 font-medium">
                          Email Address (Optional)
                        </Label>
                        <Input
                          id={`edit-passenger-email-${passenger.id}`}
                          name="email"
                          type="email"
                          placeholder=""
                          value={editPassenger.email}
                          onChange={handleEditPassengerChange}
                          className={`w-full px-4 py-3 border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                            editPassengerErrors.email ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                          }`}
                        />
                        {editPassengerErrors.email && (
                          <p className="text-red-500 text-xs mt-1 animate-pulse">{editPassengerErrors.email}</p>
                        )}
                      </div>

                      {/* Update/Cancel Buttons */}
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded-none cursor-pointer border border-gray-400 text-gray-600 bg-transparent hover:text-white hover:bg-gray-500 font-medium py-2 px-6 transition-all duration-200 transform hover:scale-105"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleUpdatePassenger}
                          className="rounded-none cursor-pointer border border-[#AE9404] text-[#AE9404] hover:text-white hover:bg-[#AE9404] bg-transparent font-medium py-2 px-6 transition-all duration-200 transform hover:scale-105"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerForm;
