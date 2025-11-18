'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenBox, Trash2 } from 'lucide-react';

export interface Passenger {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

interface PassengerFormProps {
    passengers: Passenger[];
    onPassengersChange: (passengers: Passenger[]) => void;
    isReturnJourney?: boolean;
}

const EditPassenger: React.FC<PassengerFormProps> = ({
    passengers,
    onPassengersChange,
    isReturnJourney = false,
}) => {
    const [passengerId, setPassengerId] = useState<number | null>(null);  

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
        ...prev,
        [name]: value
        }));
        if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        }
    };

    const validatePassenger = () => {
        const validationErrors = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
        };

        if (!data.firstName.trim()) {
            validationErrors.firstName = 'First name is required';
        }

        if (!data.lastName.trim()) {
            validationErrors.lastName = 'Last name is required';
        }

        if (data.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(data.phoneNumber)) {
            validationErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        setErrors(validationErrors);
        return {
            isValid: !validationErrors.firstName && !validationErrors.lastName && !validationErrors.phoneNumber && !validationErrors.email,
            errors: validationErrors
        };
    };

    const handleRemovePassenger = (id: number) => {
        onPassengersChange(passengers.filter(p => p.id !== id));
    };

    const handleEditPassengerClick = (passenger: Passenger) => {
        setPassengerId(passenger.id);
        setData({
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            phoneNumber: passenger.phoneNumber,
            email: passenger.email
        });
        setErrors({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
        });
    };

    const handleUpdatePassenger = () => {
        const validation = validatePassenger();
        if (validation.isValid && passengerId !== null) {
            onPassengersChange(
                passengers.map(p =>
                p.id === passengerId
                    ? { ...p, ...data }
                    : p
                )
            );
            setPassengerId(null);
            setData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: ''
            });
            setErrors({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: ''
            });
        } else {
            if (validation.errors.firstName && firstNameRef.current) {
                firstNameRef.current.focus();
            } else if (validation.errors.lastName && lastNameRef.current) {
                lastNameRef.current.focus();
            } else if (validation.errors.phoneNumber && phoneNumberRef.current) {
                phoneNumberRef.current.focus();
            } else if (validation.errors.email && emailRef.current) {
                emailRef.current.focus();
            }
        }
    };

    const handleCancelEdit = () => {
        setPassengerId(null);
        setData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
        });
        setErrors({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
        });
    };

    return (
        <div>
            <div className="space-y-3 sm:space-y-4">
                {passengers.length > 0 && (
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
                            <h2 className="text-base sm:text-lg font-medium text-gray-800">Additional Passenger</h2>
                        </div>
                        {passengers.map((passenger) => (
                            <div key={passenger.id} className="p-2 border-b">
                                <div className="group flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                                            {passenger.firstName} {passenger.lastName}
                                        </p>
                                        {passenger.phoneNumber && (
                                            <p className="text-xs sm:text-sm font-semibold text-gray-400">{passenger.phoneNumber}</p>
                                        )}
                                        {passenger.email && (
                                            <p className="text-xs sm:text-sm font-semibold text-gray-400">{passenger.email}</p>
                                        )}
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

                                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                                    passengerId === passenger.id
                                        ? 'max-h-[600px] opacity-100 transform translate-y-0 mt-3 sm:mt-4'
                                        : 'max-h-0 opacity-0 transform -translate-y-4'
                                    }`}
                                >
                                    <div className="pb-4 transition-all duration-700 ease-in-out">
                                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                            <h3 className="text-sm sm:text-base font-medium text-gray-800">Edit Passenger Info</h3>
                                        </div>

                                        {/* Outer Div 1: First Name and Last Name */}
                                        <div className="px-2 my-2">
                                            <div className={`flex flex-col ${!isReturnJourney ? 'min-[420px]:flex-row min-[768px]:flex-col min-[960px]:flex-row min-[420px]:gap-4 min-[768px]:gap-0 min-[960px]:gap-4 min-[960px]:items-start' : ''}`}>
                                            <div className="flex-1 space-y-1 sm:space-y-2">
                                                <Label htmlFor={`firstName-${passenger.id}`} className="text-gray-700 font-medium text-xs sm:text-sm">
                                                    First Name
                                                </Label>
                                                <Input
                                                    ref={firstNameRef}
                                                    id={`firstName-${passenger.id}`}
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    value={data.firstName}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                                    errors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                                                    }`}
                                                />
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.firstName}</p>
                                                )}
                                            </div>

                                            <div className={`flex-1 space-y-1 sm:space-y-2 ${isReturnJourney ? 'mt-3' : 'mt-3 min-[420px]:mt-0 min-[768px]:mt-3 min-[960px]:mt-0'}`}>
                                            <Label htmlFor={`lastName-${passenger.id}`} className="text-gray-700 font-medium text-xs sm:text-sm">
                                                Last Name
                                            </Label>
                                            <Input
                                                ref={lastNameRef}
                                                id={`lastName-${passenger.id}`}
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={data.lastName}
                                                onChange={handleChange}
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                                errors.lastName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                                                }`}
                                            />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.lastName}</p>
                                            )}
                                            </div>
                                            </div>
                                        </div>

                                        {/* Outer Div 2: Phone Number and Email Address */}
                                        <div className="px-2 mb-4">
                                            <div className={`flex flex-col ${!isReturnJourney ? 'min-[420px]:flex-row min-[768px]:flex-col min-[960px]:flex-row min-[420px]:gap-4 min-[768px]:gap-0 min-[960px]:gap-4 min-[960px]:items-start' : ''}`}>
                                            <div className="flex-1 space-y-1 sm:space-y-2">
                                                <Label htmlFor={`phoneNumber-${passenger.id}`} className="text-gray-700 font-medium text-xs sm:text-sm">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    ref={phoneNumberRef}
                                                    id={`phoneNumber-${passenger.id}`}
                                                    name="phoneNumber"
                                                    placeholder="(555) 555-5555"
                                                    value={data.phoneNumber}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                                        errors.phoneNumber ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                                                    }`}
                                                />
                                                <p className="text-xs text-gray-500">International must have preceding + sign and country code</p>
                                                {errors.phoneNumber && (
                                                    <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.phoneNumber}</p>
                                                )}
                                            </div>

                                            <div className={`flex-1 space-y-1 sm:space-y-2 ${isReturnJourney ? 'mt-3' : 'mt-3 min-[420px]:mt-0 min-[768px]:mt-3 min-[960px]:mt-0'}`}>
                                                <Label htmlFor={`email-${passenger.id}`} className="text-gray-700 font-medium text-xs sm:text-sm">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    ref={emailRef}
                                                    id={`email-${passenger.id}`}
                                                    name="email"
                                                    type="email"
                                                    placeholder=""
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                                    errors.email ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                                                }`}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.email}</p>
                                            )}
                                            </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-2 sm:space-x-3">
                                            <Button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="rounded-none cursor-pointer border border-gray-400 text-gray-600 bg-transparent hover:text-white hover:bg-gray-500 font-medium text-xs sm:text-sm py-2 px-4 sm:px-6 transition-all duration-200 transform hover:scale-105"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleUpdatePassenger}
                                                className="rounded-none cursor-pointer border border-[#AE9404] text-[#AE9404] hover:text-white hover:bg-[#AE9404] bg-transparent font-medium text-xs sm:text-sm py-2 px-4 sm:px-6 transition-all duration-200 transform hover:scale-105"
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

export default EditPassenger;
