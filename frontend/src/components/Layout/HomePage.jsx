import { Link } from "react-router-dom";
import { Plane, Car, Hotel, Bus, Train } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const services = [
    {
      name: "Flight Booking",
      description:
        "Book domestic and international flights at the best prices with real-time availability.",
      icon: (
        <Plane className="h-10 w-10 text-blue-500 group-hover:text-blue-400 transition-colors" />
      ),
      link: "/flightpage",
    },
    {
      name: "Cab Booking",
      description:
        "Find affordable and reliable cab rides with flexible pickup & drop options.",
      icon: (
        <Car className="h-10 w-10 text-green-500 group-hover:text-green-400 transition-colors" />
      ),
      link: "/cabbooking",
    },
    {
      name: "Hotel Booking",
      description:
        "Stay at the best hotels across the globe with exclusive deals and discounts.",
      icon: (
        <Hotel className="h-10 w-10 text-purple-500 group-hover:text-purple-400 transition-colors" />
      ),
      link: "/hotels",
    },
    {
      name: "Bus Booking",
      description:
        "Book comfortable bus tickets for intercity and intracity travel with ease.",
      icon: (
        <Bus className="h-10 w-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
      ),
      link: "/busbooking",
    },
    {
      name: "Train Booking",
      description:
        "Plan your railway journey with quick train ticket booking and live updates.",
      icon: (
        <Train className="h-10 w-10 text-red-500 group-hover:text-red-400 transition-colors" />
      ),
      link: "/trainbooking",
    },
  ];

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section
        className="relative text-center py-32 px-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?travel,airplane')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mt-24 text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            TripMittar –{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
              Your Travel Companion
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            One-stop solution for flights, cabs, hotels, buses, and trains.  
            Experience seamless bookings with unbeatable deals.
          </p>
          <Link
            to="/flightpage"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 animate-pulse"
          >
            Start Your Journey ✈️
          </Link>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-16">
          🌍 Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="group backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                {service.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-3">
                {service.description}
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  to={service.link}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-7 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Why Choose TripMittar?
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-gray-100">
            At TripMittar, we aim to make your journeys stress-free and enjoyable.  
            Whether you’re planning a family vacation, a quick city ride, or a long-distance train journey,  
            our platform brings everything to one place with trusted services, secure payments,  
            and 24/7 customer support.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
