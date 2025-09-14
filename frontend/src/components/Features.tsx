import { Bell, RefreshCw, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };

  return (
    <section id="features" className="bg-[#0e0e10] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
              Features
            </span>{" "}
            that make a difference
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Designed to keep your services running smoothly and your team
            informed when it matters most.
          </p>
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
        >
          <motion.div
            variants={first}
            className="h-full w-1/3 rounded-2xl bg-[#1a1a1c] p-4 border border-gray-800 flex flex-col items-center justify-center"
          >
            <div className="h-14 w-14 rounded-full bg-[#00ffae]/10 flex items-center justify-center mb-4">
              <RefreshCw size={24} className="text-[#00ffae]" />
            </div>
            <p className="sm:text-sm md:text-base text-center font-semibold mt-4">
              Automatic Pings
            </p>
            <p className="text-sm px-2 py-0.5 mt-4 text-gray-400">
              Pings every 30 mins to keep your apis warm and prevent cold
              starts, improving response times for your users.
            </p>
          </motion.div>
          <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-[#1a1a1c] p-4 border border-gray-800 flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-[#00e0ff]/10 flex items-center justify-center mb-4">
              <BarChart2 size={24} className="text-[#00e0ff]" />
            </div>
            <p className="sm:text-sm md:text-base text-center font-semibold mt-4">
              Uptime Monitoring
            </p>
            <p className="text-sm px-2 py-0.5 mt-4 text-gray-400">
              Track your critical service availability and performance metrics
              over time with detailed, highly insightful dashboards.
            </p>
          </motion.div>
          <motion.div
            variants={second}
            className="h-full w-1/3 rounded-2xl bg-[#1a1a1c] p-4 border border-gray-800 flex flex-col items-center justify-center"
          >
            <div className="h-14 w-14 rounded-full bg-[#00ffae]/10 flex items-center justify-center mb-4">
              <Bell size={24} className="text-[#00ffae]" />
            </div>
            <p className="sm:text-sm md:text-base text-center font-semibold mt-4">
              Instant Alerts
            </p>
            <p className="text-sm px-2 py-0.5 mt-4 text-gray-400">
              Receive instant notifications via email whenever your endpoints go
              down or respond back with critical errors.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
