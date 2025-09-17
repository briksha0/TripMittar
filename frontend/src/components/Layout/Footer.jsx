// components/Layout/Footer.jsx
import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">TripMittar</h2>
          <p className="text-sm">
            Book your cabs, buses, and travel hassle-free with TripMittar.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/cabs" className="hover:text-white">Cab Booking</a></li>
            <li><a href="/buses" className="hover:text-white">Bus Booking</a></li>
            <li><a href="/my-bookings" className="hover:text-white">My Bookings</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm">
            <Phone size={16} /> +91 80068 17136
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Mail size={16} /> support@tripmittar.com
          </p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/bri_k_sha/" className="hover:text-pink-400"><Instagram size={20} /></a>
            <a href="#" className="hover:text-sky-400"><Twitter size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TripMittar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
