import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0e0e10] border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
      <p className="text-gray-400 text-sm">
        © PingBot 2025. All rights reserved.
      </p>

      <div className="flex space-x-6 mt-4 md:mt-0">
        <a
          href="https://github.com/sohail300"
          target="_blank"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Github size={20} />
        </a>
        <a
          href="https://x.com/sohail_twts"
          target="_blank"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Twitter size={20} />
        </a>
      </div>
    </footer>
  );
};
