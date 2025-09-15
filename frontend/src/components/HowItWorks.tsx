import { motion } from "framer-motion";

const steps = [
  {
    number: "Step 1",
    title: "Login to your account",
    description:
      "Secure authentication with just a few clicks. No complicated setup required.",
    image: "/how-it-works/1.png",
  },
  {
    number: "Step 2",
    title: "Add URLs to Monitor",
    description:
      "Enter the endpoints you want to keep warm and monitored in your dashboard.",
    image: "/how-it-works/2.png",
  },
  {
    number: "Step 3",
    title: "We Ping Them Regularly",
    description:
      "PingBot automatically sends requests to your endpoints every 30 mins.",
    image: "/how-it-works/3.png",
  },
  {
    number: "Step 4",
    title: "Get Notified if Something Breaks",
    description:
      "Receive instant alerts via email when an endpoint fails to respond or returns an error.",
    image: "/how-it-works/4.png",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-[#121212] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
              PingBot
            </span>{" "}
            Works
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Get up and running in minutes with our simple setup process.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical glowing line + dots */}
          <div className="timeline-wrapper hidden md:block">
            <div className="timeline-line"></div>
          </div>

          <div className="">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  className="relative flex flex-col md:flex-row items-center justify-between mb-32"
                >
                  {/* Content */}
                  <div
                    className={`${
                      isLeft ? "order-1" : "order-2"
                    } flex flex-col items-start gap-2 w-1/2 mb-6 md:mb-0 px-12`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] text-sm font-medium">
                      {step.number}
                    </span>
                    <h3 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold text-white mt-4 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base lg:text-base xl:text-lg leading-6 md:leading-7 lg:leading-7 xl:leading-8">
                      {step.description}
                    </p>
                  </div>

                  {/* Use Image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className={`${
                      isLeft ? "order-2" : "order-1"
                    } w-1/2 px-12 h-full object-contain rounded-xl`}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
