"use client";

import { useState } from "react";
import { WelcomeModal } from "@/components/ui/welcome-modal";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!businessName.trim() || !businessDescription.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessDescription: businessDescription.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to results page with session ID
        router.push(`/results?sessionId=${data.sessionId}`);
      } else {
        console.error('Onboarding failed:', data.error);
        alert('Failed to start analysis. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WelcomeModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Welcome to PilotFinder"
      description="Tell us about your business to get started with AI-powered customer discovery"
      mainActionText={isLoading ? "Analyzing..." : "Start Pilot Discovery"}
      onMainActionClick={handleSubmit}
      showDontShowAgain={false}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="businessName" className="text-sm font-medium text-foreground">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter your business name"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="businessDescription" className="text-sm font-medium text-foreground">
            Business Description
          </label>
          <textarea
            id="businessDescription"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder="Describe your business, what problem it solves, and who your target customers are"
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            required
          />
        </div>
      </div>
    </WelcomeModal>
  );
}