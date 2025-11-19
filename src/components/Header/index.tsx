'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Car, Menu, X, User, MapPin, Phone, Clock, LogIn, UserPlus, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Book Ride', href: '/ride' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header
        className={`fixed top-0 left-0 right-0 border-b z-50 transition-all duration-300 bg-white ${
            isScrolled
            ? 'shadow-lg py-3'
            : 'py-4'
        }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-linear-to-r from-yellow-500 to-orange-600 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                <Car className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Cabsy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.href)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                    }`}
                >
                    {link.name}
                </Link>
                ))}
            </nav>

            {/* User Menu - Always visible */}
            <div className="flex items-center gap-2">
              <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full cursor-pointer h-11 w-11 p-0 border-2 border-orange-400 bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {status === 'authenticated' && session?.user?.name ? (
                      <span className="text-orange-600 font-bold text-lg">
                        {session.user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="h-6 w-6 text-orange-600" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="flex flex-col">
                    <Link
                      href="/ride"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100"
                    >
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <MapPin className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Book Now</span>
                        <span className="text-xs text-gray-500">Reserve your ride</span>
                      </div>
                    </Link>
                    
                    {status === 'authenticated' && session?.user && (
                      <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {session.user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {session.user.name}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-orange-600 flex-shrink-0" />
                            <span className="truncate">{session.user.email}</span>
                          </div>
                          {session.user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-orange-600 flex-shrink-0" />
                              <span>{session.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {status === 'authenticated' ? (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-gray-50 transition-colors text-left w-full"
                      >
                        <div className="bg-red-100 p-2 rounded-lg">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">Logout</span>
                          <span className="text-xs text-gray-500">Sign out of your account</span>
                        </div>
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <LogIn className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Login</span>
                            <span className="text-xs text-gray-500">Access your account</span>
                          </div>
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <UserPlus className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Register</span>
                            <span className="text-xs text-gray-500">Create new account</span>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mobile Menu Button */}
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden cursor-pointer p-2 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-0"
                  aria-label="Toggle menu"
              >
                  {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                  ) : (
                  <Menu className="h-6 w-6" />
                  )}
              </button>
            </div>
            </div>

            {/* Mobile Side Panel */}
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Side Panel */}
              <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}>
                  {/* Panel Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-0"
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Panel Content */}
                  <div className="overflow-y-auto h-[calc(100vh-80px)] flex flex-col justify-between">
                    <nav className="flex flex-col p-4 space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                            isActive(link.href)
                              ? 'text-orange-600 bg-orange-50'
                              : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Quick Info in Mobile */}
                    <div className="px-4 py-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-orange-600" />
                        <span>24/7 Support: 1-800-CABSY</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        <span>Available Round the Clock</span>
                      </div>
                    </div>
                  </div>
                </div>
            </>
        </div>
        </header>
    );
};

export default Header;