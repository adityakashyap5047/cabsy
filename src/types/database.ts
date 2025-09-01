// MongoDB Types for Cabsy Platform
// Generated from MongoDB schema

import { ObjectId } from 'mongodb';

// Utility types
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
type JSONObject = { [key: string]: JSONValue };

// Address type for billing information
interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// GeoJSON Point for location data
interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// GeoJSON Polygon for service areas
interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// Contact person information
interface ContactPerson {
  name: string;
  phone: string;
}

// Emergency contact
interface EmergencyContact {
  name: string;
  phone: string;
}

// Saved address for customers
interface SavedAddress {
  label: string;
  address: string;
  coordinates: GeoPoint;
}

// Working hours for drivers
interface WorkingHours {
  monday: { start: string; end: string; active: boolean };
  tuesday: { start: string; end: string; active: boolean };
  wednesday: { start: string; end: string; active: boolean };
  thursday: { start: string; end: string; active: boolean };
  friday: { start: string; end: string; active: boolean };
  saturday: { start: string; end: string; active: boolean };
  sunday: { start: string; end: string; active: boolean };
}

// Background check information
interface BackgroundCheck {
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  date: Date;
  expiryDate: Date;
}

// Document information
interface Document {
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface User {
  _id: ObjectId;
  email: string;
  phone: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePictureUrl?: string;
  userType: 'customer' | 'driver' | 'admin';
  accountStatus: 'active' | 'suspended' | 'deactivated' | 'pending_verification';
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Customer-specific fields (when userType is "customer")
  customerProfile?: {
    preferredPaymentMethod?: string;
    emergencyContact?: EmergencyContact;
    loyaltyPoints: number;
    totalRides: number;
    totalSpent: number;
    averageRating: number;
    preferredVehicleType?: string;
    accessibilityNeeds?: string;
    marketingConsent: boolean;
    savedAddresses: SavedAddress[];
  };
  
  // Driver-specific fields (when userType is "driver")
  driverProfile?: {
    licenseNumber: string;
    licenseExpiryDate: Date;
    licenseVerified: boolean;
    backgroundCheck: BackgroundCheck;
    driverStatus: 'online' | 'offline' | 'busy' | 'on_break';
    currentLocation?: GeoPoint;
    lastLocationUpdate?: Date;
    totalTrips: number;
    totalEarnings: number;
    averageRating: number;
    completionRate: number;
    acceptanceRate: number;
    onboardingCompleted: boolean;
    documents: {
      license?: string;
      insurance?: string;
      backgroundCheck?: string;
    };
    workingHours: WorkingHours;
  };
  
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface VehicleCategory {
  name: string;
  displayName: string;
  description?: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  capacity: number;
  features: string[];
  iconUrl?: string;
}

export interface Vehicle {
  _id: ObjectId;
  driverId: ObjectId;
  category: VehicleCategory;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  registrationNumber?: string;
  insurance: {
    policyNumber: string;
    provider: string;
    expiryDate: Date;
  };
  inspection: {
    date: Date;
    expiryDate: Date;
    status: string;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  photos: string[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Stop {
  order: number;
  address: string;
  coordinates: GeoPoint;
  landmark?: string;
  waitTime?: number; // minutes
}

export interface Location {
  address: string;
  coordinates: GeoPoint;
  landmark?: string;
  contactPerson?: ContactPerson;
}

export interface Accessibility {
  wheelchairAccessible: boolean;
  childSeat: boolean;
  petFriendly: boolean;
}

export interface Distance {
  estimated?: number;
  actual?: number;
}

export interface Duration {
  estimated?: number;
  actual?: number;
}

export interface Discount {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed_amount';
}

export interface Fare {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  subtotal: number;
  discount?: Discount;
  tax: number;
  tip: number;
  total: number;
}

export interface Cancellation {
  cancelledBy?: ObjectId;
  reason?: string;
  fee: number;
}

export interface TrackingPoint {
  timestamp: Date;
  driverLocation: GeoPoint;
  heading?: number; // degrees
  speed?: number; // km/h
}

export interface Booking {
  _id: ObjectId;
  bookingNumber: string;
  customerId: ObjectId;
  driverId?: ObjectId;
  vehicleId?: ObjectId;
  
  pickup: Location;
  dropoff: Location;
  stops?: Stop[];
  
  vehicleCategory: string;
  passengerCount: number;
  specialInstructions?: string;
  accessibility: Accessibility;
  
  distance: Distance;
  duration: Duration;
  fare: Fare;
  
  status: 'pending' | 'confirmed' | 'driver_assigned' | 'driver_arrived' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  isScheduled: boolean;
  scheduledTime?: Date;
  
  bookingTime: Date;
  confirmedAt?: Date;
  driverAssignedAt?: Date;
  driverArrivedAt?: Date;
  tripStartedAt?: Date;
  tripCompletedAt?: Date;
  cancelledAt?: Date;
  cancellation?: Cancellation;
  
  tracking: TrackingPoint[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'cash';
  provider: string;
  methodId?: string;
  card?: {
    lastFour: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
}

export interface PaymentFailure {
  code?: string;
  message?: string;
  timestamp?: Date;
}

export interface PaymentRefund {
  amount: number;
  reason?: string;
  processedAt?: Date;
  refundId?: string;
}

export interface PaymentMetadata {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface Payment {
  _id: ObjectId;
  bookingId: ObjectId;
  customerId: ObjectId;
  
  amount: number;
  currency: string;
  type: 'ride_fare' | 'tip' | 'cancellation_fee' | 'refund';
  
  paymentMethod: PaymentMethod;
  provider: string;
  providerTransactionId?: string;
  providerPaymentIntentId?: string;
  
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  
  failure?: PaymentFailure;
  refund?: PaymentRefund;
  metadata?: PaymentMetadata;
  
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingBreakdown {
  punctuality: number;
  cleanliness: number;
  communication: number;
  safety: number;
  overall: number;
}

export interface RatingResponse {
  message: string;
  respondedAt: Date;
}

export interface Rating {
  _id: ObjectId;
  bookingId: ObjectId;
  raterId: ObjectId;
  ratedId: ObjectId;
  type: 'customer_to_driver' | 'driver_to_customer';
  
  rating: number; // 1-5
  review?: string;
  tags: string[];
  breakdown: RatingBreakdown;
  response?: RatingResponse;
  
  createdAt: Date;
}

export interface NotificationChannel {
  sent: boolean;
  sentAt?: Date;
  read?: boolean;
  readAt?: Date;
  deviceTokens?: string[];
  emailId?: string;
  reason?: string;
}

export interface NotificationChannels {
  inApp: NotificationChannel;
  push: NotificationChannel;
  sms: NotificationChannel;
  email: NotificationChannel;
}

export interface Notification {
  _id: ObjectId;
  userId: ObjectId;
  type: string;
  title: string;
  message: string;
  data?: JSONObject;
  channels: NotificationChannels;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionDiscount {
  type: 'percentage' | 'fixed_amount' | 'free_ride';
  value: number;
  maxAmount?: number;
  minRideAmount?: number;
}

export interface PromotionUsage {
  totalLimit?: number;
  currentCount: number;
  userLimit: number;
  userUsage: { [userId: string]: number };
}

export interface PromotionApplicability {
  vehicleCategories?: string[];
  cities?: string[];
  userTypes?: string[];
  firstRideOnly?: boolean;
}

export interface PromotionCampaign {
  name: string;
  source: string;
  medium: string;
}

export interface Promotion {
  _id: ObjectId;
  code: string;
  title: string;
  description?: string;
  discount: PromotionDiscount;
  usage: PromotionUsage;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  applicableTo: PromotionApplicability;
  campaign: PromotionCampaign;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportAssignment {
  agentId: ObjectId;
  agentName: string;
  assignedAt: Date;
}

export interface SupportAttachment {
  filename: string;
  url: string;
  size: number;
}

export interface SupportMessage {
  id: ObjectId;
  senderId: ObjectId;
  senderType: 'customer' | 'agent' | 'system';
  message: string;
  attachments?: SupportAttachment[];
  timestamp: Date;
}

export interface SupportResolution {
  resolvedBy?: ObjectId;
  resolvedAt?: Date;
  resolution?: string;
  customerSatisfaction?: number; // 1-5 rating
}

export interface SupportMetrics {
  firstResponseTime?: number; // minutes
  resolutionTime?: number; // minutes
  totalMessages: number;
}

export interface SupportTicket {
  _id: ObjectId;
  ticketNumber: string;
  userId: ObjectId;
  bookingId?: ObjectId;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  subject: string;
  description: string;
  assignedTo?: SupportAssignment;
  messages: SupportMessage[];
  resolution?: SupportResolution;
  metrics: SupportMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsMetrics {
  totalRides: number;
  totalRevenue: number;
  averageFare: number;
  totalDistance: number;
  activeDrivers: number;
  activeCustomers: number;
  cancellationRate: number;
  averageRating: number;
  surgeHours: number;
}

export interface DemandHotspot {
  area: string;
  coordinates: GeoPoint;
  rideCount: number;
  avgWaitTime: number;
}

export interface PeakHour {
  hour: number;
  rideCount: number;
}

export interface CityMetrics {
  demandHotspots: DemandHotspot[];
  peakHours: PeakHour[];
}

export interface DriverMetrics {
  ridesCompleted: number;
  hoursOnline: number;
  earnings: number;
  averageRating: number;
  acceptanceRate: number;
  cancellationRate: number;
}

export interface Analytics {
  _id: ObjectId;
  type: 'daily_summary' | 'driver_performance' | 'city_metrics';
  date: Date;
  metrics: AnalyticsMetrics;
  city?: string;
  cityMetrics?: CityMetrics;
  driverId?: ObjectId;
  driverMetrics?: DriverMetrics;
  createdAt: Date;
}

export interface ConfigValue {
  value: JSONValue;
  changedAt: Date;
  changedBy: ObjectId;
}

export interface SystemConfig {
  _id: ObjectId;
  key: string;
  value: JSONValue;
  description?: string;
  dataType: 'string' | 'number' | 'boolean' | 'object';
  isPublic: boolean;
  category: string;
  version: number;
  previousValues: ConfigValue[];
  updatedAt: Date;
  updatedBy: ObjectId;
}

export interface PricingConfig {
  baseSurgeMultiplier: number;
  maxSurgeMultiplier: number;
  surgeEnabled: boolean;
}

export interface CurrentSurge {
  multiplier: number;
  reason: string;
  startedAt: Date;
  estimatedEnd: Date;
}

export interface ServiceArea {
  _id: ObjectId;
  name: string;
  city: string;
  state?: string;
  country: string;
  boundary: GeoPolygon;
  pricing: PricingConfig;
  isActive: boolean;
  maxDriverSearchRadius: number;
  averagePickupTime: number;
  currentSurge?: CurrentSurge;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateBookingRequest {
  pickup: {
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
  };
  vehicleCategory: string;
  passengerCount?: number;
  specialInstructions?: string;
  isScheduled?: boolean;
  scheduledTime?: string;
  stops?: Array<{
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
    order: number;
  }>;
  promotionCode?: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  bookingNumber: string;
  estimatedFare: number;
  estimatedDuration: number;
  estimatedDistance: number;
  availableDrivers: number;
  eta: number;
}

export interface DriverLocationUpdate {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface FareEstimate {
  vehicleCategory: string;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  estimatedTotal: number;
  currency: string;
}

// MongoDB connection configuration
export interface MongoDBConfig {
  uri: string;
  dbName: string;
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
    family?: number;
  };
}

// Utility types for forms and API
export type CreateUserData = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>;
export type UpdateUserData = Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>;
export type CreateBookingData = Omit<Booking, '_id' | 'createdAt' | 'updatedAt' | 'bookingTime' | 'bookingNumber'>;
export type UpdateBookingData = Partial<Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>>;

// Enums for better type safety
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  ON_BREAK = 'on_break'
}

export enum UserType {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended'
}

export interface User {
  id: string;
  email: string;
  phone: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profile_picture_url?: string;
  user_type: 'customer' | 'driver' | 'admin';
  account_status: 'active' | 'suspended' | 'deactivated' | 'pending_verification';
  email_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  preferred_payment_method?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  loyalty_points: number;
  total_rides: number;
  total_spent: number;
  average_rating: number;
  preferred_vehicle_type?: string;
  accessibility_needs?: string;
  marketing_consent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DriverProfile {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry_date: Date;
  license_verified: boolean;
  background_check_status: 'pending' | 'approved' | 'rejected' | 'expired';
  background_check_date?: Date;
  driver_status: 'online' | 'offline' | 'busy' | 'on_break';
  current_location_lat?: number;
  current_location_lng?: number;
  last_location_update?: Date;
  total_trips: number;
  total_earnings: number;
  average_rating: number;
  completion_rate: number;
  acceptance_rate: number;
  onboarding_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleCategory {
  id: string;
  name: string;
  description?: string;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  capacity: number;
  icon_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  category_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  vin?: string;
  registration_number?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: Date;
  inspection_date?: Date;
  inspection_expiry_date?: Date;
  vehicle_status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  verification_status: 'pending' | 'approved' | 'rejected';
  photos?: string[]; // JSON array
  documents?: string[]; // JSON array
  created_at: Date;
  updated_at: Date;
}

export interface Stop {
  address: string;
  lat: number;
  lng: number;
  landmark?: string;
  order: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  driver_id?: string;
  vehicle_id?: string;
  
  // Pickup information
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_landmark?: string;
  
  // Dropoff information
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  dropoff_landmark?: string;
  
  // Ride details
  estimated_distance?: number;
  actual_distance?: number;
  estimated_duration?: number;
  actual_duration?: number;
  passenger_count: number;
  
  // Pricing
  base_fare?: number;
  distance_fare?: number;
  time_fare?: number;
  surge_multiplier: number;
  discount_amount: number;
  tax_amount: number;
  tip_amount: number;
  total_amount: number;
  
  // Status and timing
  booking_status: 'pending' | 'confirmed' | 'driver_assigned' | 'driver_arrived' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Special requirements
  special_instructions?: string;
  is_scheduled: boolean;
  scheduled_time?: Date;
  vehicle_category_id?: string;
  
  // Additional stops
  stops?: Stop[];
  
  // Timestamps
  booking_time: Date;
  pickup_time?: Date;
  dropoff_time?: Date;
  cancelled_at?: Date;
  cancelled_by?: string;
  cancellation_reason?: string;
  
  created_at: Date;
  updated_at: Date;
}

export interface RideTracking {
  id: string;
  booking_id: string;
  driver_lat: number;
  driver_lng: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface PaymentMethod {
  id: string;
  customer_id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_account';
  provider?: string;
  provider_payment_method_id?: string;
  is_default: boolean;
  card_last_four?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  billing_name?: string;
  billing_address?: Address;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  payment_method_id?: string;
  
  // Payment details
  amount: number;
  currency: string;
  payment_type: 'ride_fare' | 'tip' | 'cancellation_fee' | 'refund';
  
  // External payment provider details
  provider: string;
  provider_transaction_id?: string;
  provider_payment_intent_id?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  
  // Metadata
  failure_reason?: string;
  refund_reason?: string;
  metadata?: JSONObject;
  
  // Timestamps
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Rating {
  id: string;
  booking_id: string;
  rater_id: string;
  rated_id: string;
  rating: number; // 1-5
  review?: string;
  rating_type: 'customer_to_driver' | 'driver_to_customer';
  tags?: string[];
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: JSONObject;
  is_read: boolean;
  channel: 'in_app' | 'push' | 'sms' | 'email';
  sent_at?: Date;
  read_at?: Date;
  created_at: Date;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_ride';
  discount_value: number;
  max_discount_amount?: number;
  min_ride_amount?: number;
  usage_limit?: number;
  usage_count: number;
  user_usage_limit: number;
  is_active: boolean;
  valid_from: Date;
  valid_until: Date;
  applicable_vehicle_categories?: string[];
  applicable_cities?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface PromotionUsage {
  id: string;
  promotion_id: string;
  customer_id: string;
  booking_id: string;
  discount_amount: number;
  used_at: Date;
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  boundary_polygon: JSONObject; // GeoJSON
  is_active: boolean;
  surge_enabled: boolean;
  base_surge_multiplier: number;
  created_at: Date;
  updated_at: Date;
}

export interface SurgePricing {
  id: string;
  service_area_id: string;
  vehicle_category_id: string;
  surge_multiplier: number;
  reason?: string;
  start_time: Date;
  end_time?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  booking_id?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  resolution_notes?: string;
  assigned_to?: string;
  resolved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  attachments?: string[];
  is_internal: boolean;
  created_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes?: JSONObject;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  data_type: 'string' | 'number' | 'boolean' | 'json';
  is_public: boolean;
  updated_at: Date;
  updated_by?: string;
}

// Views
export interface DriverAvailability {
  driver_id: string;
  first_name: string;
  last_name: string;
  driver_status: string;
  current_location_lat?: number;
  current_location_lng?: number;
  average_rating: number;
  vehicle_id: string;
  vehicle_category: string;
  make: string;
  model: string;
  license_plate: string;
}

export interface BookingSummary {
  id: string;
  booking_status: string;
  total_amount: number;
  booking_time: Date;
  customer_first_name: string;
  customer_last_name: string;
  driver_first_name?: string;
  driver_last_name?: string;
  vehicle_category?: string;
  pickup_address: string;
  dropoff_address: string;
}

// API Request/Response Types
export interface CreateBookingRequest {
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_landmark?: string;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  dropoff_landmark?: string;
  vehicle_category_id: string;
  passenger_count?: number;
  special_instructions?: string;
  is_scheduled?: boolean;
  scheduled_time?: string;
  stops?: Stop[];
  promotion_code?: string;
}

export interface CreateBookingResponse {
  booking_id: string;
  estimated_fare: number;
  estimated_duration: number;
  estimated_distance: number;
  available_drivers: number;
  eta_seconds: number;
}

export interface DriverLocationUpdate {
  driver_id: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface FareEstimate {
  vehicle_category_id: string;
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  surge_multiplier: number;
  estimated_total: number;
  currency: string;
}

// Database connection and query types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
  };
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  command: string;
}

// Utility types for forms and API
export type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at'>;
export type UpdateUserData = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
export type CreateBookingData = Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_time'>;
export type UpdateBookingData = Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;

// Enums for better type safety
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  ON_BREAK = 'on_break'
}

export enum UserType {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin'
}
