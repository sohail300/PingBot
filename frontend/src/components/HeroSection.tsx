"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "motion/react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black w-full relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#00ffae]/10 to-[#00e0ff]/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#00e0ff]/10 to-[#00ffae]/10 rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-16 h-16 bg-gradient-to-r from-[#00ffae]/20 to-[#00e0ff]/20 rounded-full blur-lg"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main heading */}
            <div className="space-y-4">
              <motion.h1
                className="text-5xl lg:text-7xl font-semibold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
                  {"PingBot".split("").map((word, idx) => (
                    <motion.span
                      key={idx}
                      className="inline-block"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + idx * 0.04 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <motion.p
                className="text-lg lg:text-xl text-neutral-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Keep your endpoints{" "}
                <span className="text-[#00ffae] font-medium">alive</span>,
                prevent{" "}
                <span className="text-[#00e0ff] font-medium">cold starts</span>,
                and <span className="text-[#00ffae] font-medium">monitor</span>{" "}
                uptime with instant notifications.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <SignedOut>
                <motion.button
                  className="group relative px-6 py-2 rounded-xl bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-bold text-lg hover:shadow-2xl hover:shadow-[#00ffae]/30 transition-all cursor-pointer overflow-hidden"
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00e0ff] to-[#00ffae] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </SignedOut>
              <SignedIn>
                <motion.button
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-bold text-lg hover:shadow-2xl hover:shadow-[#00ffae]/30 transition-all cursor-pointer overflow-hidden"
                  onClick={() => navigate("/dashboard")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00e0ff] to-[#00ffae] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </SignedIn>
            </motion.div>
          </motion.div>

          {/* Right side - World Map */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Map container with glow effect */}
              <div className="relative p-4 rounded-3xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border border-neutral-700/50 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#00ffae]/5 to-[#00e0ff]/5" />
                <WorldMap
                  isDarkMode={true}
                  dots={[
                    {
                      start: { lat: 64.2008, lng: -149.4937 }, // Alaska
                      end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                    },
                    {
                      start: { lat: 64.2008, lng: -149.4937 }, // Alaska
                      end: { lat: -15.7975, lng: -47.8919 }, // Brazil
                    },
                    {
                      start: { lat: -15.7975, lng: -47.8919 }, // Brazil
                      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                    },
                    {
                      start: { lat: 51.5074, lng: -0.1278 }, // London
                      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    },
                    {
                      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                    },
                    {
                      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                      end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                    },
                  ]}
                />
              </div>

              {/* Floating stats */}
              <motion.div
                className="absolute -top-4 -right-4 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00ffae]/10 to-[#00e0ff]/10 border border-[#00ffae]/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-[#00ffae] rounded-full mr-3 animate-pulse" />
                <span className="text-sm text-[#00ffae] font-medium">
                  Real-time Monitoring
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
