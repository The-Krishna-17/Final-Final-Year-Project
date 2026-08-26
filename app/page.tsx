"use client";

import HeroSection from "@/components/Landing/HeroSection";
import ProblemSection from "@/components/Landing/ProblemSection";
import ProcessSection from "@/components/Landing/ProcessSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import ResearchSection from "@/components/Landing/ResearchSection";
import TechnologySection from "@/components/Landing/TechnologySection";
import MissionSection from "@/components/Landing/MissionSection";
import PlatformFeaturesSection from "@/components/Landing/ComingSoonSection";
import FaqSection from "@/components/Landing/FaqSection";
import ContactSection from "@/components/Landing/ContactSection";

const page = () => {
  return (
    <main className="space-y-16" id="home">
      {/* Hero Section */}
      <HeroSection />
      {/* The Problem Section  */}
      <ProblemSection />
      {/* The Process Section  */}
      <ProcessSection />
      {/* Core Features */}
      <FeaturesSection />
      <div className="py-16 relative">
        {/* Dot Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--primary)_2px,transparent_1px)] bg-size-[28px_28px] animate-grid-drift -z-10" />
        <div className="space-y-16">
          {/* Research  */}
          <ResearchSection />
          {/* Technology */}
          <TechnologySection />
        </div>
      </div>
      {/* Mission */}
      <MissionSection />
      {/* Coming Soon */}
      <PlatformFeaturesSection />
      {/* FAQs */}
      <FaqSection />
      {/* Contact */}
      <ContactSection />
    </main>
  );
};

export default page;
