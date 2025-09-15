import { useState, useEffect, useRef, useCallback, useMemo } from "react";

declare global {
  interface Window {
    __lenis?: {
      stop?: () => void;
      start?: () => void;
    };
  }
}
import {
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@/utils/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Endpoint } from "@/components/EndpointList";
import { StatusBadge } from "@/components/StatusBadge";
import { formatTimeAgo } from "@/utils/formattimeAgo";
import { ResponseTimeBadge } from "@/components/ResponseTimeBadge";

interface Log {
  id: number;
  target: {
    id: number;
    name: string;
    url: string;
  };
  status_code: number;
  response_time: number;
  created_at: string;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "2xx", label: "Success (2xx)" },
  { value: "4xx", label: "Client Error (4xx)" },
  { value: "5xx", label: "Server Error (5xx)" },
];

export default function Logs() {
  const [selectedEndpoints, setSelectedEndpoints] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isEndpointDropdownOpen, setIsEndpointDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const endpointDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  const queryClient = useQueryClient();
  // Pause Lenis smooth scrolling on this heavy page to reduce CPU on Windows Chrome
  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis?.stop) {
      lenis.stop();
    }
    return () => {
      if (lenis?.start) {
        lenis.start();
      }
    };
  }, []);

  // Fetch endpoints list first
  const {
    isPending: isEndpointsPending,
    error: endpointsError,
    data: endpointsData,
  } = useQuery<Endpoint[]>({
    queryKey: ["endpointsList"],
    queryFn: getEndpointsList,
  });

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        endpointDropdownRef.current &&
        !endpointDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEndpointDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleEndpointDropdown = useCallback(() => {
    setIsEndpointDropdownOpen((prev) => !prev);
  }, []);

  const toggleStatusDropdown = useCallback(() => {
    setIsStatusDropdownOpen((prev) => !prev);
  }, []);

  const handleEndpointSelect = useCallback((endpointId: number) => {
    setSelectedEndpoints((prev) => {
      if (prev.includes(endpointId)) {
        return prev.filter((id) => id !== endpointId);
      }
      return [...prev, endpointId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (endpointsData) {
      setSelectedEndpoints((prev) =>
        prev.length === endpointsData.length
          ? []
          : endpointsData.map((e) => e.id)
      );
    }
  }, [endpointsData]);

  const handleStatusSelect = useCallback((status: string) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  }, []);

  // Set all endpoints as selected by default when data is loaded
  useEffect(() => {
    if (
      endpointsData &&
      endpointsData.length > 0 &&
      selectedEndpoints.length === 0
    ) {
      setSelectedEndpoints(endpointsData.map((endpoint) => endpoint.id));
    }
  }, [endpointsData, selectedEndpoints.length]);

  // Fetch logs
  const { isPending: isLogsPending, data: logsData } = useQuery<Log[]>({
    queryKey: ["logs", selectedEndpoints],
    queryFn: () => getLogs(selectedEndpoints),
    enabled: selectedEndpoints.length > 0,
  });

  async function getEndpointsList() {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.get("/target/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching endpoints list:", error);
      throw error;
    }
  }

  async function getLogs(targetIds: number[]) {
    try {
      const token = await getToken({ template: "pingbot" });

      const response = await api.post(`/target/logs`, targetIds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw error;
    }
  }

  const columnHelper = createColumnHelper<Log>();

  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(
    () => [
      columnHelper.accessor("created_at", {
        header: "Timestamp",
        cell: (info) => {
          const date = new Date(info.getValue());
          const istDate = new Date(
            date.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            })
          );
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {formatTimeAgo(info.getValue())}
              </span>
              <span className="text-gray-400 text-xs">
                {istDate.toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("target.name", {
        header: "Endpoint Name",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("target.url", {
        header: "Endpoint URL",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("status_code", {
        header: "Status",
        cell: (info) => <StatusBadge code={info.getValue()} />,
      }),
      columnHelper.accessor("response_time", {
        header: "Response Time",
        cell: (info) => <ResponseTimeBadge time={info.getValue()} />,
      }),
    ],
    [columnHelper]
  );

  // Memoize filtered data based on status
  const filteredData = useMemo(() => {
    if (!logsData) return [];

    if (selectedStatus === "all") return logsData;

    return logsData.filter((log) => {
      const statusCode = log.status_code;
      if (selectedStatus === "2xx")
        return statusCode >= 200 && statusCode < 300;
      if (selectedStatus === "4xx")
        return statusCode >= 400 && statusCode < 500;
      if (selectedStatus === "5xx") return statusCode >= 500;
      return true;
    });
  }, [logsData, selectedStatus]);

  // Memoize table configuration
  const tableConfig = useMemo(
    () => ({
      data: filteredData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: 10,
        },
      },
    }),
    [filteredData, columns]
  );

  const table = useReactTable(tableConfig);

  if (isEndpointsPending) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ffae]" />
      </div>
    );
  }

  if (endpointsError) {
    return <div className="text-red-500">Error Loading Endpoints List</div>;
  }

  // Simulate refreshing the logs
  const refreshLogs = () => {
    queryClient.invalidateQueries({ queryKey: ["logs"] });
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

        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Endpoints Dropdown */}
          <div className="relative flex-1" ref={endpointDropdownRef}>
            <button
              type="button"
              onClick={toggleEndpointDropdown}
              className="w-full px-4 py-2 bg-[#1a1a1c] border border-gray-700 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
            >
              <span>
                {selectedEndpoints.length === 0
                  ? "Select Endpoints"
                  : `${selectedEndpoints.length} Selected`}
              </span>
              <ChevronDown size={18} className="ml-2 text-gray-400" />
            </button>

            {isEndpointDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[#1a1a1c] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-700">
                  <button
                    type="button"
                    className="w-full text-left px-2 py-1 text-sm text-[#00ffae] hover:bg-gray-800 rounded"
                    onClick={handleSelectAll}
                  >
                    {selectedEndpoints.length === endpointsData?.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                {endpointsData?.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center"
                    onClick={() => handleEndpointSelect(endpoint.id)}
                  >
                    <div
                      className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                        selectedEndpoints.includes(endpoint.id)
                          ? "bg-[#00ffae] border-[#00ffae]"
                          : "border-gray-500"
                      }`}
                    >
                      {selectedEndpoints.includes(endpoint.id) && (
                        <CheckCircle size={14} className="text-[#0e0e10]" />
                      )}
                    </div>
                    <span className="truncate">{endpoint.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={toggleStatusDropdown}
              className="w-full md:w-auto px-4 py-2 bg-[#1a1a1c] border border-gray-700 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
            >
              <span>
                {statusOptions.find((s) => s.value === selectedStatus)?.label}
              </span>
              <ChevronDown size={18} className="ml-2 text-gray-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[#1a1a1c] border border-gray-700 rounded-lg shadow-lg">
                {statusOptions.map((status) => (
                  <div
                    key={status.value}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleStatusSelect(status.value)}
                  >
                    {status.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshLogs}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00ffae]/50"
          >
            <RefreshCcw
              size={18}
              className={`mr-2 ${isLogsPending ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Selected Endpoints Tags */}
        {selectedEndpoints.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedEndpoints.map((id) => {
              const endpoint = endpointsData?.find((e) => e.id === id);
              return (
                endpoint && (
                  <div
                    key={id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#00ffae]/10 text-[#00ffae]"
                  >
                    {endpoint.name}
                    <button
                      type="button"
                      onClick={() => handleEndpointSelect(id)}
                      className="ml-2 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              );
            })}
          </div>
        )}

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
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#00ffae]"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUp size={16} className="ml-1" />,
                            desc: <ChevronDown size={16} className="ml-1" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLogsPending ? (
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
                ) : table.getRowModel().rows.length > 0 ? (
                  // Actual logs data
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-800/50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  // No results found
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      {selectedEndpoints.length === 0
                        ? "Please select at least one endpoint to view logs"
                        : "No log entries found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                type="button"
                className="px-4 py-2 bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                type="button"
                className="ml-3 px-4 py-2 bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      table.getRowModel().rows.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {table.getRowModel().rows.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    className="px-2 py-2 rounded-l-lg border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: table.getPageCount() },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`px-4 py-2 border border-gray-700 ${
                        table.getState().pagination.pageIndex === page - 1
                          ? "bg-[#00ffae]/10 text-[#00ffae]"
                          : "bg-gray-800 text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="px-2 py-2 rounded-r-lg border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
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
