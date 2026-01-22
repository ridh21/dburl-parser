"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseDatabaseUrl, getDatabaseTypeName, ParsedDatabaseUrl } from "@/lib/db-parser";

interface UrlInputProps {
    onParsed: (result: ParsedDatabaseUrl) => void;
}

export function UrlInput({ onParsed }: UrlInputProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [detectedType, setDetectedType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlChange = (value: string) => {
        setUrl(value);
        setError(null);

        // Auto-detect database type as user types
        if (value.startsWith("postgresql://") || value.startsWith("postgres://")) {
            setDetectedType("PostgreSQL");
        } else if (value.startsWith("mysql://") || value.startsWith("mariadb://")) {
            setDetectedType("MySQL");
        } else if (value.startsWith("mongodb://") || value.startsWith("mongodb+srv://")) {
            setDetectedType("MongoDB");
        } else {
            setDetectedType(null);
        }
    };

    const handleParse = () => {
        if (!url.trim()) {
            setError("Please enter a database URL");
            return;
        }

        setIsLoading(true);

        // Simulate a tiny delay for UX
        setTimeout(() => {
            const result = parseDatabaseUrl(url);

            if (!result.isValid) {
                setError(result.errors.join(". "));
            } else {
                setError(null);
                onParsed(result);
            }

            setIsLoading(false);
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.metaKey) {
            handleParse();
        }
    };

    const placeholderText = `postgresql://user:password@localhost:5432/mydb?sslmode=require
mysql://user:password@localhost:3306/mydb`;

    return (
        <div className="space-y-4">
            <div className="relative">
                <Textarea
                    placeholder={placeholderText}
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[120px] font-mono text-sm resize-none bg-card border-border focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    aria-label="Database connection URL"
                />
                {detectedType && (
                    <Badge
                        className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30"
                        variant="outline"
                    >
                        {detectedType} detected
                    </Badge>
                )}
            </div>

            {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">Enter</kbd> to parse
                </p>
                <Button
                    onClick={handleParse}
                    disabled={isLoading || !url.trim()}
                    className="min-w-[120px] transition-all duration-200 hover:glow-primary"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Parsing...
                        </span>
                    ) : (
                        "Parse URL"
                    )}
                </Button>
            </div>
        </div>
    );
}
