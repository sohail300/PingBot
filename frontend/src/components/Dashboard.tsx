import { motion } from "framer-motion";
import { DashboardStats } from "./DashboardCards";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { EndpointList } from "./EndpointList";
import { RecentAlertsPanel } from "./RecentAlertPanel";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const DashboardComponent = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Mock data for endpoints
  const mockEndpoints = [
    {
      id: 1,
      url: "https://api.example.com/users",
      status: "200 OK",
      uptime: 99.8,
      lastPing: "2 minutes ago",
      active: true,
    },
    {
      id: 2,
      url: "https://api.example.com/products",
      status: "200 OK",
      uptime: 98.5,
      lastPing: "5 minutes ago",
      active: true,
    },
    {
      id: 3,
      url: "https://api.example.com/orders",
      status: "Down",
      uptime: 87.2,
      lastPing: "12 minutes ago",
      active: true,
    },
    {
      id: 4,
      url: "https://api.yourservice.io/webhooks",
      status: "200 OK",
      uptime: 99.9,
      lastPing: "1 minute ago",
      active: true,
    },
    {
      id: 5,
      url: "https://auth.yourapp.com/login",
      status: "200 OK",
      uptime: 100,
      lastPing: "Just now",
      active: true,
    },
  ];

  // Mock data for alerts
  const mockAlerts = [
    {
      id: 1,
      url: "api.example.com/orders",
      status: "Down",
      time: "3:42 PM",
      date: "Today",
    },
    {
      id: 2,
      url: "api.example.com/users",
      status: "Slow",
      time: "1:17 PM",
      date: "Today",
    },
    {
      id: 3,
      url: "auth.yourapp.com/login",
      status: "Down",
      time: "11:05 AM",
      date: "Yesterday",
    },
    {
      id: 4,
      url: "api.yourservice.io/webhooks",
      status: "Down",
      time: "6:32 PM",
      date: "May 17",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold my-2 bg-gradient-to-r from-[#00ffae] to-[#00e0ff] bg-clip-text text-transparent">
          Welcome back, {user?.fullName}
        </h2>
        <p className="text-gray-400">
          Monitor your endpoints and keep everything running smoothly.
        </p>
      </div>

      <DashboardStats />

      <div className="flex items-center justify-between my-6">
        <h2 className="text-xl font-semibold">Your Monitored Endpoints</h2>
        <Button
          className="bg-[#00ffae] hover:bg-[#00ffae]/90 text-[#0e0e10] cursor-pointer"
          onClick={() => {
            navigate("/dashboard/add-endpoint");
          }}
        >
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      <EndpointList endpoints={mockEndpoints} />

      <div className="my-8">
        <RecentAlertsPanel alerts={mockAlerts} />
      </div>
    </motion.div>
  );
};
