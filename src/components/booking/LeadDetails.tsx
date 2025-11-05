import { PenBox } from "lucide-react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState, useRef } from "react"

interface LeadDetailsProps {
  lead: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  onLeadUpdate?: (lead: { firstName: string; lastName: string; phoneNumber: string; email: string }) => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({lead, onLeadUpdate}) => {

    const [isEditing, setIsEditing] = useState(false);
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


    const handleEdit = () => {
        setIsEditing(true);
        setData({
            firstName: lead.firstName,
            lastName: lead.lastName,
            phoneNumber: lead.phoneNumber,
            email: lead.email
        });
        setErrors({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: ''
        });
    };

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const validateEditGuest = () => {
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

        if (!data.phoneNumber.trim() || (data.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(data.phoneNumber))) {
            validationErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!data.email.trim() || (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
            validationErrors.email = 'Please enter a valid email address';
        }

        setErrors(validationErrors);
        return {
            isValid: !validationErrors.firstName && !validationErrors.lastName && !validationErrors.phoneNumber && !validationErrors.email,
            errors: validationErrors
        };
    };

    const handleUpdateGuest = () => {
        const validation = validateEditGuest();
        
        if (validation.isValid && onLeadUpdate) {
            onLeadUpdate(data);
            setIsEditing(false);
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

    const handleCancelGuestEdit = () => {
        setIsEditing(false);
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
        <div className="px-6">
            <div className="group flex justify-between items-start">
            <div>
            <p className="font-medium text-gray-800">
                {lead.firstName} {lead.lastName}
            </p>
            {lead.phoneNumber && (
                <p className="text-sm font-semibold text-gray-400">{lead.phoneNumber}</p>
            )}
            {lead.email && (
                <p className="text-sm font-semibold text-gray-400">{lead.email}</p>
            )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
                variant={"ghost"}
                className="hover:text-[#AE9409] hover:bg-transparent p-0 m-0 cursor-pointer disabled:cursor-not-allowed disabled:text-[#AE9409]/50"
                onClick={handleEdit}
                disabled={isEditing}
            >
                <PenBox />
            </Button>
            </div>
        </div>
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
            isEditing
            ? 'max-h-[600px] opacity-100 transform translate-y-0 mb-4'
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}>
            <div className="p-4 space-y-4 rounded transition-all duration-700 ease-in-out">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h3 className="text-md font-medium text-gray-800">Edit Lead Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        First Name
                    </Label>
                    <Input
                        ref={firstNameRef}
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={data.firstName}
                        onChange={handleDataChange}
                        className={`w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all duration-200 ${
                        errors.firstName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-blue-500'
                        }`}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.firstName}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        Last Name
                    </Label>
                    <Input
                        ref={lastNameRef}
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={data.lastName}
                        onChange={handleDataChange}
                        className={`w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all duration-200 ${
                        errors.lastName ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-blue-500'
                        }`}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
                    Phone Number
                </Label>
                <Input
                    ref={phoneNumberRef}
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="(555) 555-5555"
                    value={data.phoneNumber}
                    onChange={handleDataChange}
                    className={`w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all duration-200 ${
                        errors.phoneNumber ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-blue-500'
                    }`}
                />
                <p className="text-xs text-gray-500">International must have preceding + sign and country code</p>
                {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.phoneNumber}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                </Label>
                <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder=""
                    value={data.email}
                    onChange={handleDataChange}
                    className={`w-full px-4 py-3 border focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all duration-200 ${
                        errors.email ? 'border-red-500 focus:border-red-500 shadow-red-200 shadow-md' : 'border-gray-300 focus:border-blue-500'
                    }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.email}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3">
                <Button
                    type="button"
                    onClick={handleCancelGuestEdit}
                    className="rounded-none cursor-pointer border border-gray-400 text-gray-600 bg-transparent hover:text-white hover:bg-gray-500 font-medium py-2 px-6 transition-all duration-200 transform hover:scale-105"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleUpdateGuest}
                    className="rounded-none cursor-pointer border border-[#AE9404] text-[#AE9404] hover:text-white hover:bg-[#AE9404] bg-transparent font-medium py-2 px-6 transition-all duration-200 transform hover:scale-105"
                >
                    Update
                </Button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default LeadDetails