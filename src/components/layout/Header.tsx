import React from 'react';
import { Car, Phone, MapPin, Clock } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Cabsy</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#book" className="hover:text-blue-200 transition-colors">Book Now</a>
            <a href="#services" className="hover:text-blue-200 transition-colors">Services</a>
            <a href="#pricing" className="hover:text-blue-200 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-blue-200 transition-colors">Contact</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-6 h-6" />
              <h3 className="text-xl font-bold">Cabsy</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for comfortable and reliable cab bookings with advanced route planning.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Available across India</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Multi-Stop Booking</li>
              <li>Return Journey Planning</li>
              <li>Airport Transfers</li>
              <li>Outstation Trips</li>
              <li>Corporate Bookings</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Contact Support</li>
              <li>Track Booking</li>
              <li>Cancellation Policy</li>
              <li>Safety Guidelines</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 1800-CABSY-1</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Cabsy. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}