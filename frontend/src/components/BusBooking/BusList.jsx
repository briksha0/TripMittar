// components/BusBooking/BusSchedule.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BusStopsSelector from "./BusStopsSelector";

const BusSchedule = () => {
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

        const res = await axios.get(
          `/api/buses/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${encodeURIComponent(date)}`
        );

        setBuses(res.data.buses || []);
      } catch (err) {
        console.error("Bus search error:", err);
        alert("❌ Failed to fetch buses");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [pickup, drop, date]);

  if (!pickup || !drop || !date) {
    return <p className=" pt-24 text-center text-gray-400">⚠️ Please search for buses first.</p>;
  }

  return (
    <div className="py-24 space-y-6 bg-gray-800 min-h-screen p-4">
      {buses.map((bus) => (
        <div
          key={bus.id}
          className="bg-gray-700 p-4 rounded-2xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
        >
          {/* Bus Image */}
          <div className="flex-shrink-0">
            <img
              src="https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/9600_15m_sleeper_FR_01a_hires-nbg?qlt=82&wid=1920&ts=1659609410809&dpr=off&fit=constrain"
              alt={bus.name}
              className="w-full md:w-48 rounded-xl object-cover filter brightness-95 hover:brightness-110 transition duration-300"
            />
          </div>

          {/* Bus Info */}
          <div className="flex-1 w-full text-gray-100">
            <div className="flex justify-between items-start md:items-center">
              <div>
                <h2 className="font-semibold text-lg hover:text-blue-400 transition-colors duration-300">
                  {bus.name}
                </h2>
                <p className="text-sm text-gray-300 mt-1 hover:text-gray-100 transition-colors duration-300">
                  Departure: {bus.departure} <br/>
                  Arrival: {bus.arrival} Duration: {bus.duration}
                </p>
              </div>

              {/* Select boarding stop */}
              <BusStopsSelector bus={bus} pickup={pickup} drop={drop} date={date}  />
            </div>
            <p className="mt-3 text-xl font-bold text-white transition-colors duration-300">
              ₹{bus.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusSchedule;
