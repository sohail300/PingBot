import { RefreshCw } from "lucide-react";

export const Logo = () => (
  <div className="flex items-center space-x-2 px-4 py-2">
    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff] flex items-center justify-center">
      <RefreshCw size={16} className="text-[#0e0e10]" />
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
      PingBot
    </span>
  </div>
);
