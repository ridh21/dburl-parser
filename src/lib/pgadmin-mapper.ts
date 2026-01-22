/**
 * pgAdmin Configuration Mapper
 * Converts parsed database URL to pgAdmin-specific configuration
 */

import { ParsedDatabaseUrl, getDatabaseTypeName } from './db-parser';

export interface PgAdminConfig {
    name: string;
    host: string;
    port: string;
    maintenanceDatabase: string;
    username: string;
    password: string;
    sslMode: string;
    connectionTimeout: string;
    comment: string;
}

/**
 * Maps parsed URL to pgAdmin configuration
 */
export function mapToPgAdminConfig(parsed: ParsedDatabaseUrl): PgAdminConfig {
    // Map SSL mode to pgAdmin-compatible values
    const sslModeMap: Record<string, string> = {
        'require': 'require',
        'verify-ca': 'verify-ca',
        'verify-full': 'verify-full',
        'prefer': 'prefer',
        'allow': 'allow',
        'disable': 'disable',
        'true': 'require',
        'false': 'disable',
    };

    const sslMode = parsed.sslmode
        ? (sslModeMap[parsed.sslmode.toLowerCase()] || parsed.sslmode)
        : 'prefer';

    // Generate a friendly server name
    const name = `${parsed.database} @ ${parsed.host}`;

    // Extract connection timeout if present
    const connectionTimeout = parsed.rawParams['connect_timeout'] || '10';

    return {
        name,
        host: parsed.host,
        port: String(parsed.port),
        maintenanceDatabase: parsed.database,
        username: parsed.username,
        password: parsed.password,
        sslMode,
        connectionTimeout,
        comment: `Imported from ${getDatabaseTypeName(parsed.dbType)} connection URL`,
    };
}

/**
 * Returns field descriptions for pgAdmin UI
 */
export function getPgAdminFieldDescriptions(): Record<keyof PgAdminConfig, string> {
    return {
        name: 'Display name for this server in pgAdmin',
        host: 'Host name or address of the server',
        port: 'Port number (default: 5432)',
        maintenanceDatabase: 'Initial database to connect to',
        username: 'Username for authentication',
        password: 'Password for authentication',
        sslMode: 'SSL mode for secure connections',
        connectionTimeout: 'Connection timeout in seconds',
        comment: 'Optional description for this server',
    };
}

/**
 * Returns connection instructions for pgAdmin
 */
export function getPgAdminInstructions(): string[] {
    return [
        '1. Open pgAdmin and right-click on "Servers"',
        '2. Select "Register" → "Server..."',
        '3. In "General" tab, enter the Name',
        '4. Go to "Connection" tab',
        '5. Enter Host, Port, Maintenance database, Username, and Password',
        '6. Go to "SSL" tab to configure SSL mode if needed',
        '7. Click "Save" to register the server',
    ];
}

/**
 * Generates pgAdmin import JSON format
 */
export function generatePgAdminImportJson(config: PgAdminConfig): object {
    return {
        Servers: {
            "1": {
                Name: config.name,
                Group: "Servers",
                Host: config.host,
                Port: parseInt(config.port),
                MaintenanceDB: config.maintenanceDatabase,
                Username: config.username,
                SSLMode: config.sslMode,
                Comment: config.comment,
            }
        }
    };
}
