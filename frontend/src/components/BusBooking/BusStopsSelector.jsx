// components/BusBooking/BusStopsSelector.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BusStopsSelector = ({ bus, pickup, drop, date }) => {
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/buses/${bus.id}/stops`);
        setStops(res.data.stops || []);
      } catch (err) {
        console.error("Stops fetch error:", err);
      }
    };
    fetchStops();
  }, [bus.id]);

  const handleBook = () => {
    if (!selectedStop) {
      alert("⚠️ Please select a boarding stop");
      return;
    }

    const bookingData = { bus, pickup, drop, date, boardingStop: selectedStop };

    // ✅ Save once for persistence
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    navigate("/buses/payment", { state: bookingData });
  };

  return (
    <div className="mt-3 w-full">
      <label className="block text-sm font-medium mb-2 text-gray-200">
        🚌 Select Boarding Stop
      </label>
      <select
        value={selectedStop}
        onChange={(e) => setSelectedStop(e.target.value)}
        className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="" className="bg-gray-800 text-gray-100">
          -- Choose Stop --
        </option>
        {stops.map((stop) => (
          <option
            key={stop.id}
            value={stop.stop_name}
            className="bg-gray-800 text-gray-100 hover:bg-gray-700"
          >
            {stop.stop_name} (Dep: {stop.departure})
          </option>
        ))}
      </select>

      <button
        onClick={handleBook}
        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Book from {selectedStop || "Stop"}
      </button>
    </div>
  );
};

export default BusStopsSelector;
