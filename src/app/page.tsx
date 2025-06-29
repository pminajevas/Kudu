import Hero from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyKudu from '@/components/landing/WhyKudu';
import ActivityStats from '@/components/landing/ActivityStats';
import CallToAction from '@/components/landing/CallToAction';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <div className="flex flex-col relative">
      <AnimatedBackground />
      <Hero />
      <HowItWorks />
      <WhyKudu />
      <ActivityStats />
      <CallToAction />
    </div>
  );
}
