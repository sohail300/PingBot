import { motion } from "framer-motion";
import { useState } from "react";
import { itemVariants } from "./DashboardCards";
import { ExternalLink, Trash2 } from "lucide-react";
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
      className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8"
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
  const [sendEmail, setSendEmail] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const toggleEmail = () => {
    setSendEmail(!sendEmail);
  };

  // Switch component
  const Switch = ({
    checked,
    onCheckedChange,
    className,
  }: {
    checked: boolean;
    onCheckedChange: () => void;
    className: string;
  }) => {
    return (
      <button
        onClick={onCheckedChange}
        className={`${className} relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50 focus:ring-offset-2 focus:ring-offset-[#1a1a1c]`}
      >
        <span
          className={`${
            checked ? "translate-x-5" : "translate-x-0.5"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    );
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg hover:shadow-[#00ffae]/10 hover:border-[#00ffae]/30 transition-all"
    >
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-2 w-4/5">
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
          <StatusBadge status={endpoint.status} />
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">Active</span>
            <Switch
              checked={isActive}
              onCheckedChange={toggleActive}
              className={`${
                isActive ? "bg-green-700" : "bg-gray-600"
              } cursor-pointer`}
            />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">Email Alerts</span>
            <Switch
              checked={sendEmail}
              onCheckedChange={toggleEmail}
              className={`${
                sendEmail ? "bg-green-700" : "bg-gray-600"
              } cursor-pointer`}
            />
          </div>
        </div>

        {/* Uptime Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
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

          <span>
            <Trash2 color="#c53030" className="cursor-pointer" />
          </span>
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
    <Badge
      className={`${color} text-white text-xs px-2 py-1 rounded-full absolute top-0 right-0`}
    >
      {status}
    </Badge>
  );
};
