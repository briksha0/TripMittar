import mysql from "mysql2/promise";

let pool;

export async function initDB() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST ,
        user: process.env.DB_USER ,
        password: process.env.DB_PASS ,
        database: process.env.DB_NAME ,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Create DB if not exists (use single connection first)
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS mydb`);
      await connection.end();

      console.log("✅ Database connected & ensured");

      // Run migrations (tables)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS hotels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          address VARCHAR(255),
          price_per_night DECIMAL(10,2),
          rating DECIMAL(2,1),
          image_url VARCHAR(255)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS hotel_bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          hotel_id INT NOT NULL,
          checkin DATE,
          checkout DATE,
          guests INT,
          total_price DECIMAL(10,2),
          status VARCHAR(50) DEFAULT 'CONFIRMED',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS buses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          from_city VARCHAR(100) NOT NULL,
          to_city VARCHAR(100) NOT NULL,
          departure TIME NOT NULL,
          arrival TIME NOT NULL,
          duration VARCHAR(50),
          price DECIMAL(10,2) NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS bus_stops (
          id INT AUTO_INCREMENT PRIMARY KEY,
          bus_id INT NOT NULL,
          stop_name VARCHAR(150) NOT NULL,
          arrival TIME,
          departure TIME,
          FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
        );
      `);

      console.log("✅ Tables ensured");
    } catch (err) {
      console.error("❌ Database initialization failed:", err.message);
      process.exit(1);
    }
  }
  return pool;
}

export function getDB() {
  if (!pool) throw new Error("⚠️ Database not initialized. Call initDB() first.");
  return pool;
}
