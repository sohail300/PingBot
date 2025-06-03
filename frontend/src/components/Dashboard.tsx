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

      <EndpointList />

      <div className="my-8">
        <RecentAlertsPanel />
      </div>
    </motion.div>
  );
};
