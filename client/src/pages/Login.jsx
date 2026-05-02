import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser, verify2FALogin } from "../api";
import { Eye, EyeOff, Hexagon, ShieldCheck } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (show2FA) {
        const res = await verify2FALogin({ code: otp });
        localStorage.setItem("token", res.data.data.token);
        localStorage.removeItem("tempToken");
        navigate("/dashboard");
        return;
      }

      let res;
      if (isLogin) {
        res = await loginUser({ email: formData.email, password: formData.password });
        if (res.data.data.twoFARequired) {
          setShow2FA(true);
          localStorage.setItem("tempToken", res.data.data.tempToken);
          setLoading(false);
          return;
        }
      } else {
        res = await signupUser(formData);
      }
      localStorage.setItem("token", res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Enter the 6-digit code from your authenticator app to complete the sign-in.
          </p>

          {error && (
            <div className="w-full bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5 text-center">Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="input-field text-center text-2xl tracking-[1em] font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button 
              type="button" 
              onClick={() => { setShow2FA(false); setError(""); localStorage.removeItem("tempToken"); }} 
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl flex flex-col lg:flex-row overflow-hidden min-h-[85vh]">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <Hexagon className="text-blue-600 fill-blue-600" size={28} />
            <span className="text-xl font-bold text-gray-900">TaskMaster Pro</span>
          </div>

          {/* Form Content */}
          <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500 text-center mb-8 text-sm">
              {isLogin 
                ? "Enter your email and password to access your account."
                : "Fill in the details below to get started."}
            </p>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="sellostore@company.com"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input-field pr-10"
                    value={formData.password}
                    onChange={handleChange}
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

              <button type="submit" disabled={loading} className="btn-primary mt-6">
                {loading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              {isLogin ? "Don't Have An Account?" : "Already Have An Account?"} 
              <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="ml-1 text-blue-600 font-semibold hover:underline">
                {isLogin ? "Register Now." : "Log In."}
              </button>
            </p>

            <div className="mt-4 text-center">
              <a href="/forgot-password" size="sm" className="text-sm text-gray-400 hover:text-blue-600 font-medium">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-400 mt-12">
            <p>Copyright © 2026 TaskMaster Inc.</p>
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          </div>
        </div>

        {/* Right Side - Branding/Image */}
        <div className="hidden lg:flex lg:w-1/2 p-4">
          <div className="w-full h-full bg-blue-600 rounded-2xl p-12 relative overflow-hidden flex flex-col justify-between">
            
            <div className="relative z-10 max-w-md">
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Supercharge your workflow today.
              </h2>
              <p className="text-blue-100 text-lg">
                Organize tasks, track progress, and collaborate seamlessly with your entire team.
              </p>
            </div>

            {/* Realistic Image */}
            <div className="relative z-10 mt-8 flex-1 w-full rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                alt="Team working and collaborating" 
                className="w-full h-full object-cover"
              />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
