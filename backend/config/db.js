import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool, Client } = pkg;

// ✅ EXPORT pool
export let pool;

/* ================= INIT DB ================= */
export async function initDB() {
  if (!pool) {
    try {
      const dbHost = process.env.DB_HOST || "localhost";
      const dbUser = process.env.DB_USER || "postgres";
      const dbPass = process.env.DB_PASS || "root"; // matches your .env
      const dbName = process.env.DB_NAME || "tripmantr_postgresql_name";
      const dbPort = process.env.DB_PORT || 5432;

      /* 1️⃣ Ensure database exists (Connecting to default 'postgres' db first) */
      const adminClient = new Client({
        host: dbHost,
        user: dbUser,
        password: dbPass,
        database: "postgres",
        port: dbPort,
        // SSL is usually required for hosted DBs like Render/Neon
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });

      await adminClient.connect();

      const checkDB = await adminClient.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );

      if (checkDB.rowCount === 0) {
        // Warning: identifiers like dbName cannot be parameterized in CREATE DATABASE
        await adminClient.query(`CREATE DATABASE ${dbName}`);
        console.log("✅ Database created:", dbName);
      }
      await adminClient.end();

      /* 2️⃣ Create Connection Pool */
      pool = new Pool({
        host: dbHost,
        user: dbUser,
        password: dbPass,
        database: dbName,
        port: dbPort,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });

      await pool.query("SELECT 1");
      console.log(`✅ PostgreSQL Connected to: ${dbName}`);

      /* 3️⃣ Tables Initialization */
      // Users Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          fullname VARCHAR(150),
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(150) UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Hotels Table
      await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address TEXT,
        price_per_night NUMERIC(10,2) NOT NULL,
        rating NUMERIC(2,1) DEFAULT 4.0,
        image_url TEXT,
        amenities JSONB, -- Stores ['WiFi', 'Pool', 'Breakfast']
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

      // Hotel Bookings Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS hotel_bookings (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
          checkin DATE NOT NULL,
          checkout DATE NOT NULL,
          guests INT DEFAULT 1,
          total_price NUMERIC(10,2),
          status VARCHAR(50) DEFAULT 'CONFIRMED',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Payments Table (Optimized for Automation)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          booking_id INT,                  -- Links to the bookings table
          user_id INT REFERENCES users(id), -- Links to the person who paid
          payment_id VARCHAR(255) UNIQUE NOT NULL, -- Razorpay Payment ID
          order_id VARCHAR(255) NOT NULL,   -- Razorpay Order ID
          amount NUMERIC(10,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'INR',
          status VARCHAR(50) DEFAULT 'PENDING', -- SUCCESS, FAILED, REFUNDED
          method VARCHAR(50),               -- upi, card, netbanking
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Buses Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS buses (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          from_city VARCHAR(100) NOT NULL,
          to_city VARCHAR(100) NOT NULL,
          departure VARCHAR(20) NOT NULL,    -- Changed to VARCHAR for easier "06:00 AM" format
          arrival VARCHAR(20) NOT NULL,      -- Changed to VARCHAR
          duration VARCHAR(50),              -- e.g., "5h 30m"
          price NUMERIC(10,2) NOT NULL,
          bus_type VARCHAR(50) DEFAULT 'AC Sleeper', -- e.g., 'EV Premium', 'Non-AC'
          image_url TEXT,                    -- To store the bus image link
          available_seats INT DEFAULT 30,    -- To track booking capacity
          rating NUMERIC(2,1) DEFAULT 4.0,   -- Bus rating (e.g., 4.5)
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log("✅ Database schema verified/updated");
    } catch (err) {
      console.error("❌ PostgreSQL init failed:", err.message);
      // Don't kill the process in dev mode so you can see the error logs
      if (process.env.NODE_ENV === "production") process.exit(1);
    }
  }
  return pool;
}

/* ================= GET DB ================= */
export function getDB() {
  if (!pool) {
    throw new Error("⚠️ Database not initialized. Call initDB() first.");
  }
  return pool;
}
