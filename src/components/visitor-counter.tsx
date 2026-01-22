"use client";

import { useEffect, useState } from "react";

interface Stats {
    visitors: number | null;
    pageviews?: number;
}

export function VisitorCounter() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                setStats(data);
            } catch {
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs">Loading...</span>
            </span>
        );
    }

    if (stats?.visitors === null || stats?.visitors === undefined) {
        return null;
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs">
                {stats.visitors.toLocaleString()} visitors
            </span>
        </span>
    );
}
