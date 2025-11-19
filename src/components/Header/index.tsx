'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X, User, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

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
        { name: 'Services', href: '/services' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
            ? 'bg-white shadow-lg py-3'
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-linear-to-r from-yellow-500 to-orange-600 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                <Car className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Cabsy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
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

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
                <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                asChild
                >
                <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                </Link>
                </Button>
                <Button
                className="bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
                >
                <Link href="/ride">
                    <MapPin className="h-4 w-4 mr-2" />
                    Book Now
                </Link>
                </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
                ) : (
                <Menu className="h-6 w-6" />
                )}
            </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2 mt-4">
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

                <div className="flex flex-col space-y-3 mt-4">
                <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    asChild
                >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Login
                    </Link>
                </Button>
                <Button
                    className="w-full bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg shadow-lg"
                    asChild
                >
                    <Link href="/ride" onClick={() => setIsMobileMenuOpen(false)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Book Now
                    </Link>
                </Button>
                </div>

                {/* Quick Info in Mobile */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
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
            )}
        </div>
        </header>
    );
};

export default Header;