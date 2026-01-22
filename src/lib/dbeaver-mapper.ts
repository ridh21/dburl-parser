/**
 * DBeaver Configuration Mapper
 * Converts parsed database URL to DBeaver-specific configuration
 */

import { ParsedDatabaseUrl, getDatabaseTypeName, getDriverClassName } from './db-parser';

export interface DBeaverConfig {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    driverType: string;
    driverClass: string;
    sslMode: string;
    jdbcUrl: string;
    connectionName: string;
}

/**
 * Maps parsed URL to DBeaver configuration
 */
export function mapToDBeaverConfig(parsed: ParsedDatabaseUrl): DBeaverConfig {
    // Map SSL mode to DBeaver-compatible values
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

    // Generate a friendly connection name
    const connectionName = `${getDatabaseTypeName(parsed.dbType)} - ${parsed.database}@${parsed.host}`;

    return {
        host: parsed.host,
        port: String(parsed.port),
        database: parsed.database,
        username: parsed.username,
        password: parsed.password,
        driverType: getDatabaseTypeName(parsed.dbType),
        driverClass: getDriverClassName(parsed.dbType),
        sslMode,
        jdbcUrl: parsed.jdbcUrl || '',
        connectionName,
    };
}

/**
 * Returns field descriptions for DBeaver UI
 */
export function getDBeaverFieldDescriptions(): Record<keyof DBeaverConfig, string> {
    return {
        host: 'Server host address',
        port: 'Server port',
        database: 'Database name',
        username: 'Database user',
        password: 'User password',
        driverType: 'Database driver type',
        driverClass: 'JDBC driver class name',
        sslMode: 'SSL connection mode',
        jdbcUrl: 'JDBC connection URL',
        connectionName: 'Suggested connection name',
    };
}

/**
 * Returns connection instructions for DBeaver
 */
export function getDBeaverInstructions(dbType: string): string[] {
    return [
        '1. Open DBeaver and click "New Database Connection"',
        `2. Select "${dbType}" from the database list`,
        '3. Enter the Host, Port, and Database values',
        '4. Click "Authentication" tab and enter Username/Password',
        '5. Click "SSL" tab to configure SSL mode if needed',
        '6. Click "Test Connection" to verify',
        '7. Click "Finish" to save the connection',
    ];
}
