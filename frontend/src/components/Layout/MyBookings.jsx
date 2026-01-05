import React, { useEffect, useState } from "react";
import { fetchBookings } from "../../api/bookings";
import { useAuth } from "../../App";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Bus, Hotel, Calendar, MapPin, Receipt, Clock } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState({ cabs: [], buses: [], hotels: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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

  // --- AUTOMATED STATUS STYLING ---
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "confirmed" || s === "success" || s === "paid") 
      return "bg-green-500/10 text-green-500 border-green-500/20";
    if (s === "pending") 
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#050816]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="mt-24 pt-10 px-6 max-w-7xl mx-auto min-h-screen text-white">
      {/* 1. HEADER & SUMMARY CARDS */}
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-6 italic tracking-tighter">
          {user?.fullname ? `${user.fullname.toUpperCase()}'S TRIPS` : "MY JOURNEYS"}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Total Trips" value={bookings.buses.length + bookings.hotels.length + bookings.cabs.length} icon={<Receipt />} color="blue" />
          <SummaryCard label="Active Bookings" value={bookings.buses.filter(b => b.status === "Confirmed").length} icon={<Clock />} color="green" />
          <SummaryCard label="Total Spent" value={`₹${bookings.buses.reduce((acc, b) => acc + Number(b.price), 0)}`} icon={<Receipt />} color="purple" />
        </div>
      </header>

      {/* 2. AUTOMATED SECTION: BUSES */}
      <Section title="Bus Bookings" icon={<Bus className="text-orange-500" />} items={bookings.buses}>
        {(bus) => (
          <div className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold group-hover:text-orange-400 transition">{bus.name}</h3>
                <p className="text-gray-400 text-sm">ID: #{bus.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(bus.status)}`}>
                {bus.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} className="text-orange-500"/>
                <span>{bus.pickup} → {bus.drop}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} className="text-orange-500"/>
                <span>{new Date(bus.date).toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
               <span className="text-2xl font-black">₹{bus.price}</span>
               <button className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold transition">VIEW TICKET</button>
            </div>
          </div>
        )}
      </Section>

      {/* 3. AUTOMATED SECTION: HOTELS */}
      <Section title="Hotel Stays" icon={<Hotel className="text-purple-500" />} items={bookings.hotels}>
        {(hotel) => (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{hotel.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(hotel.status)}`}>
                {hotel.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4 font-medium flex items-center gap-2">
              <Calendar size={14}/> {new Date(hotel.checkin).toLocaleDateString()} - {new Date(hotel.checkout).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
               <span className="text-2xl font-black text-purple-400">₹{hotel.total_price}</span>
               <span className="text-xs text-gray-500 uppercase">{hotel.guests} Guests</span>
            </div>
          </>
        )}
      </Section>
    </div>
  );
};

// --- HELPER SUB-COMPONENTS ---

const SummaryCard = ({ label, value, icon, color }) => (
  <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl flex items-center gap-4">
    <div className={`p-3 rounded-2xl bg-${color}-500/20 text-${color}-500`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

const Section = ({ title, icon, items, children }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-xl border border-white/10">{icon}</div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
    {items.length === 0 ? (
      <div className="bg-white/[0.02] border border-dashed border-white/10 p-10 rounded-3xl text-center text-gray-500 italic">
        No records found in this category.
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.06] transition-all hover:border-white/20"
            >
              {children(item)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </section>
);

export default MyBookings;