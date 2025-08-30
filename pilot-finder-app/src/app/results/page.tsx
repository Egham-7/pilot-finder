"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  businessName: string;
  businessDescription: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface Analysis {
  id: string;
  marketViability: string;
  marketSize: string;
  brutHonestAssessment: string;
  recommendations: string;
  competitorAnalysis: any[];
  customerSegments: any[];
  painPoints: any[];
  marketTrends: any[];
}

interface Lead {
  id: string;
  leadSource: string;
  leadTitle: string;
  leadDescription: string;
  leadUrl: string;
  contactInfo: string;
  painPointMatch: string;
  outreachStrategy: string;
  priority: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [session, setSession] = useState<Session | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/onboard?sessionId=${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          setSession(data.session);
          setAnalysis(data.analysis);
          setLeads(data.leads || []);
        } else {
          setError(data.error || 'Failed to fetch results');
        }
      } catch (err) {
        setError('Network error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Poll for updates if still processing
    const interval = setInterval(() => {
      if (session?.status === 'processing') {
        fetchResults();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId, session?.status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.href = '/onboarding'} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (session?.status === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Analyzing Your Business</h1>
          <p className="text-muted-foreground mb-2">
            Our AI agent is conducting deep research on your business idea...
          </p>
          <p className="text-sm text-muted-foreground">
            This typically takes 2-5 minutes. We're gathering real market data and finding potential pilot customers.
          </p>
        </div>
      </div>
    );
  }

  if (session?.status === 'failed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Analysis Failed</h1>
          <p className="text-muted-foreground mb-4">
            We encountered an issue analyzing your business. Please try again.
          </p>
          <Button onClick={() => window.location.href = '/onboarding'}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analysis Results for {session?.businessName}
          </h1>
          <p className="text-muted-foreground">
            Here's what our AI discovered about your business and potential pilot customers
          </p>
        </div>

        {analysis && (
          <div className="space-y-8">
            {/* Market Viability */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Market Viability</h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.marketViability === 'viable' ? 'bg-green-100 text-green-800' :
                  analysis.marketViability === 'oversaturated' ? 'bg-red-100 text-red-800' :
                  analysis.marketViability === 'pivot_needed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {analysis.marketViability.replace('_', ' ').toUpperCase()}
                </span>
                {analysis.marketSize && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {analysis.marketSize.toUpperCase()} MARKET
                  </span>
                )}
              </div>
            </div>

            {/* Brutal Honest Assessment */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Honest Assessment</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{analysis.brutHonestAssessment}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{analysis.recommendations}</p>
              </div>
            </div>

            {/* Pilot Leads */}
            {leads.length > 0 && (
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Potential Pilot Customers</h2>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border rounded p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{lead.leadTitle}</h3>
                        <span className="px-2 py-1 rounded text-xs bg-primary text-primary-foreground">
                          Priority {lead.priority}/5
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{lead.leadDescription}</p>
                      {lead.painPointMatch && (
                        <p className="text-sm"><strong>Why this lead:</strong> {lead.painPointMatch}</p>
                      )}
                      {lead.outreachStrategy && (
                        <p className="text-sm"><strong>Outreach strategy:</strong> {lead.outreachStrategy}</p>
                      )}
                      {lead.leadUrl && (
                        <a href={lead.leadUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary hover:underline">
                          View Source →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/onboarding'}>
            Analyze Another Business
          </Button>
        </div>
      </div>
    </div>
  );
}