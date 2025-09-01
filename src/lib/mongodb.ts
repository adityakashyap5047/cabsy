// MongoDB Connection and Configuration
import { MongoClient, Db, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB_NAME || 'cabsy');
}

// Collection getters
export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection('users');
}

export async function getVehiclesCollection() {
  const db = await getDatabase();
  return db.collection('vehicles');
}

export async function getBookingsCollection() {
  const db = await getDatabase();
  return db.collection('bookings');
}

export async function getPaymentsCollection() {
  const db = await getDatabase();
  return db.collection('payments');
}

export async function getRatingsCollection() {
  const db = await getDatabase();
  return db.collection('ratings');
}

export async function getNotificationsCollection() {
  const db = await getDatabase();
  return db.collection('notifications');
}

export async function getPromotionsCollection() {
  const db = await getDatabase();
  return db.collection('promotions');
}

export async function getSupportTicketsCollection() {
  const db = await getDatabase();
  return db.collection('supportTickets');
}

export async function getAnalyticsCollection() {
  const db = await getDatabase();
  return db.collection('analytics');
}

export async function getSystemConfigCollection() {
  const db = await getDatabase();
  return db.collection('systemConfig');
}

export async function getServiceAreasCollection() {
  const db = await getDatabase();
  return db.collection('serviceAreas');
}

// Initialize database with indexes and validation rules
export async function initializeDatabase() {
  try {
    const db = await getDatabase();
    
    // Create collections with validation rules
    await createCollections(db);
    
    // Create indexes
    await createIndexes(db);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function createCollections(db: Db) {
  // Users collection with validation
  try {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'phone', 'passwordHash', 'firstName', 'lastName', 'userType', 'accountStatus'],
          properties: {
            email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
            phone: { bsonType: 'string', pattern: '^\\+?[1-9]\\d{1,14}$' },
            passwordHash: { bsonType: 'string', minLength: 60 },
            firstName: { bsonType: 'string', minLength: 1, maxLength: 50 },
            lastName: { bsonType: 'string', minLength: 1, maxLength: 50 },
            userType: { enum: ['customer', 'driver', 'admin'] },
            accountStatus: { enum: ['active', 'suspended', 'deactivated', 'pending_verification'] },
            emailVerified: { bsonType: 'bool' },
            phoneVerified: { bsonType: 'bool' }
          }
        }
      }
    });
  } catch (error) {
    if (error.code !== 48) { // Collection already exists
      throw error;
    }
  }

  // Bookings collection with validation
  try {
    await db.createCollection('bookings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['bookingNumber', 'customerId', 'pickup', 'dropoff', 'vehicleCategory', 'status', 'paymentStatus'],
          properties: {
            bookingNumber: { bsonType: 'string', pattern: '^CB[0-9]{8}$' },
            customerId: { bsonType: 'objectId' },
            status: { enum: ['pending', 'confirmed', 'driver_assigned', 'driver_arrived', 'in_progress', 'completed', 'cancelled'] },
            paymentStatus: { enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] },
            vehicleCategory: { bsonType: 'string', minLength: 1 },
            passengerCount: { bsonType: 'int', minimum: 1, maximum: 10 }
          }
        }
      }
    });
  } catch (error) {
    if (error.code !== 48) { // Collection already exists
      throw error;
    }
  }

  // Vehicles collection with validation
  try {
    await db.createCollection('vehicles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['driverId', 'category', 'make', 'model', 'year', 'licensePlate', 'status'],
          properties: {
            driverId: { bsonType: 'objectId' },
            year: { bsonType: 'int', minimum: 1990, maximum: 2030 },
            status: { enum: ['active', 'inactive', 'maintenance', 'suspended'] },
            verificationStatus: { enum: ['pending', 'approved', 'rejected'] }
          }
        }
      }
    });
  } catch (error) {
    if (error.code !== 48) { // Collection already exists
      throw error;
    }
  }

  // Payments collection with validation
  try {
    await db.createCollection('payments', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['bookingId', 'customerId', 'amount', 'currency', 'type', 'paymentMethod', 'status'],
          properties: {
            bookingId: { bsonType: 'objectId' },
            customerId: { bsonType: 'objectId' },
            amount: { bsonType: 'number', minimum: 0 },
            currency: { bsonType: 'string', minLength: 3, maxLength: 3 },
            type: { enum: ['ride_fare', 'tip', 'cancellation_fee', 'refund'] },
            status: { enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'] }
          }
        }
      }
    });
  } catch (error) {
    if (error.code !== 48) { // Collection already exists
      throw error;
    }
  }

  // Ratings collection with validation
  try {
    await db.createCollection('ratings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['bookingId', 'raterId', 'ratedId', 'type', 'rating'],
          properties: {
            bookingId: { bsonType: 'objectId' },
            raterId: { bsonType: 'objectId' },
            ratedId: { bsonType: 'objectId' },
            type: { enum: ['customer_to_driver', 'driver_to_customer'] },
            rating: { bsonType: 'number', minimum: 1, maximum: 5 }
          }
        }
      }
    });
  } catch (error) {
    if (error.code !== 48) { // Collection already exists
      throw error;
    }
  }
}

async function createIndexes(db: Db) {
  // Users indexes
  const usersCollection = db.collection('users');
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ phone: 1 }, { unique: true });
  await usersCollection.createIndex({ userType: 1 });
  await usersCollection.createIndex({ accountStatus: 1 });
  await usersCollection.createIndex({ "driverProfile.currentLocation": "2dsphere" });
  await usersCollection.createIndex({ "driverProfile.driverStatus": 1 });

  // Bookings indexes
  const bookingsCollection = db.collection('bookings');
  await bookingsCollection.createIndex({ bookingNumber: 1 }, { unique: true });
  await bookingsCollection.createIndex({ customerId: 1 });
  await bookingsCollection.createIndex({ driverId: 1 });
  await bookingsCollection.createIndex({ status: 1 });
  await bookingsCollection.createIndex({ bookingTime: -1 });
  await bookingsCollection.createIndex({ "pickup.coordinates": "2dsphere" });
  await bookingsCollection.createIndex({ "dropoff.coordinates": "2dsphere" });
  await bookingsCollection.createIndex({ customerId: 1, status: 1 });
  await bookingsCollection.createIndex({ driverId: 1, status: 1 });

  // Vehicles indexes
  const vehiclesCollection = db.collection('vehicles');
  await vehiclesCollection.createIndex({ driverId: 1 });
  await vehiclesCollection.createIndex({ licensePlate: 1 }, { unique: true });
  await vehiclesCollection.createIndex({ status: 1 });
  await vehiclesCollection.createIndex({ verificationStatus: 1 });

  // Payments indexes
  const paymentsCollection = db.collection('payments');
  await paymentsCollection.createIndex({ bookingId: 1 });
  await paymentsCollection.createIndex({ customerId: 1 });
  await paymentsCollection.createIndex({ status: 1 });
  await paymentsCollection.createIndex({ providerTransactionId: 1 });
  await paymentsCollection.createIndex({ createdAt: -1 });

  // Ratings indexes
  const ratingsCollection = db.collection('ratings');
  await ratingsCollection.createIndex({ bookingId: 1 }, { unique: true });
  await ratingsCollection.createIndex({ raterId: 1 });
  await ratingsCollection.createIndex({ ratedId: 1 });
  await ratingsCollection.createIndex({ type: 1 });

  // Notifications indexes
  const notificationsCollection = db.collection('notifications');
  await notificationsCollection.createIndex({ userId: 1 });
  await notificationsCollection.createIndex({ type: 1 });
  await notificationsCollection.createIndex({ createdAt: -1 });
  await notificationsCollection.createIndex({ "channels.inApp.read": 1 });

  // Promotions indexes
  const promotionsCollection = db.collection('promotions');
  await promotionsCollection.createIndex({ code: 1 }, { unique: true });
  await promotionsCollection.createIndex({ isActive: 1 });
  await promotionsCollection.createIndex({ validFrom: 1, validUntil: 1 });

  // Support tickets indexes
  const supportTicketsCollection = db.collection('supportTickets');
  await supportTicketsCollection.createIndex({ ticketNumber: 1 }, { unique: true });
  await supportTicketsCollection.createIndex({ userId: 1 });
  await supportTicketsCollection.createIndex({ status: 1 });
  await supportTicketsCollection.createIndex({ priority: 1 });
  await supportTicketsCollection.createIndex({ createdAt: -1 });

  // Analytics indexes
  const analyticsCollection = db.collection('analytics');
  await analyticsCollection.createIndex({ type: 1, date: -1 });
  await analyticsCollection.createIndex({ driverId: 1, date: -1 });
  await analyticsCollection.createIndex({ city: 1, date: -1 });

  // System config indexes
  const systemConfigCollection = db.collection('systemConfig');
  await systemConfigCollection.createIndex({ key: 1 }, { unique: true });
  await systemConfigCollection.createIndex({ category: 1 });
  await systemConfigCollection.createIndex({ isPublic: 1 });

  // Service areas indexes
  const serviceAreasCollection = db.collection('serviceAreas');
  await serviceAreasCollection.createIndex({ boundary: "2dsphere" });
  await serviceAreasCollection.createIndex({ city: 1 });
  await serviceAreasCollection.createIndex({ isActive: 1 });
  await serviceAreasCollection.createIndex({ name: 1 }, { unique: true });
}

export default clientPromise;
