import { api } from "@/utils/config";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const DashboardStats = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  async function getDashboardStats() {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.get("/target/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ffae]" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading dashboard stats:", error);
    return <div className="text-red-500">Error loading dashboard stats</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Total Endpoints</p>
        <h3 className="text-white text-2xl font-bold">
          {data?.total_endpoints}
        </h3>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Overall Uptime (24 hrs)</p>
        <h3 className="text-white text-2xl font-bold">
          {data?.average_uptime_percentage}%
        </h3>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Current Status</p>
        <h3 className="text-white text-2xl font-bold flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          {data?.up_count}/{data?.total_endpoints} Up
        </h3>
      </motion.div>
    </div>
  );
};
