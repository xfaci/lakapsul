import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Hero />
      <FeaturesGrid />
      <CtaSection />
    </div>
  );
}
