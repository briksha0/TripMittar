// src/components/TrainBooking/TrainList.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TrainList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date } = location.state || {};
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!from || !to || !date) return;
    const fetchTrains = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}&date=${encodeURIComponent(date)}`
        );
        setTrains(res.data.trains || []);
      } catch (err) {
        console.error("Search error:", err);
        alert("Failed to fetch trains. (Check server)");
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, [from, to, date]);

  if (!from || !to || !date) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-center">No search criteria provided. Please search trains first.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Trains from {from} → {to} on {new Date(date).toLocaleDateString()}
        </h1>

        {loading ? (
          <p>Loading trains...</p>
        ) : trains.length === 0 ? (
          <p>No trains found.</p>
        ) : (
          <div className="grid gap-4">
            {trains.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">{t.name} ({t.number})</h2>
                  <p className="text-sm text-gray-600">
                    Dep: {t.departure} · Arr: {t.arrival} · Duration: {t.duration}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Classes: {t.classes.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{t.price}</p>
                  <button
                    onClick={() =>
                      navigate("/trains/payment", { state: { train: t, from, to, date } })
                    }
                    className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
