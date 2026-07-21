import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { CTASection } from "@/components/marketing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <PricingPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
