import React, { useState } from "react";
import api from "../../api/axios"; // axios instance

function PNRStatus() {
  const [pnr, setPnr] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPNR = async () => {
    if (!pnr) return;
    setLoading(true);
    try {
      const res = await api.get(`/pnr/${pnr}`);
      setData(res.data.data); // API returns {status, data}
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch PNR status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🚆 Check PNR Status</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          placeholder="Enter PNR Number"
          className="border px-4 py-2 rounded-lg flex-grow"
        />
        <button
          onClick={fetchPNR}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {data && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg">PNR: {data.pnrNumber}</h3>
          <p>Train: {data.trainName} ({data.trainNumber})</p>
          <p>
            From {data.sourceStation} → {data.destinationStation}
          </p>
          <p>Class: {data.journeyClass}</p>
          <p>Chart Status: {data.chartStatus}</p>

          <h4 className="mt-4 font-semibold">Passengers:</h4>
          <ul className="list-disc ml-5">
            {data.passengerList.map((p) => (
              <li key={p.passengerSerialNumber}>
                Passenger {p.passengerSerialNumber}:{" "}
                <span className="font-medium">
                  {p.currentStatusDetails || p.bookingStatusDetails}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PNRStatus;
