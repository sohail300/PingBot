import "./App.css";
import { FeaturesSection } from "./components/Features";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="bg-[#0e0e10] min-h-screen text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default App;
