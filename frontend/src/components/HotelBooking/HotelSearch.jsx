// frontend/src/components/HotelBooking/HotelSearch.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelSearch = () => {
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!city) {
      alert("⚠️ Please enter a city");
      return;
    }

    const params = new URLSearchParams({
      city,
      checkin,
      checkout,
      guests,
    });

    navigate(`/hotels/list?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-24">
      <div className="bg-gray-800 shadow-2xl p-8 rounded-2xl w-full max-w-lg text-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">🏨 Search Hotels</h1>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">City</label>
          <input
            type="text"
            placeholder="Enter city (e.g. Delhi)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Check-in */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">Check-in Date</label>
          <input
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Check-out */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">Check-out Date</label>
          <input
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            min={checkin || new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Guests */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border border-gray-600 p-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition-colors duration-300 font-semibold shadow-lg"
        >
          🔍 Search Hotels
        </button>
      </div>
    </div>
  );
};

export default HotelSearch;
