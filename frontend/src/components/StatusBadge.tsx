import { AlertCircle } from "lucide-react";

import { CheckCircle } from "lucide-react";

// Badge component for status codes
interface StatusBadgeProps {
  code: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ code }) => {
  const getStatusMessage = (code: number) => {
    switch (code) {
      case 200:
        return "OK";
      case 404:
        return "Not Found";
      case 500:
        return "Internal Server Error";
      default:
        return "Unknown";
    }
  };

  if (code >= 200 && code < 300) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
          {code} {getStatusMessage(code)}
        </span>
        <CheckCircle size={16} className="text-green-400" />
      </div>
    );
  } else if (code >= 400 && code < 500) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
          {code} {getStatusMessage(code)}
        </span>
        <AlertCircle size={16} className="text-yellow-400" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
          {code} {getStatusMessage(code)}
        </span>
        <AlertCircle size={16} className="text-red-400" />
      </div>
    );
  }
};
