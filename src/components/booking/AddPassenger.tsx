import { useRef, useState } from "react";
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Minus, Plus } from "lucide-react";

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
}

const AddPassenger: React.FC<PassengerFormProps> = ({ passengers, onPassengersChange }) => {
    
    const [showAddPassenger, setShowAddPassenger] = useState(false);
    const [newPassenger, setNewPassenger] = useState({
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
        setNewPassenger(prev => ({
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

        if (!newPassenger.firstName.trim()) {
            validationErrors.firstName = 'First name is required';
        }

        if (!newPassenger.lastName.trim()) {
            validationErrors.lastName = 'Last name is required';
        }
        if (newPassenger.phoneNumber) {
            const digitsOnly = newPassenger.phoneNumber.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                validationErrors.phoneNumber = 'Phone number must contain exactly 10 digits';
            }
        }
        if (newPassenger.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(newPassenger.phoneNumber)) {
            validationErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (newPassenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPassenger.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        setErrors(validationErrors);
        return {
            isValid: !validationErrors.firstName && !validationErrors.lastName && !validationErrors.phoneNumber && !validationErrors.email,
            errors: validationErrors
        };
    };

    const handleAddPassenger = () => {
        const validation = validatePassenger();
        if (validation.isValid) {
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

    return (
        <div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant={"primary"}
                    className="flex gap-2 ml-4 mb-4 cursor-pointer items-center font-semibold text-xs transition-all duration-300 transform hover:scale-105 text-[#AE9409]"
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

            <div className={`overflow-hidden transition-all duration-900 ease-in-out ${
                showAddPassenger
                    ? 'max-h-[600px] opacity-100 transform translate-y-0 scale-100'
                    : 'max-h-0 opacity-0 transform -translate-y-6 scale-95'
                }`}
            >
                <div className={`px-2 pb-2 sm:pb-4 transition-all duration-500 ease-in-out ${
                    showAddPassenger
                        ? 'transform translate-y-0 opacity-100'
                        : 'transform -translate-y-4 opacity-0'
                    }`}
                >
                    {/* Outer Div 1: First Name and Last Name */}
                    <div className="mb-3 sm:mb-4">
                        <div className="flex flex-col min-[420px]:flex-row min-[768px]:flex-col min-[960px]:flex-row min-[420px]:gap-4 min-[768px]:gap-0 min-[960px]:gap-4 min-[960px]:items-start">
                        <div className="flex-1 space-y-1 sm:space-y-2">
                            <Label htmlFor="passenger-first-name" className="text-gray-700 font-medium text-xs sm:text-sm">
                            First Name
                            </Label>
                            <Input
                            ref={firstNameRef}
                            id="passenger-first-name"
                            name="firstName"
                            placeholder="First Name"
                            value={newPassenger.firstName}
                            onChange={handleChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 transition-all duration-200 ${
                                errors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-yellow-500'
                            }`}
                            />
                            {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.firstName}</p>
                            )}
                        </div>

                        <div className="flex-1 space-y-1 sm:space-y-2 mt-3 min-[420px]:mt-0 min-[768px]:mt-3 min-[960px]:mt-0">
                            <Label htmlFor="passenger-last-name" className="text-gray-700 font-medium text-xs sm:text-sm">
                            Last Name
                            </Label>
                            <Input
                                ref={lastNameRef}
                            id="passenger-last-name"
                            name="lastName"
                            placeholder="Last Name"
                            value={newPassenger.lastName}
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
                    <div className="mb-3 sm:mb-4">
                        <div className="flex flex-col min-[420px]:flex-row min-[768px]:flex-col min-[960px]:flex-row min-[420px]:gap-4 min-[768px]:gap-0 min-[960px]:gap-4 min-[960px]:items-start">
                        <div className="flex-1 space-y-1 sm:space-y-2">
                            <Label htmlFor="passenger-phone" className="text-gray-700 font-medium text-xs sm:text-sm">
                                Phone Number
                            </Label>
                            <Input
                            ref={phoneNumberRef}
                                id="passenger-phone"
                                name="phoneNumber"
                                placeholder="(555) 555-5555"
                                value={newPassenger.phoneNumber}
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

                        <div className="flex-1 space-y-1 sm:space-y-2 mt-3 min-[420px]:mt-0 min-[768px]:mt-3 min-[960px]:mt-0">
                            <Label htmlFor="passenger-email" className="text-gray-700 font-medium text-xs sm:text-sm">
                                Email Address
                            </Label>
                            <Input
                                ref={emailRef}
                                id="passenger-email"
                                name="email"
                                type="email"
                                placeholder=""
                                value={newPassenger.email}
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

                    {/* Add Button */}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant={"primary"}
                            onClick={handleAddPassenger}
                            className="rounded-none cursor-pointer border border-[#AE9409] text-[#AE9409] hover:text-white hover:bg-[#AE9409] font-medium text-xs sm:text-sm py-2 px-8! sm:px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPassenger