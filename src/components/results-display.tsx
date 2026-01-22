"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ParameterField } from "./parameter-field";
import { ParsedDatabaseUrl, getDatabaseTypeName } from "@/lib/db-parser";
import { mapToDBeaverConfig, getDBeaverInstructions, DBeaverConfig } from "@/lib/dbeaver-mapper";
import { mapToPgAdminConfig, getPgAdminInstructions, generatePgAdminImportJson, PgAdminConfig } from "@/lib/pgadmin-mapper";

interface ResultsDisplayProps {
    parsed: ParsedDatabaseUrl;
}

export function ResultsDisplay({ parsed }: ResultsDisplayProps) {
    const [activeTab, setActiveTab] = useState("dbeaver");
    const dbeaverConfig = mapToDBeaverConfig(parsed);
    const pgAdminConfig = mapToPgAdminConfig(parsed);

    const copyAllConfig = async (config: DBeaverConfig | PgAdminConfig, toolName: string) => {
        const configText = Object.entries(config)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

        try {
            await navigator.clipboard.writeText(configText);
            toast.success(`${toolName} configuration copied to clipboard`);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    const exportAsJson = async () => {
        const exportData = {
            original_url: parsed.jdbcUrl,
            database_type: parsed.dbType,
            dbeaver: dbeaverConfig,
            pgadmin: generatePgAdminImportJson(pgAdminConfig),
        };

        try {
            await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
            toast.success("Configuration exported as JSON");
        } catch {
            toast.error("Failed to export configuration");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Connection Parsed Successfully</h2>
                        <p className="text-sm text-muted-foreground">
                            {getDatabaseTypeName(parsed.dbType)} connection to {parsed.host}:{parsed.port}/{parsed.database}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {getDatabaseTypeName(parsed.dbType)}
                    </Badge>
                    {parsed.sslmode && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            SSL: {parsed.sslmode}
                        </Badge>
                    )}
                </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid w-[300px] grid-cols-2">
                        <TabsTrigger value="dbeaver" className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            DBeaver
                        </TabsTrigger>
                        <TabsTrigger value="pgadmin" className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                            </svg>
                            pgAdmin
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyAllConfig(
                                activeTab === "dbeaver" ? dbeaverConfig : pgAdminConfig,
                                activeTab === "dbeaver" ? "DBeaver" : "pgAdmin"
                            )}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportAsJson}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export JSON
                        </Button>
                    </div>
                </div>

                {/* DBeaver Tab */}
                <TabsContent value="dbeaver" className="mt-0">
                    <Card className="border-border bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">DBeaver Connection Parameters</CardTitle>
                            <CardDescription>
                                Use these values to create a new connection in DBeaver
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <ParameterField label="Connection Name" value={dbeaverConfig.connectionName} />
                                <ParameterField label="Driver Type" value={dbeaverConfig.driverType} />
                                <ParameterField label="Host" value={dbeaverConfig.host} isMonospace />
                                <ParameterField label="Port" value={dbeaverConfig.port} isMonospace />
                                <ParameterField label="Database" value={dbeaverConfig.database} isMonospace />
                                <ParameterField label="SSL Mode" value={dbeaverConfig.sslMode} />
                                <ParameterField label="Username" value={dbeaverConfig.username} isMonospace />
                                <ParameterField label="Password" value={dbeaverConfig.password} isPassword isMonospace />
                            </div>

                            <Separator className="my-4" />

                            <ParameterField
                                label="JDBC URL"
                                value={dbeaverConfig.jdbcUrl}
                                isMonospace
                                description="Use this if your tool requires a JDBC connection string"
                            />

                            <ParameterField
                                label="Driver Class"
                                value={dbeaverConfig.driverClass}
                                isMonospace
                                description="JDBC driver class name"
                            />

                            <Separator className="my-4" />

                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Quick Setup Guide
                                </h4>
                                <ol className="text-sm text-muted-foreground space-y-1">
                                    {getDBeaverInstructions(getDatabaseTypeName(parsed.dbType)).map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* pgAdmin Tab */}
                <TabsContent value="pgadmin" className="mt-0">
                    <Card className="border-border bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">pgAdmin Server Configuration</CardTitle>
                            <CardDescription>
                                Register a new server in pgAdmin with these parameters
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {parsed.dbType !== "postgresql" && (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
                                    <p className="text-sm text-yellow-500 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        pgAdmin is designed for PostgreSQL databases. These parameters may not work with {getDatabaseTypeName(parsed.dbType)}.
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-3 md:grid-cols-2">
                                <ParameterField label="Server Name" value={pgAdminConfig.name} />
                                <ParameterField label="Comment" value={pgAdminConfig.comment} />
                                <ParameterField label="Host" value={pgAdminConfig.host} isMonospace />
                                <ParameterField label="Port" value={pgAdminConfig.port} isMonospace />
                                <ParameterField label="Maintenance Database" value={pgAdminConfig.maintenanceDatabase} isMonospace />
                                <ParameterField label="SSL Mode" value={pgAdminConfig.sslMode} />
                                <ParameterField label="Username" value={pgAdminConfig.username} isMonospace />
                                <ParameterField label="Password" value={pgAdminConfig.password} isPassword isMonospace />
                            </div>

                            <Separator className="my-4" />

                            <ParameterField
                                label="Connection Timeout"
                                value={`${pgAdminConfig.connectionTimeout} seconds`}
                                description="Time to wait for a connection before timing out"
                            />

                            <Separator className="my-4" />

                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Quick Setup Guide
                                </h4>
                                <ol className="text-sm text-muted-foreground space-y-1">
                                    {getPgAdminInstructions().map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Privacy Notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-muted-foreground">
                    <strong>Privacy:</strong> All parsing happens locally in your browser. No data is sent to any server.
                </p>
            </div>
        </div>
    );
}
