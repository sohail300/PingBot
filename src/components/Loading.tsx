import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const Loading = ({ showLogo = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out"
      style={{ backgroundColor: "#0e0e10" }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900/5" />

      {/* Main loading container */}
      <div
        className={`flex flex-col items-center justify-center space-y-8 transition-all duration-1000 ease-out transform ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Animated Logo/Icon Section */}
        {showLogo && (
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full animate-ping">
              <div
                className="w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: "#00ffae" }}
              />
            </div>

            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full animate-ping animation-delay-300">
              <div
                className="w-20 h-20 rounded-full opacity-30"
                style={{ backgroundColor: "#00e0ff" }}
              />
            </div>

            {/* Inner static ring with glow */}
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-40"
                style={{ backgroundColor: "#00ffae" }}
              />
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-sm"
                style={{
                  borderColor: "#00ffae",
                  backgroundColor: "rgba(0, 255, 174, 0.1)",
                }}
              >
                {/* Rotating activity icon */}
                <Activity
                  className="w-8 h-8 animate-pulse"
                  style={{ color: "#00ffae" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-ping opacity-30"
              style={{
                backgroundColor: i % 2 === 0 ? "#00ffae" : "#00e0ff",
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
