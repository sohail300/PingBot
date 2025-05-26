import { motion } from "framer-motion";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Total Endpoints</p>
        <h3 className="text-white text-2xl font-bold">5</h3>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-[#1a1a1c] p-5 rounded-xl border border-gray-800 shadow-lg"
      >
        <p className="text-gray-400 text-sm mb-1">Overall Uptime (24 hrs)</p>
        <h3 className="text-white text-2xl font-bold">97.1%</h3>
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
      </motion.div>
    </div>
  );
};
