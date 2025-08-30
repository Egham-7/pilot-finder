"use client";

import { ExternalLink, FileText, Globe, Search, Users } from "lucide-react";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ScrollArea } from "./scroll-area";

interface ScrapeResultProps {
  data: {
    url: string;
    title?: string;
    content?: string;
    metadata?: any;
    error?: string;
  };
}

export function ScrapeResult({ data }: ScrapeResultProps) {
  if (data.error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Scrape Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileText className="h-4 w-4" />
          Page Scraped
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {data.url}
            <ExternalLink className="h-3 w-3 inline ml-1" />
          </a>
        </div>

        {data.title && (
          <div>
            <h3 className="font-semibold text-foreground mb-1">{data.title}</h3>
          </div>
        )}

        {data.content && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Content Preview
            </h4>
            <ScrollArea className="h-32 w-full rounded border bg-muted/30 p-3">
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {data.content.length > 1000
                  ? `${data.content.substring(0, 1000)}...`
                  : data.content}
              </p>
            </ScrollArea>
          </div>
        )}

        {data.metadata && (
          <div className="flex flex-wrap gap-1">
            {data.metadata.description && (
              <Badge variant="secondary" className="text-xs">
                Has Description
              </Badge>
            )}
            {data.metadata.language && (
              <Badge variant="outline" className="text-xs">
                {data.metadata.language}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CrawlResultProps {
  data: {
    url: string;
    pages?: number;
    data?: Array<{
      url: string;
      title: string;
      content: string;
      metadata?: any;
    }>;
    error?: string;
  };
}

export function CrawlResult({ data }: CrawlResultProps) {
  if (data.error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Crawl Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Globe className="h-4 w-4" />
          Website Crawled
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              {data.url}
              <ExternalLink className="h-3 w-3 inline ml-1" />
            </a>
          </div>
          {data.pages && (
            <Badge className="bg-blue-100 text-blue-800">
              {data.pages} pages
            </Badge>
          )}
        </div>

        {data.data && data.data.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Sample Pages
            </h4>
            <ScrollArea className="h-48 w-full">
              <div className="space-y-3">
                {data.data.slice(0, 5).map((page, index) => (
                  <Card
                    key={index}
                    className="bg-background/50 border-border/50"
                  >
                    <CardContent className="p-3">
                      <h5 className="font-medium text-sm mb-1">{page.title}</h5>
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs mb-2 block"
                      >
                        {page.url}
                      </a>
                      {page.content && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {page.content.substring(0, 150)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {data.data.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    ... and {data.data.length - 5} more pages
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SearchResultProps {
  data: {
    query: string;
    results?: Array<{
      title: string;
      url: string;
      snippet: string;
    }>;
    error?: string;
  };
}

export function SearchResult({ data }: SearchResultProps) {
  if (data.error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Search className="h-4 w-4" />
          Web Search Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">"{data.query}"</span>
          {data.results && (
            <Badge className="bg-green-100 text-green-800">
              {data.results.length} results
            </Badge>
          )}
        </div>

        {data.results && data.results.length > 0 ? (
          <ScrollArea className="h-48 w-full">
            <div className="space-y-3">
              {data.results.map((result, index) => (
                <Card key={index} className="bg-background/50 border-border/50">
                  <CardContent className="p-3">
                    <h5 className="font-medium text-sm mb-1 leading-tight">
                      {result.title}
                    </h5>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-xs mb-2 block"
                    >
                      {result.url}
                      <ExternalLink className="h-3 w-3 inline ml-1" />
                    </a>
                    {result.snippet && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {result.snippet}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DeepResearchResultProps {
  data: {
    query: string;
    focus?: string;
    summary?: string;
    totalSources?: number;
    scrapedSources?: number;
    sources?: Array<{
      url: string;
      title: string;
      content: string;
      metadata?: any;
    }>;
    error?: string;
  };
}

export function DeepResearchResult({ data }: DeepResearchResultProps) {
  if (data.error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <Users className="h-4 w-4" />
            Research Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Users className="h-4 w-4" />
          Deep Research Completed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">"{data.query}"</span>
          </div>

          {data.focus && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {data.focus}
              </Badge>
            </div>
          )}

          <div className="flex gap-4 text-xs text-muted-foreground">
            {data.totalSources && (
              <span>{data.totalSources} sources found</span>
            )}
            {data.scrapedSources && <span>{data.scrapedSources} analyzed</span>}
          </div>
        </div>

        {data.summary && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Research Summary
            </h4>
            <p className="text-sm leading-relaxed bg-background/50 p-3 rounded border">
              {data.summary}
            </p>
          </div>
        )}

        {data.sources && data.sources.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Research Sources
            </h4>
            <ScrollArea className="h-48 w-full">
              <div className="space-y-3">
                {data.sources.map((source, index) => (
                  <Card
                    key={index}
                    className="bg-background/50 border-border/50"
                  >
                    <CardContent className="p-3">
                      <h5 className="font-medium text-sm mb-1 leading-tight">
                        {source.title}
                      </h5>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline text-xs mb-2 block"
                      >
                        {source.url}
                        <ExternalLink className="h-3 w-3 inline ml-1" />
                      </a>
                      {source.content && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {source.content.substring(0, 200)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
