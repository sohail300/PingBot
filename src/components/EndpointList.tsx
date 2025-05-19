import { motion } from "framer-motion";
import { useState } from "react";
import { itemVariants } from "./DashboardCards";
import { ExternalLink } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Define container animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

// Endpoint List component
type Endpoint = {
  id: string | number;
  url: string;
  active: boolean;
  status: string;
  lastPing: string;
  uptime: number;
};

interface EndpointListProps {
  endpoints: Endpoint[];
}

export const EndpointList = ({ endpoints }: EndpointListProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {endpoints.map((endpoint) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </motion.div>
  );
};

// Endpoint Card component
const EndpointCard = ({ endpoint }: { endpoint: Endpoint }) => {
  const [isActive, setIsActive] = useState(endpoint.active);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg hover:shadow-[#00ffae]/10 hover:border-[#00ffae]/30 transition-all"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium truncate max-w-xs">
                {endpoint.url}
              </h3>
              <a
                href={endpoint.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffae]"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <StatusBadge status={endpoint.status} />
              <span className="text-sm text-gray-400">
                Last ping: {endpoint.lastPing}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={toggleActive}
              className={`${
                isActive ? "bg-[#00ffae]" : "bg-gray-600"
              } cursor-pointer`}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke={
                    endpoint.uptime > 95
                      ? "#00ffae"
                      : endpoint.uptime > 90
                      ? "orange"
                      : "red"
                  }
                  strokeWidth="2"
                />
                <path
                  d={`M 12 12 L 12 5`}
                  stroke={
                    endpoint.uptime > 95
                      ? "#00ffae"
                      : endpoint.uptime > 90
                      ? "orange"
                      : "red"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  transform={`rotate(${endpoint.uptime * 3.6} 12 12)`}
                />
              </svg>
              <span className="text-sm text-gray-300">
                24h Uptime: {endpoint.uptime}%
              </span>
            </div>
            <Button
              size="sm"
              variant="default"
              className="text-xs border-[#00ffae] border-1 hover:text-[#00ffae] cursor-pointer"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Status Badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = status === "200 OK" ? "bg-green-500" : "bg-red-500";

  if (status === "Slow") {
    color = "bg-yellow-500";
  }

  return (
    <Badge className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
      {status}
    </Badge>
  );
};
