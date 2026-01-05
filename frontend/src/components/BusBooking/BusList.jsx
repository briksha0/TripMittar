import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import BusStopsSelector from "./BusStopsSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Clock, ShieldCheck, Star, IndianRupee, Info } from "lucide-react";

const BusList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, drop, date } = location.state || {};
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pickup || !drop || !date) return;

    const fetchBuses = async () => {
      try {
        setLoading(true);
        const fromCity = pickup.name.split(",")[0].trim();
        const toCity = drop.name.split(",")[0].trim();

        const res = await api.get(
          `/api/buses/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${encodeURIComponent(date)}`
        );

        setBuses(res.data.buses || []);
      } catch (err) {
        console.error("❌ Bus search error:", err);
      } finally {
        setTimeout(() => setLoading(false), 500); // Slight delay for smoother transition
      }
    };

    fetchBuses();
  }, [pickup, drop, date]);

  if (!pickup || !drop || !date) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center bg-[#050816] min-h-screen text-gray-400">
        <Info className="w-12 h-12 mb-4 text-blue-500/50" />
        <p className="text-xl">No search parameters found.</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full text-white font-bold shadow-lg shadow-blue-900/20"
        >
          Go Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="py-24 min-h-screen bg-[#050816] px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Summary */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-xl">
               <Bus className="text-blue-500" />
             </div>
             <div>
               <h1 className="text-white font-bold text-lg">{pickup.name.split(',')[0]} to {drop.name.split(',')[0]}</h1>
               <p className="text-gray-500 text-sm">{new Date(date).toDateString()} • {buses.length} Buses found</p>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 w-full bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {buses.length > 0 ? (
                buses.map((bus, index) => (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-8 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
                  >
                    {/* Bus Image Section */}
                    <div className="relative flex-shrink-0 w-full md:w-72 h-44 overflow-hidden rounded-2xl shadow-inner">
                      <img
                        src={bus.image_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop"}
                        alt={bus.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {bus.bus_type || 'AC Premium'}
                      </div>
                    </div>

                    {/* Bus Details Section */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                              {bus.name}
                            </h2>
                            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-black">
                              <Star size={12} fill="currentColor" /> {bus.rating || '4.5'}
                            </div>
                          </div>
                          
                          {/* TIMING GRID */}
                          <div className="flex items-center gap-8 py-2">
                            <div className="text-center md:text-left">
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Departure</p>
                              <p className="text-xl text-white font-black flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" /> {bus.departure}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-center px-4">
                               <span className="text-[10px] text-gray-600 font-bold italic mb-1">{bus.duration}</span>
                               <div className="w-16 h-[1px] bg-white/10 relative">
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 border border-[#050816]" />
                               </div>
                            </div>

                            <div className="text-center md:text-left">
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Arrival</p>
                              <p className="text-xl text-white font-black">{bus.arrival}</p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Booking */}
                        <div className="flex flex-col items-end justify-between self-stretch">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium">Per Traveller</p>
                            <p className="text-4xl font-black text-white flex items-center justify-end">
                              <IndianRupee className="w-6 h-6 text-blue-500" />{bus.price}
                            </p>
                          </div>
                          <BusStopsSelector bus={bus} pickup={pickup} drop={drop} date={date} />
                        </div>
                      </div>

                      {/* Amenities footer */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          <ShieldCheck size={12} className="text-blue-500" /> GPS Tracked
                        </div>
                        {['Water', 'USB', 'WiFi', 'CCTV'].map(tag => (
                          <span key={tag} className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-24 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5"
                >
                  <Bus className="mx-auto w-16 h-16 text-gray-800 mb-6" />
                  <p className="text-gray-500 text-xl font-medium">No buses found for this route on this date.</p>
                  <p className="text-gray-700 text-sm mt-2">Try searching for a different date or city.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusList;