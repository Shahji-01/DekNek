import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api";
import { 
  LogOut, LayoutDashboard, Settings, Users, 
  Bell, Search, TrendingUp, BarChart3, CreditCard, 
  Mail, Shield, Calendar, Hexagon, ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Format date safely
  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
          <Hexagon className="text-blue-600 fill-blue-600" size={24} />
          <span className="font-bold text-lg tracking-tight text-gray-900">TaskMaster Pro</span>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" onClick={() => navigate("/dashboard")} active={window.location.pathname === "/dashboard"} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Users size={20} />} label="Customers" />
          <NavItem icon={<CreditCard size={20} />} label="Billing" />
          
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Preferences</p>
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate("/settings")} active={window.location.pathname === "/settings"} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          {/* Search */}
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>

            {/* User Dropdown Profile (Simple version) */}
            <button className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize mt-1">{user.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Here is the latest overview of your account and projects.</p>
          </div>

          {/* User Details Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your personal information and security settings.</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="mt-4 sm:mt-0 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors font-medium border border-red-100 hover:border-red-500"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Mail size={18}/></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Shield size={18}/></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Access Role</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500"><Calendar size={18}/></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Revenue" value="$45,231.89" trend="+20.1%" trendUp={true} icon={<CreditCard size={24}/>} color="blue" />
            <StatCard title="Active Projects" value="12" trend="+2" trendUp={true} icon={<LayoutDashboard size={24}/>} color="indigo" />
            <StatCard title="Pending Tasks" value="34" trend="-5%" trendUp={false} icon={<TrendingUp size={24}/>} color="emerald" />
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all ${
      active 
      ? "bg-blue-50 text-blue-700 font-semibold" 
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
    }`}>
      <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, trendUp, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h4 className="text-3xl font-bold text-gray-900 mt-2">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>{trend}</span>
        <span className="text-gray-400 text-sm">from last month</span>
      </div>
    </div>
  );
}
