import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, IdCard, Lock, Eye, EyeOff } from "lucide-react";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/signup`, {
        fullname,
        username,
        password,
      });

      setMessage(response.data.message);
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ An error occurred.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="mt-10 flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow mb-6">
          📝 Create Account
        </h2>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 text-sm rounded-lg ${
              isSuccess ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <IdCard className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              autoComplete="name"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Choose a username"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/80 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-sm text-center text-gray-200 mt-5">
          Already have an account?{" "}
          <a href="/signin" className="text-white font-semibold hover:underline">
            Sign in here
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
