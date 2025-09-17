import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "./useBookingStore";
import { useAuth } from "../../App";
import R from "../../assets/cars/R.jpg";
import Innova from "../../assets/cars/Innova.jpg";
import Toyota from "../../assets/cars/Toyota-Etio.jpg";

// Cab options
const cabOptions = [
  { id: 1, name: "Sedan", image: R, pricePerKm: 12, description: "Comfortable 4-seater, ideal for city rides" },
  { id: 2, name: "SUV", image: Innova, pricePerKm: 16, description: "Spacious SUV, great for families & luggage" },
  { id: 3, name: "Luxury", image: Toyota, pricePerKm: 25, description: "Premium comfort for a luxury experience" },
];

// Calculate distance (Google Maps Distance Matrix)
const calculateDistance = async (pickup, drop) => {
  if (!window.google || !window.google.maps) return null;
  const service = new window.google.maps.DistanceMatrixService();
  const result = await new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      { origins: [pickup?.formatted_address || pickup?.name], destinations: [drop?.formatted_address || drop?.name], travelMode: window.google.maps.TravelMode.DRIVING },
      (response, status) => (status === "OK" ? resolve(response) : reject(status))
    );
  });
  return result.rows[0].elements[0].distance.value / 1000; // km
};

const CarsPage = () => {
  const { pickup, drop } = useBookingStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);

  useEffect(() => {
    if (!pickup || !drop) return navigate("/");
    calculateDistance(pickup, drop).then((km) => km && setDistance(km));
  }, [pickup, drop, navigate]);

  if (!pickup || !drop) return null;

  const handleBookCab = (cab) => {
    const totalFare = Math.round(cab.pricePerKm * distance || 10);
    navigate("/cab/payment", { state: { cab, pickup, drop, distance, totalFare } });
  };

  return (
    <div className=" min-h-screen p-24 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
        🚖 Choose Your Cab
      </h1>

      {/* Trip Details */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📍 Trip Details</h2>
        <p className="text-gray-700 dark:text-gray-400"><strong>Pickup:</strong> {pickup.formatted_address || pickup.name}</p>
        <p className="text-gray-700 dark:text-gray-400"><strong>Drop:</strong> {drop.formatted_address || drop.name}</p>
        {distance && <p className="text-gray-700 dark:text-gray-400 mt-2"><strong>Distance:</strong> {distance.toFixed(1)} km</p>}
      </div>

      {/* Cab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cabOptions.map((cab) => (
          <div
            key={cab.id}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="bg-gray-100 dark:bg-gray-700 flex justify-center items-center p-4">
              <img src={cab.image} alt={cab.name} className="w-56 h-36 object-contain" />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cab.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{cab.description}</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">💰 ₹{cab.pricePerKm} / km</p>
              <button
                onClick={() => { setSelectedCab(cab); handleBookCab(cab); }}
                className={`mt-4 w-full py-2 rounded-xl font-medium shadow-md text-white
                  ${selectedCab?.id === cab.id ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} transition`}
                disabled={loading && selectedCab?.id === cab.id}
              >
                {loading && selectedCab?.id === cab.id ? "Processing..." : `Book ${cab.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsPage;
