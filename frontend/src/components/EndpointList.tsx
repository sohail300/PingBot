import { motion } from "framer-motion";
import { useState } from "react";
import { itemVariants } from "./DashboardCards";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { api } from "@/utils/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { displayErrorToast } from "@/utils/toasts";
import axios from "axios";
import { displaySuccessToast } from "@/utils/toasts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UptimeInfo {
  uptime_percentage: number;
  total_checks: number;
  successful_checks: number;
  period_hours: number;
}

interface Endpoint {
  id: number;
  name: string;
  url: string;
  send_email: boolean;
  is_down: boolean;
  is_active: boolean;
  uptime_info: UptimeInfo;
}

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

export const EndpointList = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery<Endpoint[]>({
    queryKey: ["endpointsList"],
    queryFn: getEndpointsList,
  });

  async function getEndpointsList() {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.get("/target/list", {
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
    return <div className="text-red-500">Error Loading Endpoints List</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8"
    >
      {data.map((endpoint) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </motion.div>
  );
};

// Endpoint Card component
const EndpointCard = ({ endpoint }: { endpoint: Endpoint }) => {
  const [isActive, setIsActive] = useState(endpoint.is_active);
  const [sendEmail, setSendEmail] = useState(endpoint.send_email);
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const toggleEmailFn = async (target_id: number) => {
    const token = await getToken({ template: "pingbot" });
    console.log(token);
    try {
      const response = await api.put(
        `/email/toggle?target_id=${target_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data) {
        setSendEmail(!sendEmail);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.detail);
        throw error.response.data.detail;
      } else {
        console.log("An unexpected error occurred:", error);
        throw "An unexpected error occurred.";
      }
    }
  };

  const { mutate: toggleEmail } = useMutation({
    mutationFn: toggleEmailFn,
    onSuccess: () =>
      displaySuccessToast({
        title: "Email Alerts Toggled",
        description: "Your email alerts have been toggled successfully.",
      }),
    onError: (error: string) =>
      displayErrorToast({
        title: "Failed to Toggle Email Alerts",
        description: error,
      }),
  });

  const toggleActiveFn = async (target_id: number) => {
    const token = await getToken({ template: "pingbot" });
    console.log(token);
    try {
      const response = await api.put(
        `/target/toggle?target_id=${target_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data) {
        setIsActive(!isActive);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.detail);
        throw error.response.data.detail;
      } else {
        console.log("An unexpected error occurred:", error);
        throw "An unexpected error occurred.";
      }
    }
  };

  const { mutate: toggleActive } = useMutation({
    mutationFn: toggleActiveFn,
    onSuccess: () =>
      displaySuccessToast({
        title: "Endpoint Toggled",
        description: "Your endpoint has been toggled successfully.",
      }),
    onError: (error: string) =>
      displayErrorToast({
        title: "Failed to Toggle Endpoint",
        description: error,
      }),
  });

  const deleteEndpointFn = async (target_id: number) => {
    const token = await getToken({ template: "pingbot" });
    console.log(token);
    try {
      const response = await api.delete(
        `/target/delete?target_id=${target_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.detail);
        throw error.response.data.detail;
      } else {
        console.log("An unexpected error occurred:", error);
        throw "An unexpected error occurred.";
      }
    }
  };

  const { mutate: deleteEndpoint } = useMutation({
    mutationFn: deleteEndpointFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["endpointsList"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });

      displaySuccessToast({
        title: "Endpoint Deleted",
        description: "Your endpoint has been deleted successfully.",
      });
    },
    onError: (error: string) =>
      displayErrorToast({
        title: "Failed to Delete Endpoint",
        description: error,
      }),
  });

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
            <div>
              <h3 className="text-white font-medium truncate max-w-xs">
                {endpoint.name}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-gray-400 text-sm">{endpoint.url}</p>
                <a
                  href={endpoint.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ffae]"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
          <StatusBadge status={endpoint.is_down} />
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">Active</span>
            <Switch
              checked={isActive}
              onCheckedChange={() => toggleActive(endpoint.id)}
              className={`${
                isActive ? "bg-green-700" : "bg-gray-600"
              } cursor-pointer`}
            />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">Email Alerts</span>
            <Switch
              checked={sendEmail}
              onCheckedChange={() => toggleEmail(endpoint.id)}
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
                  endpoint.uptime_info.uptime_percentage > 95
                    ? "#00ffae"
                    : endpoint.uptime_info.uptime_percentage > 90
                    ? "orange"
                    : "red"
                }
                strokeWidth="2"
              />
              <path
                d={`M 12 12 L 12 5`}
                stroke={
                  endpoint.uptime_info.uptime_percentage > 95
                    ? "#00ffae"
                    : endpoint.uptime_info.uptime_percentage > 90
                    ? "orange"
                    : "red"
                }
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${
                  endpoint.uptime_info.uptime_percentage * 3.6
                } 12 12)`}
              />
            </svg>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-sm text-gray-300 cursor-pointer">
                  24h Uptime: {endpoint.uptime_info.uptime_percentage}%
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1a1a1c] border border-gray-800">
                <p className="my-1">
                  Period Hours: {endpoint.uptime_info.period_hours}
                </p>
                <p className="my-1">
                  Total Checks: {endpoint.uptime_info.total_checks}
                </p>
                <p className="my-1">
                  Succesful Checks: {endpoint.uptime_info.successful_checks}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <span>
            <Trash2
              size={18}
              color="#c53030"
              className="cursor-pointer"
              onClick={() => deleteEndpoint(endpoint.id)}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Status Badge component
const StatusBadge = ({ status }: { status: boolean }) => {
  const color = status === true ? "bg-green-500" : "bg-red-500";

  return (
    <Badge
      className={`${color} text-white text-xs px-2 py-1 rounded-full absolute top-0 right-0`}
    >
      {status ? "Up" : "Down"}
    </Badge>
  );
};
