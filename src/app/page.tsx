'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  Car, 
  Phone, 
  CheckCircle,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      image: "👩‍💼",
      text: "Cabsy has transformed my daily commute. Professional drivers, clean vehicles, and always on time!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Frequent Traveler",
      image: "👨‍💻",
      text: "I've used many ride services, but Cabsy's reliability and customer service is unmatched.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mother",
      image: "👩‍🍳",
      text: "Safe, comfortable rides for my family. The app is so easy to use, even for school runs!",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Airport Commuter",
      image: "✈️",
      text: "Never missed a flight thanks to Cabsy's punctual service. Highly recommended!",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Secure",
      description: "Background-checked drivers and GPS tracking for your safety"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Always On Time",
      description: "Punctual service with real-time tracking and ETA updates"
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Premium Fleet",
      description: "Clean, comfortable vehicles maintained to highest standards"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100K+", label: "Rides Completed" },
    { number: "500+", label: "Professional Drivers" },
    { number: "4.9", label: "Average Rating" }
  ];

  const handleBookNow = () => {
    router.push('/ride');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-gray-900 via-gray-800 to-yellow-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Ride,
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500"> Redefined</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
                Experience premium cab service with professional drivers, luxury vehicles, and unmatched reliability. Book your ride in seconds.
              </p>
              
              {/* Quick Booking Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-md p-6 mb-8 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <span className="absolute left-10 top-3.5 transform -translate-y-1/2 h-5 text-gray-400">Pickup location</span>
                    <Input
                      className="pl-10 py-3 bg-white/20 border-white/30 text-white placeholder-gray-300"
                      disabled
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <span className="absolute left-10 top-3.5 transform -translate-y-1/2 h-5 text-gray-400">Drop-off location</span>
                    <Input
                      className="pl-10 py-3 bg-white/20 border-white/30 text-white placeholder-gray-300"
                      disabled
                    />
                  </div>
                </div>
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-md transform hover:scale-102 transition-all duration-300 shadow-lg"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Book Your Ride Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {['👨‍💼', '👩‍💻', '👨‍🎓', '👩‍⚕️'].map((emoji, index) => (
                      <div key={index} className="w-10 h-10 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-lg border-2 border-white">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm">50,000+ Happy Customers</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">4.9/5</span>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                <div className="bg-linear-to-r from-yellow-400/20 to-orange-500/20 rounded-md p-8 backdrop-blur-sm border border-white/20">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
                      <Car className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Premium Experience</h3>
                    <p className="text-gray-200 mb-6">
                      Professional chauffeurs, luxury vehicles, and personalized service for every journey.
                    </p>
                    <Button variant="outline" className="border-white/30 text-slate-800 hover:bg-white/10 rounded-sm!">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-orange-600">Cabsy?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re not just another ride service. We&apos;re your trusted travel partner committed to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-8 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white shadow-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-500 to-orange-600 rounded-full text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-linear-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What Our <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-300">Real stories from real people who trust Cabsy</p>
          </div>

          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 transition-all duration-300 hover:scale-110 cursor-pointer rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="overflow-hidden rounded-md bg-white/10 backdrop-blur-md border border-white/20">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full shrink-0 p-12">
                    <div className="max-w-4xl mx-auto text-center">
                      <div className="text-6xl mb-6">{testimonial.image}</div>
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-2xl lg:text-3xl font-light italic mb-8 text-gray-200 leading-relaxed">
                        &ldquo;{testimonial.text}&rdquo;
                      </blockquote>
                      <div>
                        <div className="font-bold text-xl text-white">{testimonial.name}</div>
                        <div className="text-gray-300">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 cursor-pointer rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-linear-to-r from-yellow-400 to-orange-500 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-yellow-500 via-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Ready for Your Next Journey?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed">
              Join thousands of satisfied customers who choose Cabsy for their daily commute and special occasions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                onClick={handleBookNow}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-md transform hover:scale-105 transition-all duration-300 shadow-xl text-lg"
              >
                <Car className="mr-3 h-6 w-6" />
                Book Your Ride Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <div className="flex items-center text-white">
                <Phone className="h-6 w-6 mr-3" />
                <span className="font-semibold text-lg">Call: +1 (800) CABSY-24</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <span>Professional Drivers</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;