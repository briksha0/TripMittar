import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FlightResults = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const fetchFlights = async () => {
    if (!dep || !arr || !date) {
      setError("Please enter departure, arrival and date.");
      return;
    }

    setLoading(true);
    setError(null);
    setFlights([]);

    const cacheKey = `${dep}-${arr}-${date}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setFlights(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${dep}&arr_iata=${arr}&flight_date=${date}`
    );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.data?.length > 0) {
        setFlights(data.data);
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
      } else {
        setError("No flights found for the selected date.");
      }
    } catch (err) {
      console.error("API error:", err.message);

      // Mock fallback
      setFlights([
        {
          airline: { name: "Mock Airways" },
          flight: { iata: "MK101", number: "101" },
          flight_status: "scheduled",
          departure: {
            airport: "Test Departure Airport",
            iata: dep,
            scheduled: `${date}T09:00:00Z`,
          },
          arrival: {
            airport: "Test Arrival Airport",
            iata: arr,
            scheduled: `${date}T12:00:00Z`,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (flight) => {
    navigate(`/flights/${flight.flight.iata}`, { state: { flight } });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-lg">
  {/* Search form */}
  <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
    <input
      type="text"
      placeholder="Departure IATA (e.g. BLR)"
      value={dep}
      onChange={(e) => setDep(e.target.value.toUpperCase())}
      className="text-gray-200 border border-gray-700 focus:ring-2 focus:ring-teal-400 p-2 rounded-lg w-full md:w-1/4 bg-gray-800"
    />
    <input
      type="text"
      placeholder="Arrival IATA (e.g. DMK)"
      value={arr}
      onChange={(e) => setArr(e.target.value.toUpperCase())}
      className="text-gray-200 border border-gray-700 focus:ring-2 focus:ring-teal-400 p-2 rounded-lg w-full md:w-1/4 bg-gray-800"
    />
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="text-gray-200 border border-gray-700 focus:ring-2 focus:ring-teal-400 p-2 rounded-lg w-full md:w-1/4 bg-gray-800"
    />
    <button
      onClick={fetchFlights}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition"
    >
      {loading ? "Searching..." : "Search Flights"}
    </button>
  </div>

  {/* States */}
  {loading && <p className="text-center text-teal-300">Loading flights...</p>}
  {error && <p className="text-center text-red-400">{error}</p>}

  {/* Flight cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {flights.length > 0 ? (
      flights.map((flight) => (
        <div
          key={flight.flight.iata + flight.flight.number}
          onClick={() => handleCardClick(flight)}
          className="bg-gray-800 text-gray-200 shadow-lg rounded-2xl p-5 border border-gray-700 cursor-pointer hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold mb-2">
            {flight.airline?.name || "Unknown Airline"}{" "}
            <span className="text-purple-400">
              ({flight.flight?.iata || "N/A"})
            </span>
          </h2>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              flight.flight_status === "scheduled"
                ? "bg-yellow-300 text-yellow-900"
                : flight.flight_status === "active"
                ? "bg-green-400 text-green-900"
                : flight.flight_status === "landed"
                ? "bg-purple-300 text-purple-900"
                : "bg-gray-600 text-gray-200"
            }`}
          >
            {flight.flight_status}
          </span>

          <div className="mt-3">
            <h3 className="font-semibold">Departure</h3>
            <p>
              {flight.departure?.airport} ({flight.departure?.iata})
            </p>
            <p className="text-sm text-gray-400">
              {flight.departure?.scheduled
                ? new Date(flight.departure.scheduled).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="mt-3">
            <h3 className="font-semibold">Arrival</h3>
            <p>
              {flight.arrival?.airport} ({flight.arrival?.iata})
            </p>
            <p className="text-sm text-gray-400">
              {flight.arrival?.scheduled
                ? new Date(flight.arrival.scheduled).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      ))
    ) : (
      !loading &&
      !error && (
        <p className="col-span-full text-center text-gray-500">
          🔎 Enter details and search to see available flights.
        </p>
      )
    )}
  </div>
</div>

  );
};
