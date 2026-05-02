import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword as resetPasswordApi } from "../api";
import { Lock, ArrowLeft, CheckCircle2, Hexagon, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPasswordApi(token, { newPassword: password });
      setMessage("Your password has been successfully reset.");
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired.");
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Please enter a new password for your account.
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
              Sign In with New Password
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
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Resetting..." : "Reset Password"}
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
