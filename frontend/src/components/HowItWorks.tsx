export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-[#121212] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
              PingBot
            </span>{" "}
            Works
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Get up and running in minutes with our simple setup process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#00ffae] to-[#00e0ff] hidden md:block"></div>

            <div className="space-y-12">
              <StepCard
                number="1"
                title="Login with Google"
                description="Secure authentication with just a few clicks. No complicated setup required."
              />
              <StepCard
                number="2"
                title="Add URLs to Monitor"
                description="Enter the endpoints you want to keep warm and monitored in your dashboard."
              />
              <StepCard
                number="3"
                title="We Ping Them Regularly"
                description="PingBot automatically sends requests to your endpoints every 30 mins."
              />
              <StepCard
                number="4"
                title="Get Notified if Something Breaks"
                description="Receive instant alerts via email when an endpoint fails to respond or returns an error."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="relative flex flex-col md:flex-row items-start gap-4">
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff] flex items-center justify-center text-[#0e0e10] font-bold text-lg z-10">
        {number}
      </div>
      <div className="md:pl-4 pb-10">
        <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};
