import React, { useState, useEffect } from "react";
import { FlightResults } from "./FlightResults";
import { motion, AnimatePresence } from "framer-motion";

// 🔄 Reusable Card
const Card = ({ children, className }) => (
  <motion.div
    className={`rounded-2xl shadow-md bg-white dark:bg-gray-800 p-6 text-gray-800 dark:text-white ${className}`}
    whileHover={{ scale: 1.03 }}
  >
    {children}
  </motion.div>
);

export const FlightHome = () => {
  const images = [
    "https://upload.wikimedia.org/wikipedia/commons/0/09/A6-EDY_A380_Emirates_31_jan_2013_jfk_%288442269364%29_%28cropped%29.jpg",
    "https://i.pinimg.com/1200x/4e/6b/e2/4e6be22ce7ac9546f877557775b5e9de.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8c/Airbus_A220-300.jpg",
  ];
  const [current, setCurrent] = useState(0);

  // ⏳ Hero image slider
  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  // ✈️ Flight session persistence
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("lastFlightSearch");
    if (savedSearch) {
      console.log("🔄 Restored flight search from session:", JSON.parse(savedSearch));
      // 👉 You can pass this to <FlightResults /> via props or store
    }
  }, []);

  const handleSearchSave = (searchData) => {
    sessionStorage.setItem("lastFlightSearch", JSON.stringify(searchData));
    console.log("✅ Flight search saved:", searchData);
  };

  const tips = [
    { icon: "🛄", title: "Baggage", text: "Carry-on 7kg | Check-in 20kg." },
    { icon: "🕑", title: "Check-in", text: "2 hrs before domestic, 3 hrs before international." },
    { icon: "🛡️", title: "Safety", text: "Wear your seatbelt & follow crew instructions." },
  ];

  const features = [
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/F-35A_flight_%28cropped%29.jpg/800px-F-35A_flight_%28cropped%29.jpg",
      title: "Modern Aircraft",
      desc: "Latest fleet designed for smooth journeys.",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Aeroport_Houari_Boumediene_IMG_1374.JPG/800px-Aeroport_Houari_Boumediene_IMG_1374.JPG",
      title: "Global Airports",
      desc: "Connected to world-class airports with top facilities.",
    },
    {
      img: "https://www.faa.gov/sites/faa.gov/files/inline-images/runway_sunset.jpg",
      title: "Safe Runways",
      desc: "Strict safety standards for all takeoffs & landings.",
    },
    {
      img: "https://www.flydubai.com/en/media/Business-class-service-max-972x480_tcm8-155237_w971.jpg",
      title: "Onboard Comfort",
      desc: "Premium meals, Wi-Fi & entertainment.",
    },
  ];

  const testimonials = [
    { name: "Sarah M.", text: "Booking with TripMittar was so easy!" },
    { name: "David K.", text: "Amazing service and very comfortable." },
    { name: "Emma L.", text: "Smooth booking flow and great prices!" },
  ];

  return (
    <div className="font-sans bg-gradient-to-br from-gray-900 to-gray-800 text-blue-400">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 bg-cover bg-center rounded-b-3xl"
            style={{ backgroundImage: `url(${images[current]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 rounded-b-3xl" />
        <div className="relative z-10 px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-400"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Your Journey Begins Here ✈️
          </motion.h1>
          <p className="mb-6 text-lg md:text-xl text-blue-300">
            Discover affordable flights with <b className="text-blue-200">TripMittar Airlines</b>.
          </p>
          <motion.a
            href="#search"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium shadow-lg transition text-white"
            whileHover={{ scale: 1.05 }}
          >
            Start Booking
          </motion.a>
        </div>
      </section>

      {/* Search Flights */}
      <main id="search" className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-blue-400">
          Search & Book Flights
        </h3>
        <Card>
          {/* ⬇️ Pass session persistence handler */}
          <FlightResults onSearchSave={handleSearchSave} />
        </Card>
      </main>

      {/* Tips */}
      <section className="py-16 bg-gray-800">
        <h3 className="text-3xl font-semibold text-center mb-12 text-blue-400">
          Travel Guidelines
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {tips.map((t, i) => (
            <Card key={i} className="bg-gray-700 hover:bg-gray-600 transition">
              <h4 className="font-bold mb-2 text-blue-300">
                {t.icon} {t.title}
              </h4>
              <p className="text-blue-200 text-sm">{t.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h3 className="text-3xl font-semibold text-center mb-12 text-blue-400">
          Flights & Airports
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {features.map((f, i) => (
            <Card
              key={i}
              className="p-0 overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6 bg-gray-800">
                <h4 className="font-bold mb-2 text-blue-300">{f.title}</h4>
                <p className="text-blue-200 text-sm">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-800">
        <h3 className="text-3xl font-semibold text-center mb-12 text-blue-400">
          What Our Travelers Say
        </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="italic bg-gray-700 hover:bg-gray-600 transition"
            >
              <p className="mb-4 text-blue-200">“{t.text}”</p>
              <h5 className="font-semibold not-italic text-blue-300">
                {t.name}
              </h5>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-16">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Plan Your Next Adventure
        </h3>
        <p className="mb-6 text-blue-100">
          Find destinations, deals, and fly with comfort.
        </p>
        <a
          href="#search"
          className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Search Flights
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-blue-300 py-6 text-center">
        © {new Date().getFullYear()} TripMittar Airlines ·{" "}
        <a href="#" className="hover:text-white">
          Privacy
        </a>
      </footer>
    </div>
  );
};
