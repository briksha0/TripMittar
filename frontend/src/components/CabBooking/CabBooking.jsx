import React from "react";
import { MapPin, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "./useBookingStore";
import LocationSearch from "../Map/LocationSearch";

const CabBooking = () => {
  const { pickup, drop, setPickup, setDrop } = useBookingStore();
  const navigate = useNavigate();

  const handleSwap = () => {
    if (!pickup && !drop) return;
    const oldPickup = pickup;
    setPickup(drop);
    setDrop(oldPickup);
  };

  const handleBooking = () => {
    if (!pickup || !drop) {
      alert("⚠️ Please select both pickup and drop locations");
      return;
    }
    navigate("/cabs", { state: { pickup, drop } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
                    p-6">
      <div className="max-w-lg w-full backdrop-blur-md bg-white/80 dark:bg-gray-800/80
                      rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          🚖 Cab Booking
        </h1>

        {/* Pickup */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Pickup Location
          </label>
          <div className="flex text-white items-center gap-2 border border-gray-300 dark:border-gray-600 
                          rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400">
            <MapPin className="text-blue-600" />
            <LocationSearch
              placeholder="Enter Pickup Location"
              defaultValue={pickup?.name || ""}
              onSelect={(place) => setPickup(place)}
            />
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 bg-blue-500
                       text-white rounded-full shadow-lg hover:from-blue-600 hover:to-pink-600
                       transition transform hover:scale-105 active:scale-95"
            aria-label="Swap pickup and drop"
          >
            <ArrowUpDown size={20} />
          </button>
        </div>

        {/* Drop */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Drop Location
          </label>
          <div className="flex text-white items-center gap-2 border border-gray-300 dark:border-gray-600 
                          rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-400">
            <MapPin className="text-green-600" />
            <LocationSearch
              placeholder="Enter Drop Location"
              defaultValue={drop?.name || ""}
              onSelect={(place) => setDrop(place)}
            />
          </div>
        </div>

        {/* Book CTA */}
        <button
          onClick={handleBooking}
          className="w-full py-3 rounded-2xl shadow-xl text-white
                     bg-blue-600
                     hover:from-blue-800 hover:via-purple-600 hover:to-blue-800
                     transition transform hover:scale-105 active:scale-95"
        >
          🚀 Book Cab Now
        </button>
      </div>
    </div>
  );
};

export default CabBooking;
