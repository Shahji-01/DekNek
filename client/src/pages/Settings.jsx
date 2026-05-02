import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getMe, updateProfile, changePassword, deleteAccount, 
  setup2FA, verify2FA, disable2FA 
} from "../api";
import { 
  User, Lock, Shield, Trash2, ArrowLeft, 
  CheckCircle2, AlertTriangle, QrCode 
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [otp, setOtp] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [deletePass, setDeletePass] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.data.user);
      setProfileName(res.data.data.user.name);
    } catch (err) {
      navigate("/login");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name: profileName });
      setMessage({ type: "success", text: "Profile updated successfully" });
      fetchUser();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword({ 
        currentPassword: passwords.current, 
        newPassword: passwords.new 
      });
      setMessage({ type: "success", text: "Password changed successfully" });
      setPasswords({ current: "", new: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const res = await setup2FA();
      setQrCode(res.data.data.qrCode);
      setMessage({ type: "info", text: "Scan the QR code and enter the code to enable 2FA" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "2FA setup failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verify2FA({ code: otp });
      setMessage({ type: "success", text: "2FA enabled successfully" });
      setQrCode(null);
      setOtp("");
      fetchUser();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to disable 2FA?")) return;
    setLoading(true);
    try {
      await disable2FA({ code: otp });
      setMessage({ type: "success", text: "2FA disabled successfully" });
      setOtp("");
      fetchUser();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Action failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm("CRITICAL: Are you sure you want to delete your account? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteAccount({ password: deletePass });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Deletion failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
            message.type === "error" ? "bg-red-50 border-red-100 text-red-700" :
            "bg-blue-50 border-blue-100 text-blue-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <User className="text-blue-500" size={22} />
              <h2 className="text-lg font-bold">Profile Information</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="input-field bg-gray-50 cursor-not-allowed" value={user.email} disabled />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed for security reasons.</p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-auto px-6">
                  Save Changes
                </button>
              </form>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <Lock className="text-indigo-500" size={22} />
              <h2 className="text-lg font-bold">Security</h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Change Password */}
              <form onSubmit={handleChangePassword} className="space-y-4 pb-8 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Change Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      className="input-field" 
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="input-field" 
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-auto px-6">
                  Update Password
                </button>
              </form>

              {/* 2FA Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${user.twoFAEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.twoFAEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>

                {!user.twoFAEnabled && !qrCode && (
                  <button onClick={handleSetup2FA} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
                    <QrCode size={18} /> Enable 2FA
                  </button>
                )}

                {qrCode && (
                  <div className="p-4 bg-gray-50 rounded-xl flex flex-col items-center gap-4">
                    <img src={qrCode} alt="2FA QR" className="w-48 h-48 border-4 border-white rounded-lg shadow-sm" />
                    <p className="text-xs text-center text-gray-500 max-w-xs">
                      Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below.
                    </p>
                    <form onSubmit={handleVerify2FA} className="flex gap-2 w-full max-w-xs">
                      <input 
                        type="text" 
                        className="input-field text-center" 
                        placeholder="000000" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn-primary w-auto px-4">Verify</button>
                    </form>
                  </div>
                )}

                {user.twoFAEnabled && (
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-xs text-emerald-700 mb-3">2FA is currently active. To disable it, enter your OTP code below.</p>
                    <form onSubmit={handleDisable2FA} className="flex gap-2 w-full max-w-xs">
                      <input 
                        type="text" 
                        className="input-field text-center" 
                        placeholder="000000" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <button type="submit" className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">Disable</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
            <div className="p-6 border-b border-red-100 flex items-center gap-3">
              <Trash2 className="text-red-500" size={22} />
              <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-red-600 mb-6 font-medium">
                Deleting your account is permanent and will remove all your data. Please enter your password to confirm.
              </p>
              <form onSubmit={handleDeleteAccount} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="password" 
                  className="input-field border-red-200 focus:border-red-500 flex-1" 
                  placeholder="Confirm Password" 
                  value={deletePass}
                  onChange={(e) => setDeletePass(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                  Delete My Account
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
