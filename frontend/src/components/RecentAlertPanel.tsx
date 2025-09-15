import { Card, CardHeader } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants } from "./EndpointList";
import { itemVariants } from "./DashboardCards";
import { Badge } from "./ui/badge";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/config";

interface Target {
  id: number;
  name: string;
  url: string;
}

interface Alert {
  id: number;
  target: Target;
  created_at: string;
}

export const RecentAlertsPanel = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery<Alert[]>({
    queryKey: ["recentAlerts"],
    queryFn: getRecentAlerts,
  });

  async function getRecentAlerts() {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.get("/email/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    return <div className="text-red-500">Error Loading Recent Alerts</div>;
  }

  return (
    <Card className="bg-[#1a1a1c] border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="px-4 pb-4 flex items-center justify-between text-white font-medium border-b border-gray-800">
        <h3 className="text-white font-medium flex items-center">
          <Bell size={16} className="mr-2 text-[#00ffae]" />
          Recent Alerts
        </h3>
        <Badge className="bg-red-500/20 text-red-400 border-red-500">
          {data.length} Incidents
        </Badge>
      </CardHeader>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-h-[300px] overflow-y-auto"
      >
        {data.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </motion.div>
    </Card>
  );
};

// Alert Item component
const AlertItem = ({ alert }: { alert: Alert }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(date.getTime() + istOffset);
    return `${istDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
    })}, ${istDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} IST`;
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-[#1a1a1c] transition-colors"
    >
      <div className="flex items-start space-x-4 p-2 hover:bg-gray-800/30 rounded-lg transition-colors w-full">
        <div className="flex-shrink-0 mt-1">
          <div
            className={`h-3 w-3 rounded-full bg-red-500 animate-pulse`}
          ></div>
        </div>
        <div className="flex-grow min-w-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-grow min-w-0">
                <h3 className="text-white font-medium truncate">
                  {alert.target.name}
                </h3>
                <p className="text-sm text-gray-300 truncate">
                  {alert.target.url}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDate(alert.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
