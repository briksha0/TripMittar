import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // ✅ Use centralized axios config
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";

const BusStopsSelector = ({ bus, pickup, drop, date }) => {
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStops = async () => {
      if (!bus?.id) return;
      try {
        setLoading(true);
        // Using the internal API instance handles the base URL automatically
        const res = await api.get(`/api/buses/${bus.id}/stops`);
        setStops(res.data.stops || []);
      } catch (err) {
        console.error("❌ Stops fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, [bus.id]);

  const handleBook = () => {
    if (!selectedStop) {
      alert("⚠️ Please select a boarding stop to proceed.");
      return;
    }

    const bookingData = { 
      bus, 
      pickup, 
      drop, 
      date, 
      boardingStop: selectedStop,
      totalAmount: bus.price 
    };

    // Save for persistence in case of page refresh
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    // Navigate to payment page
    navigate("/buses/payment", { state: bookingData });
  };

  return (
    <div className="mt-4 w-full space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
        <MapPin size={14} className="text-blue-500" />
        Boarding Point
      </div>

      <div className="relative">
        <select
          value={selectedStop}
          onChange={(e) => setSelectedStop(e.target.value)}
          disabled={loading}
          className="w-full appearance-none border border-white/10 bg-white/5 text-gray-100 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer disabled:opacity-50"
        >
          <option value="" className="bg-[#0a0f1e] text-gray-400">
            {loading ? "Loading stops..." : "-- Choose Boarding Point --"}
          </option>
          {stops.map((stop) => (
            <option
              key={stop.id}
              value={stop.stop_name}
              className="bg-[#0a0f1e] text-gray-100"
            >
              {stop.stop_name} — {stop.departure}
            </option>
          ))}
        </select>
        
        {/* Custom Dropdown Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={!selectedStop || loading}
        className="group relative w-full overflow-hidden px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
      >
        <span className="relative z-10">
          {selectedStop ? `Book from ${selectedStop}` : "Select a Stop"}
        </span>
        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
};

export default BusStopsSelector;