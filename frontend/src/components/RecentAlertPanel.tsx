import { Card, CardHeader } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants } from "./EndpointList";
import { itemVariants } from "./DashboardCards";
import { Badge } from "./ui/badge";

type Alert = {
  id: string | number;
  url: string;
  date: string;
  time: string;
};

interface RecentAlertsPanelProps {
  alerts: Alert[];
}

export const RecentAlertsPanel = ({ alerts }: RecentAlertsPanelProps) => {
  return (
    <Card className="bg-[#1a1a1c] border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="px-4 pb-4 flex items-center justify-between text-white font-medium border-b border-gray-800">
        <h3 className="text-white font-medium flex items-center">
          <Bell size={16} className="mr-2 text-[#00ffae]" />
          Recent Alerts
        </h3>
        <Badge className="bg-red-500/20 text-red-400 border-red-500">
          4 Incidents
        </Badge>
      </CardHeader>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-h-[300px] overflow-y-auto"
      >
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </motion.div>
    </Card>
  );
};

// Alert Item component
const AlertItem = ({ alert }: { alert: Alert }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#1a1a1c] transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={`h-2 w-2 rounded-full bg-red-500`}></div>
        <div>
          <p className="text-white text-sm">{alert.url}</p>
          <p className="text-xs text-gray-400">
            {alert.date} at {alert.time}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
