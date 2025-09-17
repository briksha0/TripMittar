// src/components/TrainBooking/TrainBooking.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrainBooking() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill all fields.");
      return;
    }
    // navigate to list with query params
    navigate("/trains/list", { state: { from, to, date } });
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">🚆 Search Trains</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From (city / station)"
              className="p-3 border rounded-lg"
            />
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To (city / station)"
              className="p-3 border rounded-lg"
            />
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="p-3 border rounded-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-md"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
