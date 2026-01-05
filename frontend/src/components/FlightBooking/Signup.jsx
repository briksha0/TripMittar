
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios"; // Use your configured axios instance
import { motion, AnimatePresence } from "framer-motion";
import { User, IdCard, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ fullname: "", username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/api/auth/signup", form);

      setMessage("✅ " + response.data.message);
      setIsSuccess(true);

      // Smooth redirect after success
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Signup failed. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#050816] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            <UserPlus className="text-white w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Join TripMittar for your next adventure</p>
        </div>

        {/* Message Alert */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-6 flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
                isSuccess 
                  ? "bg-green-500/10 border-green-500/50 text-green-400" 
                  : "bg-red-500/10 border-red-500/50 text-red-400"
              }`}
            >
              {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-gray-300 text-xs font-semibold ml-1">Full Name</label>
            <div className="relative group">
              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email / Username */}
          <div className="space-y-1.5">
            <label className="text-gray-300 text-xs font-semibold ml-1">Email Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-gray-300 text-xs font-semibold ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading || isSuccess}
            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_20px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}