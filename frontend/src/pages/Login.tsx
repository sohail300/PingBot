import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0e0e10]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffae]/20 via-transparent to-[#00e0ff]/20 animate-gradient" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <SignIn />
      </div>
    </div>
  );
}
