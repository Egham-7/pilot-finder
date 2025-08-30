import {
  AlertTriangle,
  Bot,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { HeroSection } from "@/components/blocks/hero";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import StatsSection from "@/components/ui/call-to-action";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section with Bento Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedShinyText className="text-lg mb-4">
              🤖 AI-Powered Customer Discovery
            </AnimatedShinyText>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Find Your Pilot Customers Before They Find You
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Most customer discovery tools assume you know who your customers
              are. We don't. Our AI agents scour the internet to find people
              complaining about the exact problem you're solving—or tell you the
              hard truth about pivoting.
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoCard
              name="AI Problem Hunters"
              className="col-span-3 lg:col-span-2"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.3),transparent_50%)]" />
                </div>
              }
              Icon={Bot}
              description="Our AI agents continuously scan Reddit, Twitter, forums, and review sites to find real people actively complaining about problems your startup claims to solve."
              href="/ai-discovery"
              cta="See AI in Action"
            />

            <BentoCard
              name="Brutal Honesty Mode"
              className="col-span-3 lg:col-span-1"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 via-transparent to-chart-5/20" />
              }
              Icon={AlertTriangle}
              description="We're not your cheerleader. If we can't find customers complaining about your problem, we'll tell you exactly why—and where to pivot."
              href="/honesty"
              cta="Get Hard Truth"
            />

            <BentoCard
              name="Real-Time Complaints"
              className="col-span-3 lg:col-span-1"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 via-transparent to-chart-4/20" />
              }
              Icon={MessageSquare}
              description="Live feed of people expressing pain points related to your solution across 50+ platforms, updated every hour."
              href="/complaints"
              cta="View Live Feed"
            />

            <BentoCard
              name="Pain Point Mapping"
              className="col-span-3 lg:col-span-2"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/20 via-transparent to-chart-3/20" />
              }
              Icon={Target}
              description="Visual maps showing where complaints cluster geographically and demographically. Identify underserved markets and customer segments you never knew existed."
              href="/mapping"
              cta="Explore Maps"
            />

            <BentoCard
              name="Pivot Recommendations"
              className="col-span-3 lg:col-span-1"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-chart-4/20 via-transparent to-chart-5/20" />
              }
              Icon={TrendingUp}
              description="When your current idea isn't working, we analyze adjacent problems with more vocal complainers and suggest pivot opportunities."
              href="/pivots"
              cta="Explore Pivots"
            />

            <BentoCard
              name="Competitor Reality Check"
              className="col-span-3 lg:col-span-2"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-secondary/20" />
              }
              Icon={Zap}
              description="See what people really think about your competitors. Unfiltered complaints reveal gaps in the market that surveys would never capture."
              href="/competitors"
              cta="Check Competition"
            />

            <BentoCard
              name="Early Adopter Profiles"
              className="col-span-3 lg:col-span-1"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-1/20" />
              }
              Icon={Users}
              description="Detailed profiles of the most vocal complainers—your potential pilot customers who are desperate for a solution."
              href="/profiles"
              cta="Meet Customers"
            />
          </BentoGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-t from-muted/50 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-r from-destructive/10 via-chart-5/10 to-chart-4/10 border border-destructive/20 rounded-2xl p-8 mb-8">
            <AnimatedShinyText className="text-2xl mb-4 font-semibold text-destructive">
              ⚠️ Warning: We Don't Sugarcoat Reality
            </AnimatedShinyText>
            <p className="text-muted-foreground text-lg">
              Unlike other tools that validate your assumptions, we challenge
              them. Prepare for uncomfortable truths about your market.
            </p>
          </div>

          <StatsSection />
        </div>
      </section>
    </div>
  );
}
