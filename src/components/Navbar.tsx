import { useState, useEffect } from "react";
import { Menu, X, RefreshCw } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/react-router";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e10]/95 backdrop-blur-sm py-2 shadow-lg"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#00ffae] flex items-center justify-center mr-2">
                <RefreshCw size={18} className="text-[#0e0e10]" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-transparent bg-clip-text">
                PingBot
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <SignedIn>
              <div className="ml-10 flex items-center space-x-8">
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <button className="bg-destructive text-white font-medium px-4 py-2 rounded-md hover:shadow-lg transition-all cursor-pointer">
                  Logout
                </button>
              </div>
            </SignedIn>

            <SignedOut>
              <button
                className="bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-medium px-4 py-2 rounded-md hover:shadow-lg hover:shadow-[#00ffae]/20 transition-all cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </SignedOut>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0e0e10]/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* <a
              href="#"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </a>
            <button className="text-destructive font-medium px-4 py-2 rounded-md hover:shadow-lg transition-all cursor-pointer">
              Logout
            </button> */}

            <button
              className="w-full mt-2 bg-gradient-to-r from-[#00ffae] to-[#00e0ff] text-[#0e0e10] font-medium px-3 py-2 rounded-md cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
