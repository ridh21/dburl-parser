"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UrlInput } from "@/components/url-input";
import { ResultsDisplay } from "@/components/results-display";
import { ParsedDatabaseUrl } from "@/lib/db-parser";
import Link from "next/link";

export default function Home() {
  const [parsedResult, setParsedResult] = useState<ParsedDatabaseUrl | null>(null);

  const handleParsed = (result: ParsedDatabaseUrl) => {
    setParsedResult(result);
  };

  const handleReset = () => {
    setParsedResult(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">DB URL Parser</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Database URL to Client Parameters</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                v1.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Hero Section */}
          {!parsedResult && (
            <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Conversion
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Convert Database URLs to{" "}
                <span className="gradient-text">Client Parameters</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Paste your database connection URL and get ready-to-use configuration parameters for DBeaver, pgAdmin, and more.
              </p>

              {/* Supported DBs */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">PostgreSQL</Badge>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">MySQL</Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">MariaDB</Badge>
                </div>
              </div>
            </div>
          )}

          {/* URL Input Card */}
          <Card className={`border-border bg-card/50 backdrop-blur-sm transition-all duration-500 ${parsedResult ? "shadow-lg glow-primary" : ""}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Database Connection URL</CardTitle>
                  <CardDescription>
                    Paste your connection string from your cloud provider or local setup
                  </CardDescription>
                </div>
                {parsedResult && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <UrlInput onParsed={handleParsed} />
            </CardContent>
          </Card>

          {/* Results */}
          {parsedResult && <ResultsDisplay parsed={parsedResult} />}

          {/* Features Section - Only show when no results */}
          {!parsedResult && (
            <div className="grid md:grid-cols-3 gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Instant Parsing</h3>
                  <p className="text-sm text-muted-foreground">
                    Parse URLs in milliseconds with automatic database type detection.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">100% Private</h3>
                  <p className="text-sm text-muted-foreground">
                    All processing happens locally. Your credentials never leave your browser.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/30">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">One-Click Copy</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy individual fields or entire configurations with a single click.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Built by <Link href="https://github.com/ridh21" target="_blank">Ridham Patel</Link></p>
            <div className="flex items-center gap-4">
              <span>Supports PostgreSQL, MySQL, MariaDB</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
