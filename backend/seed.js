import { initDB, getDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  try {
    console.log("⏳ Initializing database and tables...");
    await initDB();
    const db = getDB();

    // 1. Create the bus_stops table if it doesn't exist
    console.log("🛠️ Creating bus_stops table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS bus_stops (
        id SERIAL PRIMARY KEY,
        bus_id INT REFERENCES buses(id) ON DELETE CASCADE,
        stop_name VARCHAR(100) NOT NULL,
        departure VARCHAR(20) NOT NULL,
        arrival VARCHAR(20),
        stop_order INT
      );
    `);

    // 2. Clear old data to prevent duplicates during testing
    await db.query("TRUNCATE bus_stops RESTART IDENTITY CASCADE");
    await db.query("TRUNCATE buses RESTART IDENTITY CASCADE");

    // 3. Insert Buses and get their IDs
    console.log("🚌 Inserting Buses...");
    const busResult = await db.query(`
      INSERT INTO buses (name, from_city, to_city, departure, arrival, duration, price, bus_type, image_url)
      VALUES 
      ('Zingbus Plus Electric', 'Delhi', 'Jaipur', '06:00 AM', '11:30 AM', '5h 30m', 799.00, 'Premium Electric AC', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'),
      ('IntrCity SmartBus', 'Delhi', 'Jaipur', '10:30 PM', '04:30 AM', '6h 0m', 1150.00, 'AC Sleeper (2+1)', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e')
      RETURNING id;
    `);

    const bus1Id = busResult.rows[0].id;
    const bus2Id = busResult.rows[1].id;

    // 4. Insert Stops for Bus 1 (Delhi to Jaipur)
    console.log("📍 Inserting Boarding Stops for Bus 1...");
    await db.query(`
      INSERT INTO bus_stops (bus_id, stop_name, departure, stop_order)
      VALUES 
      ($1, 'Kashmere Gate ISBT', '06:00 AM', 1),
      ($1, 'Dhaula Kuan', '06:45 AM', 2),
      ($1, 'IFFCO Chowk (Gurgaon)', '07:15 AM', 3);
    `, [bus1Id]);

    // 5. Insert Stops for Bus 2 (Delhi to Jaipur)
    console.log("📍 Inserting Boarding Stops for Bus 2...");
    await db.query(`
      INSERT INTO bus_stops (bus_id, stop_name, departure, stop_order)
      VALUES 
      ($1, 'Majnu Ka Tila', '10:30 PM', 1),
      ($1, 'RK Ashram Metro', '11:00 PM', 2);
    `, [bus2Id]);

    // ... after inserting the Delhi-Jaipur buses

    // 6. Insert Agra to Noida Buses
    console.log("🚌 Inserting Agra to Noida Buses...");
    const agraNoidaResult = await db.query(`
      INSERT INTO buses (name, from_city, to_city, departure, arrival, duration, price, bus_type, image_url)
      VALUES 
      ('Yamuna Express Volvo', 'Agra', 'Noida', '07:00 AM', '09:30 AM', '2h 30m', 450.00, 'AC Seater', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'),
      ('UPSRTC Janrath', 'Agra', 'Noida', '02:00 PM', '05:00 PM', '3h 0m', 380.00, 'AC Seater', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e')
      RETURNING id;
    `);

    const busAgra1Id = agraNoidaResult.rows[0].id;
    const busAgra2Id = agraNoidaResult.rows[1].id;

    // 7. Insert Boarding Stops for Agra to Noida (Bus 1)
    console.log("📍 Inserting Boarding Stops for Agra...");
    await db.query(`
      INSERT INTO bus_stops (bus_id, stop_name, departure, stop_order)
      VALUES 
      ($1, 'ISBT Agra', '07:00 AM', 1),
      ($1, 'Water Tank (Agra)', '07:15 AM', 2),
      ($1, 'Khandari Crossing', '07:30 AM', 3);
    `, [busAgra1Id]);

    // 8. Insert Boarding Stops for Agra to Noida (Bus 2)
    await db.query(`
      INSERT INTO bus_stops (bus_id, stop_name, departure, stop_order)
      VALUES 
      ($1, 'Etmadpur', '02:00 PM', 1),
      ($1, 'Kuberpur Cut (Yamuna Exp)', '02:30 PM', 2);
    `, [busAgra2Id]);

    console.log("✅ Agra to Noida route seeded successfully!");

    // ... after bus seeding logic

    console.log("🏨 Seeding Hotels...");
        
    // Clear old hotels
    await db.query("TRUNCATE hotels RESTART IDENTITY CASCADE");
        
    await db.query(`
      INSERT INTO hotels (name, city, address, price_per_night, rating, image_url, amenities, description)
      VALUES 
      (
        'The Radisson Blu Plaza', 
        'Delhi', 
        'Near IGI Airport, Mahipalpur', 
        8500.00, 
        4.8, 
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000', 
        '["Free WiFi", "Swimming Pool", "Spa", "Airport Shuttle"]',
        'Experience world-class luxury near the heart of Delhi.'
      ),
      (
        'Hotel Bloom Residency', 
        'Delhi', 
        'Paharganj, New Delhi', 
        2200.00, 
        4.2, 
        'https://images.unsplash.com/photo-1551882547-ff43c63faf7c?q=80&w=1000', 
        '["Free WiFi", "Cafeteria", "AC Rooms"]',
        'Budget-friendly stay with modern amenities in central Delhi.'
      ),
      (
        'The Oberoi Amarvilas', 
        'Agra', 
        'Taj East Gate Road, Agra', 
        25000.00, 
        5.0, 
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000', 
        '["Taj Mahal View", "Luxury Spa", "Fine Dining", "Bar"]',
        'A breathtaking stay where every room offers a view of the Taj Mahal.'
      ),
      (
        'Crystal Sarovar Premiere', 
        'Agra', 
        'Fatehabad Road, Agra', 
        4500.00, 
        4.4, 
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000', 
        '["Rooftop Pool", "Free Parking", "Buffet Breakfast"]',
        'Modern hotel located close to major historical landmarks.'
      );
    `);
    
    console.log("✅ Hotels seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();