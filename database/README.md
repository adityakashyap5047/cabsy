# MongoDB Configuration Guide for Cabsy Platform

## 🗄️ Database Overview

This MongoDB schema supports a comprehensive ride-booking platform with the following core features:

### **📊 Database Statistics:**
- **10+ Collections** covering all aspects of the platform
- **GeoSpatial Indexing** for location-based queries
- **Document Validation** for data integrity
- **Aggregation Pipelines** for complex analytics
- **Real-time Tracking** with geolocation
- **Flexible Schema** for rapid development

## 🚀 Quick Setup

### **1. MongoDB Installation**

```bash
# Install MongoDB Community Edition
# Ubuntu/Debian:
sudo apt-get install -y mongodb-org

# macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Windows: Download from https://www.mongodb.com/download-center/community

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### **2. Environment Configuration**

Create `.env.local` for database connection:

```env
# MongoDB Configuration
MONGODB_URI="mongodb://localhost:27017/cabsy_db"
MONGODB_DB_NAME="cabsy_db"

# For MongoDB Atlas (Cloud)
MONGODB_URI="mongodb+srv://username:password@cluster0.mongodb.net/cabsy_db?retryWrites=true&w=majority"

# Different environments
NODE_ENV=development

# Production settings
PROD_MONGODB_URI="mongodb+srv://prod-user:pass@prod-cluster.mongodb.net/cabsy_prod"
```

### **3. Initialize the Database**

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use cabsy_db

# Run the schema file (copy and paste the JavaScript content)
# Or save schema as schema.js and run:
load('database/schema.js')
```

## 📋 Collection Structure Overview

### **👥 User Management (1 collection)**
- `users` - Unified collection for customers, drivers, and admins with embedded profiles

### **🚗 Vehicle Management (1 collection)**
- `vehicles` - Vehicle information with embedded category details

### **📱 Booking System (1 collection)**
- `bookings` - Complete ride records with embedded tracking, stops, and fare breakdown

### **💳 Payment System (1 collection)**
- `payments` - Transaction records with provider details and metadata

### **⭐ Rating System (1 collection)**
- `ratings` - Driver/customer reviews with detailed breakdown

### **🎯 Marketing & Support (3 collections)**
- `promotions` - Discount codes with usage tracking
- `notifications` - Multi-channel notifications (push, SMS, email)
- `supportTickets` - Customer support with embedded conversation

### **🌍 Geolocation (1 collection)**
- `serviceAreas` - Coverage areas with GeoJSON boundaries and surge pricing

### **📊 Analytics (1 collection)**
- `analytics` - Performance metrics and business intelligence

### **⚙️ Configuration (1 collection)**
- `systemConfig` - Application settings with version control

## 🔄 Document Relationships

```
users {
  _id,
  customerProfile: { ... },  // Embedded for customers
  driverProfile: { ... }     // Embedded for drivers
}

bookings {
  customerId: ObjectId(users._id),
  driverId: ObjectId(users._id),
  vehicleId: ObjectId(vehicles._id),
  tracking: [...],           // Embedded tracking points
  stops: [...]              // Embedded stops
}

payments {
  bookingId: ObjectId(bookings._id),
  customerId: ObjectId(users._id)
}
```

## 📈 Performance Optimization

### **Indexes Created:**
```javascript
// User lookups
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 }, { unique: true })

// Geospatial indexes for location queries
db.bookings.createIndex({ "pickup.coordinates": "2dsphere" })
db.bookings.createIndex({ "dropoff.coordinates": "2dsphere" })
db.users.createIndex({ "driverProfile.currentLocation": "2dsphere" })

// Query optimization
db.bookings.createIndex({ "customerId": 1, "status": 1, "bookingTime": -1 })
db.payments.createIndex({ "customerId": 1, "status": 1, "createdAt": -1 })
```

### **Query Optimization Features:**
1. **Compound Indexes** for multi-field queries
2. **Geospatial Indexes** for location-based searches
3. **Text Indexes** for search functionality
4. **TTL Indexes** for automatic data expiration
5. **Partial Indexes** for conditional queries

## 🔒 Security Features

### **Built-in Security:**
- ✅ **Document Validation** - JSON Schema validation
- ✅ **Authentication** - Built-in user management
- ✅ **Authorization** - Role-based access control
- ✅ **Encryption** - At-rest and in-transit encryption
- ✅ **Audit Logging** - Comprehensive activity tracking

### **Security Implementation:**
```javascript
// Enable authentication
use admin
db.createUser({
  user: "cabsy_admin",
  pwd: "secure_password",
  roles: ["readWrite", "dbAdmin"]
})

// Role-based access
db.createRole({
  role: "customerRole",
  privileges: [
    {
      resource: { db: "cabsy_db", collection: "bookings" },
      actions: ["find", "insert", "update"]
    }
  ],
  roles: []
})
```

## 📊 Sample Queries

### **Find Available Drivers:**
```javascript
db.users.find({
  userType: "driver",
  accountStatus: "active",
  "driverProfile.driverStatus": "online",
  "driverProfile.currentLocation": {
    $near: {
      $geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
      $maxDistance: 5000 // 5km radius
    }
  }
}).sort({ "driverProfile.averageRating": -1 }).limit(10)
```

### **Customer Ride History:**
```javascript
db.bookings.find({
  customerId: ObjectId("customer_id"),
  status: "completed"
}).sort({ bookingTime: -1 }).limit(20)
```

### **Revenue Analytics with Aggregation:**
```javascript
db.bookings.aggregate([
  {
    $match: {
      status: "completed",
      tripCompletedAt: {
        $gte: ISODate("2024-09-01"),
        $lt: ISODate("2024-10-01")
      }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$tripCompletedAt" } },
      totalRides: { $sum: 1 },
      totalRevenue: { $sum: "$fare.total" },
      avgFare: { $avg: "$fare.total" }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

## 🔄 Data Migration Strategy

### **Schema Versioning:**
```javascript
// Add version field to collections
db.users.updateMany({}, { $set: { schemaVersion: 1 } })

// Migration script example
const migrateToV2 = () => {
  db.users.find({ schemaVersion: 1 }).forEach(user => {
    // Perform migration logic
    db.users.updateOne(
      { _id: user._id },
      { $set: { schemaVersion: 2, newField: "defaultValue" } }
    )
  })
}
```

### **Backup Strategy:**
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/cabsy_db" --out=/backup/

# Restore backup
mongorestore --uri="mongodb://localhost:27017/cabsy_db" /backup/cabsy_db/

# Compressed backup
mongodump --uri="mongodb://localhost:27017/cabsy_db" --gzip --archive=cabsy_backup.gz
```

## 🌐 Scaling Considerations

### **Horizontal Scaling:**
- **Sharding** by customer ID or geographic region
- **Read Replicas** for analytics and reporting
- **Connection Pooling** for efficient resource usage
- **Load Balancing** across multiple mongos instances

### **Vertical Scaling:**
- **Memory Optimization** with proper indexing
- **Storage Optimization** with compression
- **Query Optimization** with explain plans
- **Connection Limits** management

### **Sharding Strategy:**
```javascript
// Enable sharding on database
sh.enableSharding("cabsy_db")

// Shard bookings collection by customer ID
sh.shardCollection("cabsy_db.bookings", { "customerId": 1 })

// Shard users collection by email hash
sh.shardCollection("cabsy_db.users", { "email": "hashed" })
```

## 📱 Integration Points

### **External APIs Integration:**
- **Stripe/PayPal** - Store payment tokens in payments collection
- **Google Maps** - Geocoding results in pickup/dropoff coordinates
- **Twilio** - SMS delivery status in notifications
- **Firebase** - Push notification tokens in user profiles

### **Real-time Features:**
- **Change Streams** for live updates
- **GridFS** for file storage (photos, documents)
- **Time Series** collections for tracking data
- **Capped Collections** for log rotation

```javascript
// Watch for booking updates
const changeStream = db.bookings.watch([
  { $match: { "fullDocument.status": "driver_assigned" } }
])

changeStream.on("change", (change) => {
  // Notify customer about driver assignment
  console.log("Driver assigned:", change.fullDocument)
})
```

## 🚀 Deployment Options

### **Cloud Providers:**
1. **MongoDB Atlas** - Fully managed MongoDB service
2. **AWS DocumentDB** - MongoDB-compatible service
3. **Google Cloud Firestore** - Alternative NoSQL option
4. **Azure Cosmos DB** - Multi-model database service

### **Self-hosted:**
```yaml
# Docker Compose for MongoDB
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    container_name: cabsy_mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
      MONGO_INITDB_DATABASE: cabsy_db
    volumes:
      - mongodb_data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro

volumes:
  mongodb_data:
```

## 🔄 Performance Monitoring

### **MongoDB Compass:**
- Visual query performance analysis
- Index usage statistics
- Real-time performance metrics
- Schema analysis and validation

### **Monitoring Queries:**
```javascript
// Check slow operations
db.runCommand({ "profile": 2, "slowms": 100 })

// View current operations
db.currentOp()

// Database statistics
db.stats()

// Collection statistics
db.bookings.stats()
```

## 📝 Development Best Practices

### **Query Optimization:**
```javascript
// Use projection to limit returned fields
db.users.find(
  { userType: "driver" },
  { firstName: 1, lastName: 1, "driverProfile.averageRating": 1 }
)

// Use indexes for sorting
db.bookings.find().sort({ bookingTime: -1 }).limit(10)

// Use aggregation for complex queries
db.bookings.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$driverId", totalEarnings: { $sum: "$fare.total" } } }
])
```

### **Data Modeling Tips:**
1. **Embed** frequently queried together data
2. **Reference** when data is accessed independently
3. **Denormalize** for read-heavy operations
4. **Normalize** for write-heavy operations

## 🆘 Troubleshooting

### **Common Issues:**
```javascript
// Fix orphaned documents
db.bookings.find({ driverId: { $nin: db.users.distinct("_id") } })

// Repair inconsistent data
db.users.updateMany(
  { "driverProfile.totalEarnings": { $exists: false } },
  { $set: { "driverProfile.totalEarnings": 0 } }
)

// Optimize queries
db.bookings.explain("executionStats").find({ customerId: ObjectId("...") })
```

Your MongoDB database is now **production-ready** with enterprise-level features! 🚀

## 📋 Table Structure Overview

### **👥 User Management (4 tables)**
- `users` - Core user accounts
- `customer_profiles` - Customer-specific data
- `driver_profiles` - Driver-specific data
- `activity_logs` - Audit trail

### **🚗 Vehicle Management (2 tables)**
- `vehicle_categories` - Car types (Economy, Premium, etc.)
- `vehicles` - Individual vehicle records

### **📱 Booking System (3 tables)**
- `bookings` - Main ride records
- `ride_tracking` - Real-time GPS tracking
- `surge_pricing` - Dynamic pricing

### **💳 Payment System (2 tables)**
- `payment_methods` - Stored payment methods
- `payments` - Transaction records

### **⭐ Rating System (1 table)**
- `ratings` - Driver/customer reviews

### **🎯 Marketing & Support (5 tables)**
- `promotions` - Discount codes
- `promotion_usage` - Coupon tracking
- `notifications` - Push/SMS notifications
- `support_tickets` - Customer support
- `support_messages` - Support chat

### **🌍 Geolocation (2 tables)**
- `service_areas` - Coverage areas
- `surge_pricing` - Location-based pricing

### **⚙️ Configuration (1 table)**
- `system_config` - App settings

## 🔄 Database Relationships

```
users (1) ──→ (1) customer_profiles
users (1) ──→ (1) driver_profiles
driver_profiles (1) ──→ (*) vehicles
customer_profiles (1) ──→ (*) bookings
driver_profiles (1) ──→ (*) bookings
bookings (1) ──→ (*) payments
bookings (1) ──→ (*) ratings
bookings (1) ──→ (*) ride_tracking
```

## 📈 Performance Optimization

### **Indexes Created:**
```sql
-- User lookups
INDEX idx_users_email (email)
INDEX idx_users_phone (phone)

-- Booking queries
INDEX idx_bookings_customer_status_time (customer_id, booking_status, booking_time)
INDEX idx_bookings_driver_status_time (driver_id, booking_status, booking_time)

-- Location-based searches
INDEX idx_driver_profiles_status_location (driver_status, current_location_lat, current_location_lng)
INDEX idx_bookings_pickup_location (pickup_lat, pickup_lng)

-- Payment tracking
INDEX idx_payments_customer_status_created (customer_id, status, created_at)
```

### **Query Optimization Tips:**
1. Use composite indexes for multi-column WHERE clauses
2. Partition large tables by date for historical data
3. Use materialized views for complex reporting
4. Consider read replicas for analytics queries

## 🔒 Security Features

### **Built-in Security:**
- ✅ **UUID Primary Keys** - No sequential ID guessing
- ✅ **Check Constraints** - Data validation at DB level
- ✅ **Foreign Key Constraints** - Referential integrity
- ✅ **Audit Logging** - Track all changes
- ✅ **Soft Deletes** - Preserve data for compliance

### **Additional Security Recommendations:**
```sql
-- Enable row-level security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for customers to see only their bookings
CREATE POLICY customer_bookings ON bookings
FOR ALL TO customer_role
USING (customer_id = current_user_id());

-- Create policy for drivers to see only their assigned rides
CREATE POLICY driver_bookings ON bookings
FOR ALL TO driver_role
USING (driver_id = current_driver_id());
```

## 📊 Sample Queries

### **Find Available Drivers:**
```sql
SELECT * FROM driver_availability 
WHERE driver_status = 'online'
AND ST_DWithin(
  ST_Point(current_location_lng, current_location_lat)::geography,
  ST_Point(-74.006, 40.7128)::geography, -- Customer location
  5000 -- 5km radius
)
ORDER BY average_rating DESC
LIMIT 10;
```

### **Customer Ride History:**
```sql
SELECT 
  b.booking_time,
  b.pickup_address,
  b.dropoff_address,
  b.total_amount,
  b.booking_status,
  du.first_name as driver_name,
  r.rating
FROM bookings b
JOIN customer_profiles cp ON b.customer_id = cp.id
LEFT JOIN driver_profiles dp ON b.driver_id = dp.id
LEFT JOIN users du ON dp.user_id = du.id
LEFT JOIN ratings r ON b.id = r.booking_id AND r.rating_type = 'customer_to_driver'
WHERE cp.user_id = $customer_user_id
ORDER BY b.booking_time DESC;
```

### **Revenue Analytics:**
```sql
SELECT 
  DATE_TRUNC('day', booking_time) as date,
  COUNT(*) as total_rides,
  SUM(total_amount) as revenue,
  AVG(total_amount) as avg_fare
FROM bookings 
WHERE booking_status = 'completed'
AND booking_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', booking_time)
ORDER BY date;
```

## 🔄 Migration Strategy

### **Version Control for Schema:**
```sql
-- migrations/001_initial_schema.sql
-- migrations/002_add_surge_pricing.sql
-- migrations/003_add_support_system.sql
```

### **Safe Migration Process:**
1. **Backup** existing data
2. **Test** migrations on staging
3. **Apply** during low-traffic hours
4. **Verify** data integrity
5. **Rollback** plan ready

## 🌐 Scaling Considerations

### **Horizontal Scaling:**
- **Read Replicas** for analytics
- **Sharding** by geography
- **Separate** payment database
- **Cache** frequently accessed data

### **Vertical Scaling:**
- **Connection Pooling** (PgBouncer)
- **Query Optimization**
- **Partitioning** large tables
- **Archive** old data

## 📱 Integration Points

### **External APIs:**
- **Stripe/PayPal** for payments (`payments` table)
- **Google Maps** for geocoding (`bookings` lat/lng)
- **Twilio** for SMS (`notifications` table)
- **Firebase** for push notifications

### **Real-time Features:**
- **WebSocket** connections for live tracking
- **Redis** for driver locations
- **Queue System** for notifications

## 🚀 Deployment Options

### **Cloud Providers:**
1. **AWS RDS PostgreSQL** - Managed database
2. **Google Cloud SQL** - Automatic backups
3. **DigitalOcean** - Cost-effective option
4. **Supabase** - PostgreSQL with real-time features

### **Self-hosted:**
- **Docker** containers for easy deployment
- **Kubernetes** for orchestration
- **Regular backups** to cloud storage

This database schema is production-ready and can handle millions of rides with proper infrastructure! 🚀
