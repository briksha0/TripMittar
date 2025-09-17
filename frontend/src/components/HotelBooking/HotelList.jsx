// frontend/src/components/HotelBooking/HotelList.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const HotelList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const city = queryParams.get("city") || "";
  const checkin = queryParams.get("checkin") || "";
  const checkout = queryParams.get("checkout") || "";
  const guests = queryParams.get("guests") || 1;

  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) return;

    const fetchHotels = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hotels?city=${encodeURIComponent(city)}`
        );
        setHotels(res.data.hotels || []);
      } catch (err) {
        console.error("Hotel fetch failed:", err);
        setError(err.response?.data?.message || "❌ Could not fetch hotels");
      }
    };

    fetchHotels();
  }, [city]);

  // ✅ Save search context in sessionStorage
  useEffect(() => {
    const searchData = { city, checkin, checkout, guests };
    sessionStorage.setItem("lastHotelSearch", JSON.stringify(searchData));
  }, [city, checkin, checkout, guests]);

  const handleBooking = (hotel) => {
    const bookingData = { hotel, checkin, checkout, guests };

    // ✅ Persist booking before navigating
    sessionStorage.setItem("pendingHotelBooking", JSON.stringify(bookingData));

    navigate("/hotels/payment", { state: bookingData });
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        🏨 Hotels in {city ? city : "Unknown City"}
      </h1>

      {/* Search Summary */}
      <div className="bg-gray-800 shadow-md rounded-xl p-4 mb-6 border border-gray-700">
        <p className="text-gray-300">
          📅 <strong>Check-in:</strong> {checkin || "N/A"} →{" "}
          <strong>Check-out:</strong> {checkout || "N/A"}
        </p>
        <p className="text-gray-300">👥 Guests: {guests}</p>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {hotels.length === 0 ? (
        <p className="text-gray-400">No hotels found for this city.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
            >
              {/* Hotel Image */}
              {hotel.image_url && (
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold text-blue-400">
                  {hotel.name}
                </h2>
                <p className="text-gray-300">{hotel.city}</p>
                {hotel.address && (
                  <p className="text-sm text-gray-400 mt-1">{hotel.address}</p>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-400">
                    💰 ₹{hotel.price_per_night} / night
                  </p>
                  <p className="text-gray-400 font-medium">⭐ {hotel.rating}</p>
                </div>

                <button
                  onClick={() => handleBooking(hotel)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-500 transition-colors duration-300 font-semibold shadow-md"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
