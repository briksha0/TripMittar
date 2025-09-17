import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../App";
import logo from "../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signout(() => {
      navigate("/signin");
    });
  };

  // Check if link is active
  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Flight", path: "/flightpage" },
    { name: "Cab", path: "/cabbooking" },
    { name: "Train", path: "/trainbooking" },
    { name: "Bus", path: "/busbooking" },
    { name: "Hotel", path: "/hotels" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container flex justify-between items-center px-4 py-2 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="TriiMittar Logo"
            className="h-12 w-12 hover:scale-110 transition-transform duration-200"
          />
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="font-serif text-blue-500 text-4xl">Trip</span>
            <span className="font-sans text-gray-900 dark:text-white">Mittar</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative group ${isActive(link.path)} transition`}
            >
              {link.name}
              {/* Animated underline */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className={`hover:text-blue-600 ${isActive("/my-bookings")}`}
              >
                My Bookings
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Signup
              </Link>
              <Link
                to="/signin"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-all"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md px-6 py-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block ${isActive(link.path)} hover:text-blue-600`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-300 dark:border-gray-700" />

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className={`block ${isActive("/my-bookings")} hover:text-blue-600`}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600"
                >
                  Signup
                </Link>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md"
                >
                  Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
