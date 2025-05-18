export const TestimonialSection = () => {
  return (
    <section className="bg-[#0e0e10] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
              Developers
            </span>{" "}
            Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            See what others are saying about PingBot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-[#00ffae]/10 transition-all">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Sarah T.</h3>
                <p className="text-gray-400 text-sm">Frontend Developer</p>
              </div>
            </div>
            <p className="text-gray-300">
              "PingBot eliminated our cold start issues completely. Our
              serverless functions now respond instantly, and our users noticed
              the difference immediately."
            </p>
          </div>

          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-[#00ffae]/10 transition-all">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"></div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Mark J.</h3>
                <p className="text-gray-400 text-sm">DevOps Engineer</p>
              </div>
            </div>
            <p className="text-gray-300">
              "The alerting system is fantastic. We caught several critical
              endpoint failures before our customers even noticed. Worth every
              penny."
            </p>
          </div>

          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-[#00ffae]/10 transition-all">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-red-500"></div>
              <div className="ml-4">
                <h3 className="text-white font-medium">Alex K.</h3>
                <p className="text-gray-400 text-sm">Startup Founder</p>
              </div>
            </div>
            <p className="text-gray-300">
              "Setup took less than 5 minutes, and we haven't had any downtime
              issues since. The peace of mind alone is worth it for our small
              team."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
