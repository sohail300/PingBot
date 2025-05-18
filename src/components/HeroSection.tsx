export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0e0e10] pt-16">
      <PingAnimation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
              PingBot
            </span>
            <br />
            <span className="text-white">Keep your endpoints alive.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Prevent cold starts, monitor uptime, and get instant notifications
            when your services go down.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 rounded-md bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-bold text-lg hover:shadow-lg hover:shadow-[#00ffae]/30 transition-all cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0e0e10] to-transparent"></div>
    </section>
  );
};

const PingAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-40 h-40 rounded-full animate-ping opacity-20 bg-[#00ffae] duration-1000"></div>
      <div className="absolute w-60 h-60 rounded-full animate-ping opacity-10 bg-[#00e0ff] duration-1500 delay-300"></div>
      <div className="absolute w-80 h-80 rounded-full animate-ping opacity-5 bg-[#00ffae] duration-2000 delay-700"></div>
    </div>
  );
};
