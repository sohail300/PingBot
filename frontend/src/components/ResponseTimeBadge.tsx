import { Clock } from "lucide-react";

// Response time badge with color based on duration
interface ResponseTimeBadgeProps {
  time: number;
}

export const ResponseTimeBadge: React.FC<ResponseTimeBadgeProps> = ({
  time,
}) => {
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
