import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Plus,
  List,
  User,
  Bell,
  ExternalLink,
  RefreshCw,
  Toggle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";

// Define container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

// Define item animation variants
const itemVariants = {
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

// Sidebar navigation items
const navItems = [
  {
    name: "Dashboard",
    icon: Home,
    active: true,
  },
  {
    name: "Add Endpoint",
    icon: Plus,
    active: false,
  },
  {
    name: "Logs",
    icon: List,
    active: false,
  },
  {
    name: "Account",
    icon: User,
    active: false,
  },
];

// Logo component
const Logo = () => (
  <div className="flex items-center space-x-2 px-4 py-2">
    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff] flex items-center justify-center">
      <RefreshCw size={16} className="text-[#0e0e10]" />
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
      PingPulse
    </span>
  </div>
);

// Navigation Item component
const NavItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <motion.div
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg cursor-pointer ${
        item.active
          ? "bg-[#00ffae]/10 text-[#00ffae]"
          : "text-gray-400 hover:bg-[#00ffae]/5 hover:text-gray-100"
      }`}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon size={18} />
      <span>{item.name}</span>
    </motion.div>
  );
};

// Sidebar component
const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col h-screen w-60 bg-[#0e0e10] border-r border-gray-800 fixed left-0 top-0">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto pt-6">
        <nav className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div>
            <p className="text-sm text-white">Alex Morgan</p>
            <p className="text-xs text-gray-400">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Navigation component
const MobileNav = () => {
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#0e0e10] border-b border-gray-800">
      <Logo />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-[#0e0e10] border-r border-gray-800"
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <Logo />
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-2">
                {navItems.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div>
                  <p className="text-sm text-white">Alex Morgan</p>
                  <p className="text-xs text-gray-400">alex@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Status Badge component
const StatusBadge = ({ status }) => {
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

// Endpoint Card component
const EndpointCard = ({ endpoint }) => {
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
              className={`${isActive ? "bg-[#00ffae]" : "bg-gray-600"}`}
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
              variant="outline"
              className="text-xs border-gray-700 hover:border-[#00ffae] hover:text-[#00ffae]"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Endpoint List component
const EndpointList = ({ endpoints }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {endpoints.map((endpoint) => (
        <EndpointCard key={endpoint.id} endpoint={endpoint} />
      ))}
    </motion.div>
  );
};

// Add Endpoint Form component
const AddEndpointForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the data to your API
    toast({
      title: "Endpoint Added",
      description: "Your new endpoint has been added successfully.",
    });
  };

  return (
    <Card className="bg-[#1a1a1c] border-gray-800 shadow-lg p-6 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="url" className="text-white">
            Endpoint URL
          </Label>
          <Input
            id="url"
            placeholder="https://your-api.com/endpoint"
            className="mt-1 bg-[#0e0e10] border-gray-700 focus:border-[#00ffae] focus:ring-[#00ffae]/20"
          />
        </div>

        <div>
          <Label htmlFor="headers" className="text-white">
            Headers (Optional JSON)
          </Label>
          <Textarea
            id="headers"
            placeholder='{"Authorization": "Bearer token"}'
            className="mt-1 bg-[#0e0e10] border-gray-700 focus:border-[#00ffae] focus:ring-[#00ffae]/20"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="interval" className="text-white">
              Ping Interval
            </Label>
            <select
              id="interval"
              className="bg-[#0e0e10] border-gray-700 rounded-md text-white px-2 py-1 focus:border-[#00ffae]"
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications" className="text-white">
              Email Notifications
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-medium hover:shadow-lg hover:shadow-[#00ffae]/20 transition-all"
        >
          Add Endpoint
        </Button>
      </form>
    </Card>
  );
};

// Alert Item component
const AlertItem = ({ alert }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#1a1a1c] transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div
          className={`h-2 w-2 rounded-full ${
            alert.status === "Down" ? "bg-red-500" : "bg-yellow-500"
          }`}
        ></div>
        <div>
          <p className="text-white text-sm">{alert.url}</p>
          <p className="text-xs text-gray-400">
            {alert.date} at {alert.time}
          </p>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`${
          alert.status === "Down"
            ? "border-red-500 text-red-500"
            : "border-yellow-500 text-yellow-500"
        }`}
      >
        {alert.status}
      </Badge>
    </motion.div>
  );
};

// Recent Alerts Panel component
const RecentAlertsPanel = ({ alerts }) => {
  return (
    <Card className="bg-[#1a1a1c] border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center">
          <Bell size={16} className="mr-2 text-[#00ffae]" />
          Recent Alerts
        </h3>
        <Badge className="bg-red-500/20 text-red-400 border-red-500">
          4 Incidents
        </Badge>
      </div>

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

      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full text-[#00ffae] hover:bg-[#00ffae]/10"
        >
          View All Alerts
        </Button>
      </div>
    </Card>
  );
};

// Dashboard Stats component
const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Total Endpoints</p>
        <h3 className="text-white text-2xl font-bold">5</h3>
        <p className="text-[#00ffae] text-xs mt-2">+1 this week</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Overall Uptime</p>
        <h3 className="text-white text-2xl font-bold">97.1%</h3>
        <p className="text-[#00ffae] text-xs mt-2">+0.5% from last week</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Total Pings (24h)</p>
        <h3 className="text-white text-2xl font-bold">768</h3>
        <p className="text-[#00ffae] text-xs mt-2">On track</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Current Status</p>
        <h3 className="text-white text-2xl font-bold flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          4/5 Up
        </h3>
        <p className="text-red-400 text-xs mt-2">1 endpoint down</p>
      </motion.div>
    </div>
  );
};

// Main Dashboard Page component
const Dashboard = () => {
  return (
    <div className="bg-[#0e0e10] min-h-screen text-white">
      <ToastProvider>
        {/* Mobile navigation */}
        <MobileNav />

        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="md:ml-60 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Welcome back, Alex</h1>
              <p className="text-gray-400">
                Monitor your endpoints and keep everything running smoothly.
              </p>
            </div>

            <DashboardStats />

            <Tabs defaultValue="endpoints" className="mb-8">
              <TabsList className="bg-[#1a1a1c] border-gray-800">
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="add">Add New</TabsTrigger>
              </TabsList>

              <TabsContent value="endpoints" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Your Monitored Endpoints
                  </h2>
                  <Button className="bg-[#00ffae] hover:bg-[#00ffae]/90 text-[#0e0e10]">
                    <Plus size={16} className="mr-2" />
                    Add New
                  </Button>
                </div>

                <EndpointList endpoints={mockEndpoints} />
              </TabsContent>

              <TabsContent value="add" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-1">
                    Add New Endpoint
                  </h2>
                  <p className="text-gray-400">
                    Enter the details of the endpoint you want to monitor.
                  </p>
                </div>

                <AddEndpointForm />
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <RecentAlertsPanel alerts={mockAlerts} />
            </div>
          </motion.div>
        </main>

        <Toaster />
      </ToastProvider>
    </div>
  );
};

export default Dashboard;
