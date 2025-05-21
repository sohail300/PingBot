import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Bell,
  LogOut,
  Trash2,
  ChevronRight,
  AlertCircle,
  Shield,
  Package,
} from "lucide-react";

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Account() {
  // State for user information
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    plan: "Pro",
    endpointsUsed: 7,
    endpointsLimit: 10,
    avatarUrl: null,
    loading: false,
  });

  // State for notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    downtimeNotifications: true,
    monthlyReports: false,
  });

  // Toggle notification states
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate endpoint usage percentage
  const endpointUsagePercent = (user.endpointsUsed / user.endpointsLimit) * 100;

  return (
    <div className="bg-[#0e0e10] min-h-screen px-4 sm:px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00ffae] to-[#00e0ff] bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-400">
            Manage your personal information and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* User Information Card */}
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-xl p-6 shadow-lg text-white mb-6">
              <div className="flex items-center space-x-4 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#00ffae]/30 to-[#00e0ff]/30 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#1a1a1c] rounded-full flex items-center justify-center border-2 border-[#1a1a1c]">
                    <span className="bg-[#00ffae] h-3 w-3 rounded-full"></span>
                  </div>
                </div>

                {/* User Name and Email */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <Package size={16} className="mr-2" />
                    <span>Subscription Plan</span>
                  </div>
                  <span
                    className={`
                    px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      user.plan === "Pro"
                        ? "bg-[#00ffae]/20 text-[#00ffae]"
                        : "bg-blue-500/20 text-blue-400"
                    }
                  `}
                  >
                    {user.plan} Plan
                  </span>
                </div>

                {/* Endpoints Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Endpoints Used
                    </span>
                    <span className="text-sm font-medium">
                      {user.endpointsUsed} of {user.endpointsLimit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff]"
                      style={{ width: `${endpointUsagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <span className="text-sm text-gray-400">Member Since</span>
                  <span className="text-sm">March 15, 2025</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-xl shadow-lg text-white overflow-hidden">
              <h3 className="px-6 py-4 border-b border-gray-800 font-medium">
                Quick Actions
              </h3>

              <div className="divide-y divide-gray-800">
                <button className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition duration-200">
                  <div className="flex items-center">
                    <Shield size={18} className="mr-3 text-gray-400" />
                    <span>Update Password</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>

                <button className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition duration-200">
                  <div className="flex items-center">
                    <Package size={18} className="mr-3 text-gray-400" />
                    <span>Upgrade Plan</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>

                <button className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition duration-200">
                  <div className="flex items-center">
                    <LogOut size={18} className="mr-3 text-gray-400" />
                    <span>Log Out</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information Form */}
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="block w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00ffae]/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="block w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00ffae]/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button className="px-4 py-2 bg-[#00ffae]/10 hover:bg-[#00ffae]/20 text-[#00ffae] border border-[#00ffae]/30 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium mb-4">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell size={18} className="mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-gray-400">
                        Receive email notifications for important alerts
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.emailAlerts}
                      onChange={() => toggleNotification("emailAlerts")}
                    />
                    <div
                      className={`
                      w-11 h-6 rounded-full peer 
                      peer-focus:ring-2 peer-focus:ring-[#00ffae]/50
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-0.5 
                      after:left-[2px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:transition-all
                      ${
                        notifications.emailAlerts
                          ? "bg-gradient-to-r from-[#00ffae] to-[#00e0ff]"
                          : "bg-gray-700"
                      }
                    `}
                    ></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle size={18} className="mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Downtime Notifications</p>
                      <p className="text-sm text-gray-400">
                        Get instant alerts when your endpoints go down
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.downtimeNotifications}
                      onChange={() =>
                        toggleNotification("downtimeNotifications")
                      }
                    />
                    <div
                      className={`
                      w-11 h-6 rounded-full peer 
                      peer-focus:ring-2 peer-focus:ring-[#00ffae]/50
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-0.5 
                      after:left-[2px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:transition-all
                      ${
                        notifications.downtimeNotifications
                          ? "bg-gradient-to-r from-[#00ffae] to-[#00e0ff]"
                          : "bg-gray-700"
                      }
                    `}
                    ></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Monthly Reports</p>
                      <p className="text-sm text-gray-400">
                        Receive monthly summary of your endpoints performance
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.monthlyReports}
                      onChange={() => toggleNotification("monthlyReports")}
                    />
                    <div
                      className={`
                      w-11 h-6 rounded-full peer 
                      peer-focus:ring-2 peer-focus:ring-[#00ffae]/50
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-0.5 
                      after:left-[2px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:transition-all
                      ${
                        notifications.monthlyReports
                          ? "bg-gradient-to-r from-[#00ffae] to-[#00e0ff]"
                          : "bg-gray-700"
                      }
                    `}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
              <h3 className="px-6 py-4 border-b border-gray-800 font-medium text-red-400 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                Danger Zone
              </h3>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-400">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center">
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
