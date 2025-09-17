import React, { useState, useEffect } from "react";
import { useAuth } from "../../App";
import { Navigate, useNavigate } from "react-router-dom";
import { FlightResults } from "./FlightResults";
import { motion, AnimatePresence } from "framer-motion";

function Profile() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signout(() => {
      navigate("/signin");
    });
  };

  if (!user) {
    return <Navigate to="/signin" />;
  }

  // 🔄 Background image slider
  const images = [
    "https://i.pinimg.com/1200x/df/21/df/df21df0911a3a0340e2fd40eff1a77bc.jpg",
    "https://i.pinimg.com/1200x/a1/4b/79/a14b79f87835ca0cb2612492f8527bc3.jpg",
    "https://i.pinimg.com/1200x/78/f9/ed/78f9ed338f89924298eaefa29b4918c9.jpg",
    "https://i.pinimg.com/1200x/0e/8a/d3/0e8ad3af2a6da01e905e1c3ebe092e96.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="mt-14 relative min-h-screen overflow-hidden">
      {/* 🔄 Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* ✨ Main Content */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center text-white px-6">
        {/* 🛫 Animated Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        Welcome, <i>{user.fullname}</i>

        </motion.h1>

        {/* Logout button */}
        <motion.button
          onClick={handleLogout}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>

        {/* ⬇️ Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 animate-bounce text-blue-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ↓ Explore Flights
        </motion.div>
      </div>

      {/* ✈️ Flight Search Section */}
      <div className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 p-8 rounded-t-3xl shadow-lg -mt-20 z-10">
        <h3 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Search & Book Your Flight
        </h3>
        <FlightResults />
      </div>
    </div>
  );
}

export default Profile;
