import { Bell, RefreshCw, BarChart2 } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-[#0e0e10] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={RefreshCw}
            title="Automatic Pings"
            description="Pings every 30 mins to keep your apis warm and prevent cold starts, improving response times for your users."
          />
          <FeatureCard
            icon={BarChart2}
            title="Uptime Monitoring"
            description="Track your service availability and performance metrics over time with detailed dashboards."
          />
          <FeatureCard
            icon={Bell}
            title="Instant Alerts"
            description="Receive notifications via email when your endpoints go down or respond with errors."
          />
        </div>
      </div>
    </section>
  );
};

type FeatureCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
};

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center bg-[#1a1a1c] border border-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-[#00ffae]/10 hover:-translate-y-1 transition-all duration-300">
      <div className="h-14 w-14 rounded-full bg-[#00ffae]/10 flex items-center justify-center mb-4">
        <Icon size={24} className="text-[#00ffae]" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  );
};
