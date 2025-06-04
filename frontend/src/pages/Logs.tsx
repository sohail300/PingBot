import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";

// Sample data for demonstration
const sampleLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 5 * 60000),
    endpoint: "https://api.example.com/health",
    statusCode: 200,
    responseTime: 128,
    message: "OK",
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 15 * 60000),
    endpoint: "https://dashboard.example.com/status",
    statusCode: 500,
    responseTime: 1523,
    message: "Internal Server Error",
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 25 * 60000),
    endpoint: "https://auth.example.com/ping",
    statusCode: 408,
    responseTime: 5000,
    message: "Request Timeout",
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 35 * 60000),
    endpoint: "https://storage.example.com/status",
    statusCode: 200,
    responseTime: 95,
    message: "OK",
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 60 * 60000),
    endpoint: "https://api.example.com/health",
    statusCode: 200,
    responseTime: 132,
    message: "OK",
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 120 * 60000),
    endpoint: "https://dashboard.example.com/status",
    statusCode: 404,
    responseTime: 205,
    message: "Not Found",
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 180 * 60000),
    endpoint: "https://auth.example.com/ping",
    statusCode: 200,
    responseTime: 110,
    message: "OK",
  },
];

// Utility function to format the timestamp
const formatTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - timestamp.getTime()) / 60000); // difference in minutes

  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min${diff !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

// Badge component for status codes
interface StatusBadgeProps {
  code: number;
  message: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ code, message }) => {
  if (code >= 200 && code < 300) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
          {code} {message}
        </span>
        <CheckCircle size={16} className="text-green-400" />
      </div>
    );
  } else if (code >= 400 && code < 500) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
          {code} {message}
        </span>
        <AlertCircle size={16} className="text-yellow-400" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
          {code} {message}
        </span>
        <AlertCircle size={16} className="text-red-400" />
      </div>
    );
  }
};

// Response time badge with color based on duration
interface ResponseTimeBadgeProps {
  time: number;
}

const ResponseTimeBadge: React.FC<ResponseTimeBadgeProps> = ({ time }) => {
  let bgColor = "bg-green-500/20";
  let textColor = "text-green-400";

  if (time > 1000) {
    bgColor = "bg-red-500/20";
    textColor = "text-red-400";
  } else if (time > 300) {
    bgColor = "bg-yellow-500/20";
    textColor = "text-yellow-400";
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {time}ms
      </span>
      <Clock size={16} className={textColor} />
    </div>
  );
};

export default function Logs() {
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [isEndpointDropdownOpen, setIsEndpointDropdownOpen] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);

  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["logs", 3],
    queryFn: () => getLogs(3),
  });

  async function getLogs(id: number) {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.get(`/target/logs?target_id=${id}`, {
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
    return <div className="text-red-500">Error Loading Dashboard Stats</div>;
  }

  const statusOptions = [
    "All Statuses",
    "Success (2xx)",
    "Client Error (4xx)",
    "Server Error (5xx)",
  ];

  // Get unique endpoints from sample logs
  const uniqueEndpoints = Array.from(
    new Set(sampleLogs.map((log) => log.endpoint))
  );

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle endpoint selection
  const toggleEndpoint = (endpoint: string) => {
    setSelectedEndpoints((prev) =>
      prev.includes(endpoint)
        ? prev.filter((e) => e !== endpoint)
        : [...prev, endpoint]
    );
  };

  // Filter and sort logs
  const filteredLogs = sampleLogs
    .filter((log) => {
      // Filter by selected endpoints
      if (
        selectedEndpoints.length > 0 &&
        !selectedEndpoints.includes(log.endpoint)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "timestamp") {
        return sortDirection === "asc"
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortField === "responseTime") {
        return sortDirection === "asc"
          ? a.responseTime - b.responseTime
          : b.responseTime - a.responseTime;
      } else if (sortField === "statusCode") {
        return sortDirection === "asc"
          ? a.statusCode - b.statusCode
          : b.statusCode - a.statusCode;
      } else {
        // Sort by endpoint URL
        const endpointA = a.endpoint.toLowerCase();
        const endpointB = b.endpoint.toLowerCase();
        return sortDirection === "asc"
          ? endpointA.localeCompare(endpointB)
          : endpointB.localeCompare(endpointA);
      }
    });

  // Simulate refreshing the logs
  const refreshLogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="bg-[#0e0e10] min-h-screen px-4 py-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00ffae] to-[#00e0ff] bg-clip-text text-transparent">
            Ping Logs
          </h2>
          <p className="text-gray-400 mb-6">
            View the latest ping results for your endpoints.
          </p>
        </motion.div>

        {/* Filter and Search Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <button
              onClick={() => setIsEndpointDropdownOpen(!isEndpointDropdownOpen)}
              className="w-full px-4 py-2 bg-[#1a1a1c] border border-gray-700 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
            >
              <span>
                {selectedEndpoints.length === 0
                  ? "All Endpoints"
                  : `${selectedEndpoints.length} Selected`}
              </span>
              <ChevronDown size={18} className="ml-2 text-gray-400" />
            </button>

            {isEndpointDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[#1a1a1c] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-700">
                  <button
                    className="w-full text-left px-2 py-1 text-sm text-[#00ffae] hover:bg-gray-800 rounded"
                    onClick={() => {
                      setSelectedEndpoints(
                        selectedEndpoints.length === uniqueEndpoints.length
                          ? []
                          : uniqueEndpoints
                      );
                    }}
                  >
                    {selectedEndpoints.length === uniqueEndpoints.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                {uniqueEndpoints.map((endpoint) => (
                  <div
                    key={endpoint}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center"
                    onClick={() => toggleEndpoint(endpoint)}
                  >
                    <div
                      className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                        selectedEndpoints.includes(endpoint)
                          ? "bg-[#00ffae] border-[#00ffae]"
                          : "border-gray-500"
                      }`}
                    >
                      {selectedEndpoints.includes(endpoint) && (
                        <CheckCircle size={14} className="text-[#0e0e10]" />
                      )}
                    </div>
                    <span className="truncate">{endpoint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full md:w-auto px-4 py-2 bg-[#1a1a1c] border border-gray-700 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={18} className="ml-2 text-gray-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[#1a1a1c] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {statusOptions.map((status) => (
                  <div
                    key={status}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsStatusDropdownOpen(false);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={refreshLogs}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
          >
            <RefreshCcw
              size={18}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#1a1a1c] border border-gray-800 rounded-xl shadow"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#00ffae]"
                    onClick={() => handleSort("timestamp")}
                  >
                    <div className="flex items-center">
                      Timestamp
                      {renderSortIndicator("timestamp")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#00ffae]"
                    onClick={() => handleSort("endpoint")}
                  >
                    <div className="flex items-center">
                      Endpoint URL
                      {renderSortIndicator("endpoint")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#00ffae]"
                    onClick={() => handleSort("statusCode")}
                  >
                    <div className="flex items-center">
                      Status
                      {renderSortIndicator("statusCode")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#00ffae]"
                    onClick={() => handleSort("responseTime")}
                  >
                    <div className="flex items-center">
                      Response Time
                      {renderSortIndicator("responseTime")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  // Loading state
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={`loading-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gray-700 animate-pulse rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gray-700 animate-pulse rounded w-48"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gray-700 animate-pulse rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gray-700 animate-pulse rounded w-16"></div>
                        </td>
                      </tr>
                    ))
                ) : filteredLogs.length > 0 ? (
                  // Actual logs data
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatTimeAgo(log.timestamp)}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {log.timestamp.toLocaleDateString()}{" "}
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium">{log.endpoint}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge
                          code={log.statusCode}
                          message={log.message}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <ResponseTimeBadge time={log.responseTime} />
                      </td>
                    </tr>
                  ))
                ) : (
                  // No results found
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No log entries found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (only visible on small screens) */}
          {/* <div className="md:hidden space-y-4 p-4">
            {!isLoading &&
              filteredLogs.length > 0 &&
              filteredLogs.map((log) => (
                <div
                  key={`mobile-${log.id}`}
                  className="bg-gray-800/30 p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-medium">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                    <StatusBadge code={log.statusCode} message={log.message} />
                  </div>
                  <div className="text-sm text-gray-300 mb-2 truncate">
                    {log.endpoint}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {log.timestamp.toLocaleDateString()}{" "}
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <ResponseTimeBadge time={log.responseTime} />
                  </div>
                </div>
              ))}
          </div> */}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="px-4 py-2 bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-700">
                Previous
              </button>
              <button className="ml-3 px-4 py-2 bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-700">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredLogs.length}</span> of{" "}
                  <span className="font-medium">{sampleLogs.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="px-2 py-2 rounded-l-lg border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-700 bg-[#00ffae]/10 text-[#00ffae] hover:bg-[#00ffae]/20">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700">
                    3
                  </button>
                  <button className="px-2 py-2 rounded-r-lg border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
