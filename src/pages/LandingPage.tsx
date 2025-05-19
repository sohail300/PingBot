import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </>
  );
}

export default LandingPage;
