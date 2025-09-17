
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../App";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";

export default function SignIn() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();

  const from =
    typeof location.state?.from === "string"
      ? location.state.from
      : location.state?.from?.pathname || "/my-bookings";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/api/auth/signin", form);

      if (data.user && data.token) {
        signin(data.user, () => navigate(from, { replace: true }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage(data.message || "❌ Invalid credentials.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10  flex items-center justify-center min-h-screen  px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30"
      >
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Lock className="text-white w-7 h-7" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow">
            Welcome
          </h2>
          <p className="text-gray-200 text-sm mt-1">
            Sign in to continue your journey
          </p>
        </div>

        {/* Error Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-lg bg-red-500/10 border border-red-500 text-red-600 px-4 py-2 text-sm"
          >
            {message}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/90 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/90 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-gray-200 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-white font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
