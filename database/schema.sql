// Cabsy Ride Booking Platform - MongoDB Schema
// Comprehensive NoSQL database design for a modern cab booking system

// ============================================================================
// USERS COLLECTION
// ============================================================================

// Users collection (customers, drivers, and admins)
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "accountStatus": 1 });

// Sample user document structure
const userSchema = {
  _id: ObjectId(),
  email: "user@example.com",
  phone: "+1234567890",
  passwordHash: "hashed_password",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: ISODate("1990-01-01"),
  gender: "male", // "male", "female", "other", "prefer_not_to_say"
  profilePictureUrl: "https://example.com/avatar.jpg",
  userType: "customer", // "customer", "driver", "admin"
  accountStatus: "active", // "active", "suspended", "deactivated", "pending_verification"
  emailVerified: true,
  phoneVerified: true,
  
  // Customer-specific fields (when userType is "customer")
  customerProfile: {
    preferredPaymentMethod: "credit_card",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1234567891"
    },
    loyaltyPoints: 150,
    totalRides: 25,
    totalSpent: 750.50,
    averageRating: 4.8,
    preferredVehicleType: "premium",
    accessibilityNeeds: "wheelchair_accessible",
    marketingConsent: false,
    savedAddresses: [
      {
        label: "Home",
        address: "123 Main St, City, State",
        coordinates: {
          type: "Point",
          coordinates: [-74.006, 40.7128] // [longitude, latitude]
        }
      },
      {
        label: "Work",
        address: "456 Business Ave, City, State",
        coordinates: {
          type: "Point",
          coordinates: [-74.010, 40.7150]
        }
      }
    ]
  },
  
  // Driver-specific fields (when userType is "driver")
  driverProfile: {
    licenseNumber: "DL123456789",
    licenseExpiryDate: ISODate("2025-12-31"),
    licenseVerified: true,
    backgroundCheck: {
      status: "approved", // "pending", "approved", "rejected", "expired"
      date: ISODate("2024-01-15"),
      expiryDate: ISODate("2025-01-15")
    },
    driverStatus: "online", // "online", "offline", "busy", "on_break"
    currentLocation: {
      type: "Point",
      coordinates: [-74.006, 40.7128]
    },
    lastLocationUpdate: ISODate(),
    totalTrips: 150,
    totalEarnings: 4500.75,
    averageRating: 4.9,
    completionRate: 98.5,
    acceptanceRate: 92.0,
    onboardingCompleted: true,
    documents: {
      license: "https://example.com/license.jpg",
      insurance: "https://example.com/insurance.pdf",
      backgroundCheck: "https://example.com/background.pdf"
    },
    workingHours: {
      monday: { start: "06:00", end: "22:00", active: true },
      tuesday: { start: "06:00", end: "22:00", active: true },
      // ... other days
    }
  },
  
  // Common timestamps
  createdAt: ISODate(),
  updatedAt: ISODate(),
  lastLoginAt: ISODate()
};

// ============================================================================
// VEHICLES COLLECTION
// ============================================================================

db.vehicles.createIndex({ "driverId": 1 });
db.vehicles.createIndex({ "licensePlate": 1 }, { unique: true });
db.vehicles.createIndex({ "status": 1 });
db.vehicles.createIndex({ "category": 1 });

const vehicleSchema = {
  _id: ObjectId(),
  driverId: ObjectId(), // Reference to users collection
  category: {
    name: "premium", // "economy", "premium", "luxury", "suv", "eco"
    displayName: "Premium Sedan",
    baseFare: 4.00,
    perKmRate: 1.80,
    perMinuteRate: 0.25,
    capacity: 4,
    features: ["air_conditioning", "wifi", "phone_charger"],
    iconUrl: "https://example.com/premium-icon.png"
  },
  make: "Toyota",
  model: "Camry",
  year: 2022,
  color: "Black",
  licensePlate: "ABC123",
  vin: "1HGBH41JXMN109186",
  registrationNumber: "REG123456",
  insurance: {
    policyNumber: "INS789456",
    provider: "State Farm",
    expiryDate: ISODate("2025-06-30")
  },
  inspection: {
    date: ISODate("2024-08-01"),
    expiryDate: ISODate("2025-08-01"),
    status: "passed"
  },
  status: "active", // "active", "inactive", "maintenance", "suspended"
  verificationStatus: "approved", // "pending", "approved", "rejected"
  photos: [
    "https://example.com/vehicle-front.jpg",
    "https://example.com/vehicle-side.jpg",
    "https://example.com/vehicle-interior.jpg"
  ],
  documents: [
    {
      type: "registration",
      url: "https://example.com/registration.pdf",
      uploadedAt: ISODate()
    },
    {
      type: "insurance",
      url: "https://example.com/insurance.pdf",
      uploadedAt: ISODate()
    }
  ],
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// BOOKINGS COLLECTION
// ============================================================================

db.bookings.createIndex({ "customerId": 1 });
db.bookings.createIndex({ "driverId": 1 });
db.bookings.createIndex({ "status": 1 });
db.bookings.createIndex({ "paymentStatus": 1 });
db.bookings.createIndex({ "bookingTime": -1 });
db.bookings.createIndex({ "pickup.location": "2dsphere" });
db.bookings.createIndex({ "dropoff.location": "2dsphere" });
db.bookings.createIndex({ "scheduledTime": 1 });

const bookingSchema = {
  _id: ObjectId(),
  bookingNumber: "CB-2024-001234", // Human readable booking number
  customerId: ObjectId(),
  driverId: ObjectId(), // null when no driver assigned
  vehicleId: ObjectId(),
  
  // Trip details
  pickup: {
    address: "123 Main St, New York, NY 10001",
    coordinates: {
      type: "Point",
      coordinates: [-74.006, 40.7128]
    },
    landmark: "Near Central Park",
    contactPerson: {
      name: "John Doe",
      phone: "+1234567890"
    }
  },
  
  dropoff: {
    address: "JFK Airport, Queens, NY 11430",
    coordinates: {
      type: "Point",
      coordinates: [-73.7781, 40.6413]
    },
    landmark: "Terminal 4, Delta Airlines",
    contactPerson: {
      name: "John Doe",
      phone: "+1234567890"
    }
  },
  
  // Additional stops for multi-destination trips
  stops: [
    {
      order: 1,
      address: "456 Stop Street, New York, NY",
      coordinates: {
        type: "Point",
        coordinates: [-73.9857, 40.7484]
      },
      landmark: "Times Square",
      waitTime: 5 // minutes
    }
  ],
  
  // Vehicle and ride details
  vehicleCategory: "premium",
  passengerCount: 2,
  specialInstructions: "Please call upon arrival",
  accessibility: {
    wheelchairAccessible: false,
    childSeat: true,
    petFriendly: false
  },
  
  // Trip metrics
  distance: {
    estimated: 25.5, // kilometers
    actual: 26.2
  },
  duration: {
    estimated: 35, // minutes
    actual: 38
  },
  
  // Pricing breakdown
  fare: {
    baseFare: 4.00,
    distanceFare: 47.16, // 26.2 km * 1.80
    timeFare: 9.50, // 38 min * 0.25
    surgeMultiplier: 1.2,
    subtotal: 72.79,
    discount: {
      code: "FIRST20",
      amount: 14.56,
      type: "percentage"
    },
    tax: 5.82,
    tip: 10.00,
    total: 74.05
  },
  
  // Status tracking
  status: "completed", // "pending", "confirmed", "driver_assigned", "driver_arrived", "in_progress", "completed", "cancelled"
  paymentStatus: "completed", // "pending", "processing", "completed", "failed", "refunded"
  
  // Scheduling
  isScheduled: false,
  scheduledTime: null, // ISODate() if scheduled
  
  // Timestamps
  bookingTime: ISODate(),
  confirmedAt: ISODate(),
  driverAssignedAt: ISODate(),
  driverArrivedAt: ISODate(),
  tripStartedAt: ISODate(),
  tripCompletedAt: ISODate(),
  cancelledAt: null,
  cancellation: {
    cancelledBy: null, // ObjectId of user who cancelled
    reason: null,
    fee: 0
  },
  
  // Real-time tracking
  tracking: [
    {
      timestamp: ISODate(),
      driverLocation: {
        type: "Point",
        coordinates: [-74.006, 40.7128]
      },
      heading: 45, // degrees
      speed: 25 // km/h
    }
  ],
  
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// PAYMENTS COLLECTION
// ============================================================================

db.payments.createIndex({ "bookingId": 1 });
db.payments.createIndex({ "customerId": 1 });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "provider": 1 });
db.payments.createIndex({ "providerTransactionId": 1 });

const paymentSchema = {
  _id: ObjectId(),
  bookingId: ObjectId(),
  customerId: ObjectId(),
  
  // Payment details
  amount: 74.05,
  currency: "USD",
  type: "ride_fare", // "ride_fare", "tip", "cancellation_fee", "refund"
  
  // Payment method
  paymentMethod: {
    type: "credit_card", // "credit_card", "debit_card", "digital_wallet", "cash"
    provider: "stripe",
    methodId: "pm_1234567890", // Stripe payment method ID
    card: {
      lastFour: "4242",
      brand: "visa",
      expMonth: 12,
      expYear: 2025
    }
  },
  
  // External provider details
  provider: "stripe",
  providerTransactionId: "pi_1234567890",
  providerPaymentIntentId: "pi_1234567890",
  
  // Status and processing
  status: "completed", // "pending", "processing", "completed", "failed", "cancelled", "refunded"
  
  // Failure handling
  failure: {
    code: null,
    message: null,
    timestamp: null
  },
  
  // Refund information
  refund: {
    amount: 0,
    reason: null,
    processedAt: null,
    refundId: null
  },
  
  // Metadata
  metadata: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    sessionId: "sess_1234567890"
  },
  
  // Timestamps
  processedAt: ISODate(),
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// RATINGS COLLECTION
// ============================================================================

db.ratings.createIndex({ "bookingId": 1 });
db.ratings.createIndex({ "raterId": 1 });
db.ratings.createIndex({ "ratedId": 1 });
db.ratings.createIndex({ "type": 1 });

const ratingSchema = {
  _id: ObjectId(),
  bookingId: ObjectId(),
  raterId: ObjectId(), // Who is giving the rating
  ratedId: ObjectId(), // Who is being rated
  type: "customer_to_driver", // "customer_to_driver", "driver_to_customer"
  
  rating: 5, // 1-5 stars
  review: "Excellent service! Very professional driver.",
  
  // Predefined tags for quick feedback
  tags: ["punctual", "clean_vehicle", "safe_driving", "friendly"],
  
  // Detailed breakdown
  breakdown: {
    punctuality: 5,
    cleanliness: 5,
    communication: 5,
    safety: 5,
    overall: 5
  },
  
  // Response from rated party
  response: {
    message: "Thank you for the feedback!",
    respondedAt: ISODate()
  },
  
  createdAt: ISODate()
};

// ============================================================================
// NOTIFICATIONS COLLECTION
// ============================================================================

db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "createdAt": -1 });

const notificationSchema = {
  _id: ObjectId(),
  userId: ObjectId(),
  type: "booking_confirmed", // "booking_confirmed", "driver_assigned", "trip_started", etc.
  
  title: "Booking Confirmed",
  message: "Your ride has been confirmed for 2:30 PM today.",
  
  // Rich notification data
  data: {
    bookingId: ObjectId(),
    driverName: "John Smith",
    vehicleInfo: "Black Toyota Camry - ABC123",
    estimatedArrival: ISODate()
  },
  
  // Delivery channels
  channels: {
    inApp: {
      sent: true,
      sentAt: ISODate(),
      read: false,
      readAt: null
    },
    push: {
      sent: true,
      sentAt: ISODate(),
      deviceTokens: ["token1", "token2"]
    },
    sms: {
      sent: false,
      reason: "user_preference"
    },
    email: {
      sent: true,
      sentAt: ISODate(),
      emailId: "email_123456"
    }
  },
  
  // Priority and scheduling
  priority: "high", // "low", "medium", "high", "urgent"
  scheduledFor: null, // ISODate() if scheduled
  
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// PROMOTIONS COLLECTION
// ============================================================================

db.promotions.createIndex({ "code": 1 }, { unique: true });
db.promotions.createIndex({ "isActive": 1 });
db.promotions.createIndex({ "validFrom": 1, "validUntil": 1 });

const promotionSchema = {
  _id: ObjectId(),
  code: "FIRST20",
  title: "20% Off Your First Ride",
  description: "Get 20% discount on your first booking with us!",
  
  // Discount configuration
  discount: {
    type: "percentage", // "percentage", "fixed_amount", "free_ride"
    value: 20,
    maxAmount: 50.00, // Maximum discount amount
    minRideAmount: 10.00 // Minimum ride amount to apply
  },
  
  // Usage limits
  usage: {
    totalLimit: 1000, // Total uses allowed
    currentCount: 45, // Current usage count
    userLimit: 1, // Uses per user
    userUsage: {} // { userId: count }
  },
  
  // Validity
  isActive: true,
  validFrom: ISODate("2024-01-01"),
  validUntil: ISODate("2024-12-31"),
  
  // Applicability rules
  applicableTo: {
    vehicleCategories: ["economy", "premium"],
    cities: ["New York", "Los Angeles"],
    userTypes: ["new_customer"],
    firstRideOnly: true
  },
  
  // Campaign tracking
  campaign: {
    name: "New User Acquisition Q1",
    source: "google_ads",
    medium: "cpc"
  },
  
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// SUPPORT TICKETS COLLECTION
// ============================================================================

db.supportTickets.createIndex({ "userId": 1 });
db.supportTickets.createIndex({ "status": 1 });
db.supportTickets.createIndex({ "category": 1 });
db.supportTickets.createIndex({ "priority": 1 });

const supportTicketSchema = {
  _id: ObjectId(),
  ticketNumber: "TKT-2024-001234",
  userId: ObjectId(),
  bookingId: ObjectId(), // null if not ride-related
  
  // Ticket details
  category: "payment_issue", // "payment_issue", "driver_complaint", "technical_issue", "general_inquiry"
  priority: "medium", // "low", "medium", "high", "urgent"
  status: "open", // "open", "in_progress", "waiting_customer", "resolved", "closed"
  
  subject: "Payment not processed correctly",
  description: "I was charged twice for the same ride...",
  
  // Assignment
  assignedTo: {
    agentId: ObjectId(),
    agentName: "Sarah Johnson",
    assignedAt: ISODate()
  },
  
  // Conversation
  messages: [
    {
      id: ObjectId(),
      senderId: ObjectId(),
      senderType: "customer", // "customer", "agent", "system"
      message: "I was charged twice for the same ride.",
      attachments: [
        {
          filename: "receipt.jpg",
          url: "https://example.com/receipt.jpg",
          size: 1024000
        }
      ],
      timestamp: ISODate()
    }
  ],
  
  // Resolution
  resolution: {
    resolvedBy: null,
    resolvedAt: null,
    resolution: null,
    customerSatisfaction: null // 1-5 rating
  },
  
  // Metrics
  metrics: {
    firstResponseTime: null, // minutes
    resolutionTime: null, // minutes
    totalMessages: 1
  },
  
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// ANALYTICS COLLECTION
// ============================================================================

db.analytics.createIndex({ "type": 1, "date": -1 });
db.analytics.createIndex({ "driverId": 1, "date": -1 });
db.analytics.createIndex({ "city": 1, "date": -1 });

const analyticsSchema = {
  _id: ObjectId(),
  type: "daily_summary", // "daily_summary", "driver_performance", "city_metrics"
  date: ISODate("2024-09-01"),
  
  // Overall metrics
  metrics: {
    totalRides: 1250,
    totalRevenue: 45780.50,
    averageFare: 36.62,
    totalDistance: 8945.2, // km
    activeDrivers: 342,
    activeCustomers: 987,
    cancellationRate: 12.5, // percentage
    averageRating: 4.7,
    surgeHours: 4.2 // hours of surge pricing
  },
  
  // City-specific data (if type is "city_metrics")
  city: "New York",
  cityMetrics: {
    demandHotspots: [
      {
        area: "Manhattan",
        coordinates: {
          type: "Point",
          coordinates: [-73.9857, 40.7484]
        },
        rideCount: 156,
        avgWaitTime: 3.2 // minutes
      }
    ],
    peakHours: [
      { hour: 8, rideCount: 89 },
      { hour: 17, rideCount: 134 }
    ]
  },
  
  // Driver-specific data (if type is "driver_performance")
  driverId: ObjectId(),
  driverMetrics: {
    ridesCompleted: 12,
    hoursOnline: 8.5,
    earnings: 342.50,
    averageRating: 4.9,
    acceptanceRate: 95.0,
    cancellationRate: 2.0
  },
  
  createdAt: ISODate()
};

// ============================================================================
// SYSTEM CONFIGURATION COLLECTION
// ============================================================================

db.systemConfig.createIndex({ "key": 1 }, { unique: true });
db.systemConfig.createIndex({ "isPublic": 1 });

const systemConfigSchema = {
  _id: ObjectId(),
  key: "surge_pricing_enabled",
  value: true,
  description: "Enable dynamic surge pricing during high demand",
  dataType: "boolean", // "string", "number", "boolean", "object"
  isPublic: false, // Can be exposed to frontend
  category: "pricing",
  
  // Version control
  version: 1,
  previousValues: [
    {
      value: false,
      changedAt: ISODate("2024-08-01"),
      changedBy: ObjectId()
    }
  ],
  
  updatedAt: ISODate(),
  updatedBy: ObjectId()
};

// ============================================================================
// GEOFENCING AND SERVICE AREAS
// ============================================================================

db.serviceAreas.createIndex({ "boundary": "2dsphere" });
db.serviceAreas.createIndex({ "city": 1 });
db.serviceAreas.createIndex({ "isActive": 1 });

const serviceAreaSchema = {
  _id: ObjectId(),
  name: "Manhattan",
  city: "New York",
  state: "NY",
  country: "USA",
  
  // GeoJSON polygon defining service boundary
  boundary: {
    type: "Polygon",
    coordinates: [[
      [-73.9442, 40.8002],
      [-73.9734, 40.7505],
      [-73.9734, 40.7005],
      [-73.9442, 40.7505],
      [-73.9442, 40.8002]
    ]]
  },
  
  // Pricing configuration
  pricing: {
    baseSurgeMultiplier: 1.0,
    maxSurgeMultiplier: 3.0,
    surgeEnabled: true
  },
  
  // Operational settings
  isActive: true,
  maxDriverSearchRadius: 10, // km
  averagePickupTime: 5, // minutes
  
  // Current surge status
  currentSurge: {
    multiplier: 1.2,
    reason: "high_demand",
    startedAt: ISODate(),
    estimatedEnd: ISODate()
  },
  
  createdAt: ISODate(),
  updatedAt: ISODate()
};

// ============================================================================
// MONGODB VALIDATION RULES
// ============================================================================

// Add validation to ensure data integrity
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "phone", "firstName", "lastName", "userType"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        userType: {
          enum: ["customer", "driver", "admin"]
        },
        accountStatus: {
          enum: ["active", "suspended", "deactivated", "pending_verification"]
        }
      }
    }
  }
});

db.createCollection("bookings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "pickup", "dropoff", "vehicleCategory", "status"],
      properties: {
        status: {
          enum: ["pending", "confirmed", "driver_assigned", "driver_arrived", "in_progress", "completed", "cancelled"]
        },
        paymentStatus: {
          enum: ["pending", "processing", "completed", "failed", "refunded"]
        }
      }
    }
  }
});

// ============================================================================
// AGGREGATION PIPELINES FOR COMMON QUERIES
// ============================================================================

// Find available drivers near a location
const findAvailableDrivers = (lat, lng, radius = 10000) => {
  return db.users.aggregate([
    {
      $match: {
        userType: "driver",
        accountStatus: "active",
        "driverProfile.driverStatus": "online",
        "driverProfile.currentLocation": {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radius
          }
        }
      }
    },
    {
      $lookup: {
        from: "vehicles",
        localField: "_id",
        foreignField: "driverId",
        as: "vehicle"
      }
    },
    {
      $match: {
        "vehicle.status": "active"
      }
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        "driverProfile.averageRating": 1,
        "driverProfile.currentLocation": 1,
        vehicle: { $arrayElemAt: ["$vehicle", 0] }
      }
    },
    {
      $sort: { "driverProfile.averageRating": -1 }
    },
    {
      $limit: 10
    }
  ]);
};

// Calculate driver earnings for a period
const driverEarningsReport = (driverId, startDate, endDate) => {
  return db.bookings.aggregate([
    {
      $match: {
        driverId: ObjectId(driverId),
        status: "completed",
        tripCompletedAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        totalEarnings: { $sum: "$fare.total" },
        avgFare: { $avg: "$fare.total" },
        totalDistance: { $sum: "$distance.actual" },
        totalDuration: { $sum: "$duration.actual" }
      }
    }
  ]);
};

// Popular pickup locations
const popularPickupLocations = (city, limit = 10) => {
  return db.bookings.aggregate([
    {
      $match: {
        status: "completed",
        "pickup.address": { $regex: city, $options: "i" }
      }
    },
    {
      $group: {
        _id: {
          $geoNear: {
            near: "$pickup.coordinates",
            distanceField: "distance",
            maxDistance: 1000,
            spherical: true
          }
        },
        count: { $sum: 1 },
        avgFare: { $avg: "$fare.total" },
        location: { $first: "$pickup" }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// ============================================================================
// SAMPLE DATA INSERTION
// ============================================================================

// Insert vehicle categories
db.vehicleCategories.insertMany([
  {
    name: "economy",
    displayName: "Economy",
    description: "Budget-friendly rides for everyday travel",
    baseFare: 2.50,
    perKmRate: 1.20,
    perMinuteRate: 0.15,
    capacity: 4,
    features: ["air_conditioning"],
    iconUrl: "https://example.com/economy-icon.png"
  },
  {
    name: "premium",
    displayName: "Premium",
    description: "Comfortable rides with experienced drivers",
    baseFare: 4.00,
    perKmRate: 1.80,
    perMinuteRate: 0.25,
    capacity: 4,
    features: ["air_conditioning", "wifi", "phone_charger"],
    iconUrl: "https://example.com/premium-icon.png"
  },
  {
    name: "luxury",
    displayName: "Luxury",
    description: "High-end vehicles for special occasions",
    baseFare: 6.00,
    perKmRate: 2.50,
    perMinuteRate: 0.40,
    capacity: 4,
    features: ["air_conditioning", "wifi", "phone_charger", "leather_seats", "premium_sound"],
    iconUrl: "https://example.com/luxury-icon.png"
  }
]);

// Insert system configuration
db.systemConfig.insertMany([
  {
    key: "max_booking_advance_days",
    value: 7,
    description: "Maximum days in advance a ride can be booked",
    dataType: "number",
    isPublic: true,
    category: "booking"
  },
  {
    key: "cancellation_fee_threshold_minutes",
    value: 5,
    description: "Minutes after which cancellation fee applies",
    dataType: "number",
    isPublic: true,
    category: "billing"
  },
  {
    key: "driver_search_radius_km",
    value: 10,
    description: "Radius in km to search for available drivers",
    dataType: "number",
    isPublic: false,
    category: "operations"
  }
]);

print("MongoDB schema for Cabsy ride booking platform created successfully!");
print("Collections: users, vehicles, bookings, payments, ratings, notifications, promotions, supportTickets, analytics, systemConfig, serviceAreas");
print("Indexes and validation rules have been applied.");
print("Sample aggregation pipelines are available for common queries.");

-- Customer profiles (extends users)
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_payment_method VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    loyalty_points INTEGER DEFAULT 0,
    total_rides INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    preferred_vehicle_type VARCHAR(50),
    accessibility_needs TEXT,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_customer_user_id (user_id),
    INDEX idx_customer_loyalty_points (loyalty_points)
);

-- Driver profiles (extends users)
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry_date DATE NOT NULL,
    license_verified BOOLEAN DEFAULT FALSE,
    background_check_status VARCHAR(20) DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected', 'expired')),
    background_check_date TIMESTAMP,
    driver_status VARCHAR(20) DEFAULT 'offline' CHECK (driver_status IN ('online', 'offline', 'busy', 'on_break')),
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    last_location_update TIMESTAMP,
    total_trips INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    completion_rate DECIMAL(5,2) DEFAULT 100.00,
    acceptance_rate DECIMAL(5,2) DEFAULT 100.00,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_driver_user_id (user_id),
    INDEX idx_driver_status (driver_status),
    INDEX idx_driver_location (current_location_lat, current_location_lng),
    INDEX idx_driver_license (license_number)
);

-- ============================================================================
-- VEHICLES
-- ============================================================================

-- Vehicle categories
CREATE TABLE vehicle_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_fare DECIMAL(8,2) NOT NULL,
    per_km_rate DECIMAL(8,2) NOT NULL,
    per_minute_rate DECIMAL(8,2) NOT NULL,
    capacity INTEGER NOT NULL,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_vehicle_categories_active (is_active)
);

-- Driver vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES driver_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES vehicle_categories(id),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50) UNIQUE,
    registration_number VARCHAR(50),
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    inspection_date DATE,
    inspection_expiry_date DATE,
    vehicle_status VARCHAR(20) DEFAULT 'active' CHECK (vehicle_status IN ('active', 'inactive', 'maintenance', 'suspended')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    photos JSON, -- Array of photo URLs
    documents JSON, -- Array of document URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_vehicles_driver_id (driver_id),
    INDEX idx_vehicles_category_id (category_id),
    INDEX idx_vehicles_license_plate (license_plate),
    INDEX idx_vehicles_status (vehicle_status)
);

-- ============================================================================
-- BOOKINGS & RIDES
-- ============================================================================

-- Ride bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id),
    driver_id UUID REFERENCES driver_profiles(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Pickup information
    pickup_address TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8) NOT NULL,
    pickup_lng DECIMAL(11, 8) NOT NULL,
    pickup_landmark VARCHAR(200),
    
    -- Dropoff information
    dropoff_address TEXT NOT NULL,
    dropoff_lat DECIMAL(10, 8) NOT NULL,
    dropoff_lng DECIMAL(11, 8) NOT NULL,
    dropoff_landmark VARCHAR(200),
    
    -- Ride details
    estimated_distance DECIMAL(8, 2), -- in kilometers
    actual_distance DECIMAL(8, 2),
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER,
    passenger_count INTEGER DEFAULT 1,
    
    -- Pricing
    base_fare DECIMAL(8,2),
    distance_fare DECIMAL(8,2),
    time_fare DECIMAL(8,2),
    surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
    discount_amount DECIMAL(8,2) DEFAULT 0.00,
    tax_amount DECIMAL(8,2) DEFAULT 0.00,
    tip_amount DECIMAL(8,2) DEFAULT 0.00,
    total_amount DECIMAL(8,2) NOT NULL,
    
    -- Status and timing
    booking_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (booking_status IN ('pending', 'confirmed', 'driver_assigned', 'driver_arrived', 'in_progress', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    
    -- Special requirements
    special_instructions TEXT,
    is_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMP,
    vehicle_category_id UUID REFERENCES vehicle_categories(id),
    
    -- Additional stops (for multiple destinations)
    stops JSON, -- Array of stop objects
    
    -- Timestamps
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_time TIMESTAMP,
    dropoff_time TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_bookings_customer_id (customer_id),
    INDEX idx_bookings_driver_id (driver_id),
    INDEX idx_bookings_status (booking_status),
    INDEX idx_bookings_payment_status (payment_status),
    INDEX idx_bookings_booking_time (booking_time),
    INDEX idx_bookings_pickup_location (pickup_lat, pickup_lng),
    INDEX idx_bookings_dropoff_location (dropoff_lat, dropoff_lng)
);

-- Real-time ride tracking
CREATE TABLE ride_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    driver_lat DECIMAL(10, 8) NOT NULL,
    driver_lng DECIMAL(11, 8) NOT NULL,
    heading DECIMAL(5, 2), -- Direction in degrees
    speed DECIMAL(5, 2), -- Speed in km/h
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ride_tracking_booking_id (booking_id),
    INDEX idx_ride_tracking_timestamp (timestamp)
);

-- ============================================================================
-- PAYMENTS
-- ============================================================================

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'digital_wallet', 'bank_account')),
    provider VARCHAR(50), -- stripe, paypal, etc.
    provider_payment_method_id VARCHAR(200), -- External payment method ID
    is_default BOOLEAN DEFAULT FALSE,
    card_last_four CHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    billing_name VARCHAR(100),
    billing_address JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_payment_methods_customer_id (customer_id),
    INDEX idx_payment_methods_default (customer_id, is_default),
    INDEX idx_payment_methods_provider_id (provider_payment_method_id)
);

-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id),
    payment_method_id UUID REFERENCES payment_methods(id),
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('ride_fare', 'tip', 'cancellation_fee', 'refund')),
    
    -- External payment provider details
    provider VARCHAR(50) NOT NULL, -- stripe, paypal, etc.
    provider_transaction_id VARCHAR(200),
    provider_payment_intent_id VARCHAR(200),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    
    -- Metadata
    failure_reason TEXT,
    refund_reason TEXT,
    metadata JSON,
    
    -- Timestamps
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_payments_booking_id (booking_id),
    INDEX idx_payments_customer_id (customer_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_provider_transaction_id (provider_transaction_id)
);

-- ============================================================================
-- RATINGS & REVIEWS
-- ============================================================================

-- Ratings and reviews
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    rater_id UUID NOT NULL REFERENCES users(id), -- Who is giving the rating
    rated_id UUID NOT NULL REFERENCES users(id), -- Who is being rated
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    rating_type VARCHAR(20) NOT NULL CHECK (rating_type IN ('customer_to_driver', 'driver_to_customer')),
    tags JSON, -- Array of predefined tags like 'punctual', 'clean_vehicle', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one rating per booking per direction
    UNIQUE(booking_id, rater_id, rated_id),
    
    INDEX idx_ratings_booking_id (booking_id),
    INDEX idx_ratings_rated_id (rated_id),
    INDEX idx_ratings_rating_type (rating_type)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'push', 'sms', 'email')),
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_is_read (user_id, is_read),
    INDEX idx_notifications_type (type)
);

-- ============================================================================
-- PROMOTIONS & COUPONS
-- ============================================================================

-- Promotional codes and coupons
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_ride')),
    discount_value DECIMAL(8,2) NOT NULL,
    max_discount_amount DECIMAL(8,2),
    min_ride_amount DECIMAL(8,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    user_usage_limit INTEGER DEFAULT 1, -- How many times one user can use this
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    applicable_vehicle_categories JSON, -- Array of category IDs
    applicable_cities JSON, -- Array of city names
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_promotions_code (code),
    INDEX idx_promotions_active (is_active),
    INDEX idx_promotions_validity (valid_from, valid_until)
);

-- Promotion usage tracking
CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    discount_amount DECIMAL(8,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one usage per booking
    UNIQUE(booking_id),
    
    INDEX idx_promotion_usage_promotion_id (promotion_id),
    INDEX idx_promotion_usage_customer_id (customer_id)
);

-- ============================================================================
-- GEOLOCATION & AREAS
-- ============================================================================

-- Service areas
CREATE TABLE service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    boundary_polygon JSON NOT NULL, -- GeoJSON polygon
    is_active BOOLEAN DEFAULT TRUE,
    surge_enabled BOOLEAN DEFAULT TRUE,
    base_surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_service_areas_city (city),
    INDEX idx_service_areas_active (is_active)
);

-- Dynamic pricing/surge pricing
CREATE TABLE surge_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_area_id UUID NOT NULL REFERENCES service_areas(id),
    vehicle_category_id UUID NOT NULL REFERENCES vehicle_categories(id),
    surge_multiplier DECIMAL(3,2) NOT NULL,
    reason VARCHAR(100), -- 'high_demand', 'low_supply', 'event', etc.
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_surge_pricing_area_category (service_area_id, vehicle_category_id),
    INDEX idx_surge_pricing_active (is_active),
    INDEX idx_surge_pricing_time (start_time, end_time)
);

-- ============================================================================
-- SUPPORT & HELP
-- ============================================================================

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    category VARCHAR(50) NOT NULL, -- 'payment', 'driver_issue', 'technical', etc.
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    resolution_notes TEXT,
    assigned_to UUID REFERENCES users(id), -- Support agent
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_support_tickets_user_id (user_id),
    INDEX idx_support_tickets_status (status),
    INDEX idx_support_tickets_category (category)
);

-- Support ticket messages
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachments JSON, -- Array of file URLs
    is_internal BOOLEAN DEFAULT FALSE, -- Internal note vs customer-visible message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_support_messages_ticket_id (ticket_id),
    INDEX idx_support_messages_sender_id (sender_id)
);

-- ============================================================================
-- AUDIT & ANALYTICS
-- ============================================================================

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL, -- 'booking', 'payment', 'user', etc.
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', etc.
    changes JSON, -- What changed
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_entity (entity_type, entity_id),
    INDEX idx_activity_logs_created_at (created_at)
);

-- ============================================================================
-- CONFIGURATION & SETTINGS
-- ============================================================================

-- System configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT FALSE, -- Can be exposed to frontend
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    
    INDEX idx_system_config_key (key),
    INDEX idx_system_config_public (is_public)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_bookings_customer_status_time ON bookings(customer_id, booking_status, booking_time);
CREATE INDEX idx_bookings_driver_status_time ON bookings(driver_id, booking_status, booking_time);
CREATE INDEX idx_payments_customer_status_created ON payments(customer_id, status, created_at);
CREATE INDEX idx_driver_profiles_status_location ON driver_profiles(driver_status, current_location_lat, current_location_lng);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA INSERTS
-- ============================================================================

-- Insert default vehicle categories
INSERT INTO vehicle_categories (name, description, base_fare, per_km_rate, per_minute_rate, capacity, is_active) VALUES
('Economy', 'Budget-friendly rides for everyday travel', 2.50, 1.20, 0.15, 4, true),
('Premium', 'Comfortable rides with experienced drivers', 4.00, 1.80, 0.25, 4, true),
('Luxury', 'High-end vehicles for special occasions', 6.00, 2.50, 0.40, 4, true),
('SUV', 'Spacious vehicles for groups and luggage', 5.00, 2.00, 0.30, 6, true),
('Eco', 'Environment-friendly hybrid and electric vehicles', 3.00, 1.40, 0.20, 4, true);

-- Insert system configuration
INSERT INTO system_config (key, value, description, data_type, is_public) VALUES
('max_booking_advance_days', '7', 'Maximum days in advance a ride can be booked', 'number', true),
('cancellation_fee_threshold_minutes', '5', 'Minutes after which cancellation fee applies', 'number', true),
('driver_search_radius_km', '10', 'Radius in km to search for available drivers', 'number', false),
('surge_pricing_enabled', 'true', 'Enable dynamic surge pricing', 'boolean', false),
('customer_rating_required', 'true', 'Require customer rating after ride', 'boolean', true),
('driver_background_check_required', 'true', 'Require background check for drivers', 'boolean', false);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Driver availability view
CREATE VIEW driver_availability AS
SELECT 
    dp.id as driver_id,
    u.first_name,
    u.last_name,
    dp.driver_status,
    dp.current_location_lat,
    dp.current_location_lng,
    dp.average_rating,
    v.id as vehicle_id,
    vc.name as vehicle_category,
    v.make,
    v.model,
    v.license_plate
FROM driver_profiles dp
JOIN users u ON dp.user_id = u.id
JOIN vehicles v ON dp.id = v.driver_id
JOIN vehicle_categories vc ON v.category_id = vc.id
WHERE dp.driver_status = 'online' 
AND v.vehicle_status = 'active'
AND u.account_status = 'active';

-- Booking summary view
CREATE VIEW booking_summary AS
SELECT 
    b.id,
    b.booking_status,
    b.total_amount,
    b.booking_time,
    cu.first_name as customer_first_name,
    cu.last_name as customer_last_name,
    du.first_name as driver_first_name,
    du.last_name as driver_last_name,
    vc.name as vehicle_category,
    b.pickup_address,
    b.dropoff_address
FROM bookings b
JOIN customer_profiles cp ON b.customer_id = cp.id
JOIN users cu ON cp.user_id = cu.id
LEFT JOIN driver_profiles dp ON b.driver_id = dp.id
LEFT JOIN users du ON dp.user_id = du.id
LEFT JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id;

-- ============================================================================
-- DATABASE COMMENTS
-- ============================================================================

COMMENT ON DATABASE cabsy IS 'Comprehensive database for Cabsy ride booking platform';
COMMENT ON TABLE users IS 'Core user accounts for customers, drivers, and admins';
COMMENT ON TABLE bookings IS 'Main ride booking records with all trip details';
COMMENT ON TABLE payments IS 'Payment transactions and financial records';
COMMENT ON TABLE ratings IS 'Rating and review system for drivers and customers';
COMMENT ON TABLE vehicles IS 'Driver vehicle information and documentation';
COMMENT ON TABLE notifications IS 'In-app and push notifications system';
