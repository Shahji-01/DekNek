import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api";
import { Mail, ArrowLeft, CheckCircle2, Hexagon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email });
      setMessage("Check your email for a password reset link.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-10">
          <Hexagon className="text-blue-600 fill-blue-600" size={28} />
          <span className="text-xl font-bold text-gray-900">TaskMaster Pro</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <p className="text-emerald-700 font-medium text-center mb-8">{message}</p>
            <button 
              onClick={() => navigate("/login")}
              className="btn-primary w-full"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  className="input-field pl-11"
                  placeholder="sellostore@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button 
              type="button" 
              onClick={() => navigate("/login")} 
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
