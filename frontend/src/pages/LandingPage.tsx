import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/Features";
import { HowItWorksSection } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { RenderShowcase } from "@/components/RenderShowcase";

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RenderShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </>
  );
}

export default LandingPage;
