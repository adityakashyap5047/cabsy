import { Car, Globe, Mail, Phone } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-linear-to-r from-yellow-500 to-orange-600 rounded-lg p-2 mr-3">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold">Cabsy</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted ride partner providing safe, reliable, and comfortable transportation services 24/7.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-linear-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">City Rides</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Airport Transfer</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Corporate Travel</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Long Distance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-yellow-400 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Cabsy. All rights reserved. Made with ❤️ for better journeys.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer