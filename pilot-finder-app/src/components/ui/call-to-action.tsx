"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StatsSection() {
  const { isSignedIn } = useAuth();

  return (
    <section>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-6 text-center">
            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">
              Ready to Face the Truth?
            </h2>
            <div className="flex justify-center gap-3">
              <Button asChild size="lg">
                <Link href={isSignedIn ? "/chat" : "/sign-up"}>
                  {isSignedIn ? "Start Discovery" : "Find My Customers"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
