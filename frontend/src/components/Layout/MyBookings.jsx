import React, { useEffect, useState } from "react";
import { fetchBookings } from "../../api/bookings";
import { useAuth } from "../../App";
import { motion } from "framer-motion";
import { Car, Bus, Hotel } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState({ cabs: [], buses: [], hotels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        if (!user?.token) return;
        const data = await fetchBookings(user.token);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const Section = ({ title, icon, items, renderItem }) => (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No {title.toLowerCase()} bookings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="mt-24 pt-10 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-12">
        {user ? `${user.fullname}'s Bookings` : "My Bookings"}
      </h1>

      {/* 🚖 Cab Bookings */}
      <Section
        title="Cabs"
        icon={<Car className="text-green-600 w-6 h-6" />}
        items={bookings.cabs}
        renderItem={(cab) => (
          <>
            <p>
              <strong>From:</strong> {cab.pickup}
            </p>
            <p>
              <strong>To:</strong> {cab.drop}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(cab.date).toLocaleDateString()}
            </p>
            <p className="text-blue-600 font-semibold">
              Fare: ₹{cab.fare}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                cab.status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {cab.status}
            </span>
          </>
        )}
      />

      {/* 🚌 Bus Bookings */}
      <Section
        title="Buses"
        icon={<Bus className="text-orange-600 w-6 h-6" />}
        items={bookings.buses}
        renderItem={(bus) => (
          <>
            <p>
              <strong>Bus:</strong> {bus.name}
            </p>
            <p>
              <strong>From:</strong> {bus.pickup}
            </p>
            <p>
              <strong>To:</strong> {bus.drop}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(bus.date).toLocaleDateString()}
            </p>
            <p className="text-blue-600 font-semibold">
              Price: ₹{bus.price}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                bus.status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {bus.status}
            </span>
          </>
        )}
      />

      {/* 🏨 Hotel Bookings */}
      <Section
        title="Hotels"
        icon={<Hotel className="text-purple-600 w-6 h-6" />}
        items={bookings.hotels}
        renderItem={(hotel) => (
          <>
            <p>
              <strong>Hotel:</strong> {hotel.name}
            </p>
            <p>
              <strong>Check-in:</strong>{" "}
              {new Date(hotel.checkin).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {new Date(hotel.checkout).toLocaleDateString()}
            </p>
            <p>
              <strong>Guests:</strong> {hotel.guests}
            </p>
            <p className="text-blue-600 font-semibold">
              Total: ₹{hotel.total_price}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                hotel.status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {hotel.status}
            </span>
          </>
        )}
      />
    </div>
  );
};

export default MyBookings;
