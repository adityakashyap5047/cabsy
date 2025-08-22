# Cabsy - Smart Cab Booking Platform

A modern, feature-rich cab booking platform built with Next.js 15, TypeScript, and Tailwind CSS. Cabsy provides advanced booking features including multiple stops, return journeys, and dynamic fare calculation.

## 🚀 Features

### Core Booking Features
- **Multiple Stops**: Add unlimited stops along your journey with custom waiting times
- **Return Journey Planning**: Book round trips with automatic discount application (15% off)
- **Custom Duration Settings**: Specify stay duration between forward and return journeys  
- **Dynamic Fare Calculation**: Real-time fare calculation based on distance, stops, and discounts
- **Stop-to-Stop Pricing**: Individual charges displayed for each stop

### User Experience
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Real-time Updates**: Live fare calculation as you modify your booking
- **Form Validation**: Comprehensive validation with helpful error messages
- **Booking Confirmation**: Detailed booking summary with all journey information

### Technical Features
- **Next.js 15**: Latest Next.js with Turbopack for fast development and builds
- **TypeScript**: Full type safety throughout the application
- **API Routes**: RESTful APIs for bookings, distance calculation, and payments
- **Mock Integrations**: Prepared structure for Google Maps, payment gateways
- **Scalable Architecture**: Component-based architecture ready for production

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with Turbopack
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Modern date utility library

### Backend Ready
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB Integration Ready** - Database schema and types defined
- **Payment Gateway Ready** - Razorpay/Stripe integration structure
- **Authentication Ready** - JWT/Clerk integration prepared

### External API Integrations (Ready)
- **Google Maps API** - Distance calculation and route optimization
- **Mapbox** - Alternative mapping service
- **Razorpay** - Payment processing
- **Stripe** - Alternative payment processor

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── bookings/  # Booking management
│   │   ├── distance/  # Distance calculation
│   │   └── payment/   # Payment processing
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/
│   ├── booking/       # Booking-related components
│   ├── layout/        # Header, footer components
│   └── ui/           # Reusable UI components
├── lib/
│   └── utils.ts      # Utility functions
└── types/
    └── booking.ts    # Type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cabsy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 API Endpoints

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings?id={bookingId}` - Get specific booking

### Distance Calculation
- `POST /api/distance` - Calculate route with multiple stops
- `GET /api/distance?from={origin}&to={destination}` - Simple distance lookup

### Payment Processing
- `POST /api/payment` - Process payment
- `GET /api/payment?paymentId={id}` - Check payment status

## 🎯 Booking Flow

1. **Enter Journey Details**
   - Pickup and destination locations
   - Add multiple stops with waiting times
   - Select departure date and time

2. **Configure Options**
   - Choose passenger count
   - Enable return journey (optional)
   - Set stay duration for return trips
   - Add special requirements

3. **Review & Confirm**
   - View detailed fare breakdown
   - See all journey information
   - Confirm booking details

4. **Payment & Confirmation**
   - Process secure payment
   - Receive booking confirmation
   - Get unique booking ID

## 💰 Pricing Structure

- **Base Fare**: ₹15 per kilometer
- **Stop Charges**: ₹25 per additional stop
- **Return Journey Discount**: 15% off total fare
- **Waiting Time**: Included (configurable per stop)

## 🔮 Future Enhancements

### Phase 1 (Ready for Implementation)
- [ ] Google Maps API integration for real distance calculation
- [ ] Razorpay payment gateway integration
- [ ] User authentication (Clerk/Auth0)
- [ ] SMS/Email notifications
- [ ] Real-time driver tracking

### Phase 2 (Planned)
- [ ] Driver management system
- [ ] Admin dashboard
- [ ] Booking history and management
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Corporate booking features

### Phase 3 (Advanced)
- [ ] Machine learning for demand prediction
- [ ] Dynamic pricing based on demand
- [ ] Carbon footprint tracking
- [ ] Integration with public transport
- [ ] Mobile app (React Native)

## 🛡️ Security Features

- Input validation and sanitization
- CORS protection
- Rate limiting ready
- Authentication middleware prepared
- Secure payment processing structure

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px) 
- Mobile (320px - 767px)

## 🎨 Design Principles

- **User-Centric**: Intuitive interface focused on ease of use
- **Accessibility**: WCAG compliant design elements
- **Performance**: Optimized for fast loading and smooth interactions
- **Scalability**: Component architecture supports future growth

## 📞 Support & Contact

For technical support or questions:
- Email: support@cabsy.com
- Phone: +91 1800-CABSY-1
- Available: 24/7

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons
- The open-source community

---

**Cabsy** - Your trusted partner for smart cab bookings with advanced route planning.
