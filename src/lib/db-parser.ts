/**
 * Database URL Parser
 * Parses database connection URLs and extracts structured parameters
 */

export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'unknown';

export interface ParsedDatabaseUrl {
    dbType: DatabaseType;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    sslmode?: string;
    rawParams: Record<string, string>;
    isValid: boolean;
    errors: string[];
    jdbcUrl?: string;
}

// Default ports for different database types
const DEFAULT_PORTS: Record<DatabaseType, number> = {
    postgresql: 5432,
    mysql: 3306,
    mongodb: 27017,
    unknown: 0,
};

// Protocol to database type mapping
const PROTOCOL_MAP: Record<string, DatabaseType> = {
    'postgresql': 'postgresql',
    'postgres': 'postgresql',
    'mysql': 'mysql',
    'mariadb': 'mysql',
    'mongodb': 'mongodb',
    'mongodb+srv': 'mongodb',
};

/**
 * Detects database type from URL protocol
 */
export function detectDatabaseType(url: string): DatabaseType {
    const protocolMatch = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);
    if (!protocolMatch) return 'unknown';

    const protocol = protocolMatch[1].toLowerCase();
    return PROTOCOL_MAP[protocol] || 'unknown';
}

/**
 * Parses a database URL and extracts all components
 */
export function parseDatabaseUrl(urlString: string): ParsedDatabaseUrl {
    const errors: string[] = [];

    // Trim whitespace
    urlString = urlString.trim();

    // Initial validation
    if (!urlString) {
        return createErrorResult(['URL cannot be empty']);
    }

    // Detect database type
    const dbType = detectDatabaseType(urlString);
    if (dbType === 'unknown') {
        return createErrorResult([
            'Unsupported or invalid database URL protocol. Supported protocols: postgresql://, postgres://, mysql://, mariadb://, mongodb://'
        ]);
    }

    try {
        // Parse using URL API
        const url = new URL(urlString);

        // Extract host
        const host = url.hostname;
        if (!host) {
            errors.push('Host is required');
        }

        // Extract port (use default if not specified)
        const port = url.port ? parseInt(url.port, 10) : DEFAULT_PORTS[dbType];

        // Extract database name (remove leading slash)
        const database = decodeURIComponent(url.pathname.slice(1));
        if (!database) {
            errors.push('Database name is required');
        }

        // Extract credentials (decode URL-encoded values)
        const username = url.username ? decodeURIComponent(url.username) : '';
        const password = url.password ? decodeURIComponent(url.password) : '';

        // Extract query parameters
        const rawParams: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
            rawParams[key] = value;
        });

        // Extract SSL mode
        const sslmode = rawParams['sslmode'] || rawParams['ssl'] || rawParams['tls'];

        // Generate JDBC URL if PostgreSQL or MySQL
        const jdbcUrl = generateJdbcUrl(dbType, host, port, database, rawParams);

        if (errors.length > 0) {
            return {
                dbType,
                host: host || '',
                port,
                database: database || '',
                username,
                password,
                sslmode,
                rawParams,
                isValid: false,
                errors,
                jdbcUrl,
            };
        }

        return {
            dbType,
            host,
            port,
            database,
            username,
            password,
            sslmode,
            rawParams,
            isValid: true,
            errors: [],
            jdbcUrl,
        };
    } catch (error) {
        return createErrorResult([
            `Failed to parse URL: ${error instanceof Error ? error.message : 'Invalid URL format'}`
        ]);
    }
}

/**
 * Creates an error result with default values
 */
function createErrorResult(errors: string[]): ParsedDatabaseUrl {
    return {
        dbType: 'unknown',
        host: '',
        port: 0,
        database: '',
        username: '',
        password: '',
        rawParams: {},
        isValid: false,
        errors,
    };
}

/**
 * Generates a JDBC URL from parsed parameters
 */
function generateJdbcUrl(
    dbType: DatabaseType,
    host: string,
    port: number,
    database: string,
    params: Record<string, string>
): string {
    if (dbType === 'postgresql') {
        let jdbcUrl = `jdbc:postgresql://${host}:${port}/${database}`;
        const paramPairs = Object.entries(params);
        if (paramPairs.length > 0) {
            jdbcUrl += '?' + paramPairs.map(([k, v]) => `${k}=${v}`).join('&');
        }
        return jdbcUrl;
    }

    if (dbType === 'mysql') {
        let jdbcUrl = `jdbc:mysql://${host}:${port}/${database}`;
        const paramPairs = Object.entries(params);
        if (paramPairs.length > 0) {
            jdbcUrl += '?' + paramPairs.map(([k, v]) => `${k}=${v}`).join('&');
        }
        return jdbcUrl;
    }

    return '';
}

/**
 * Returns a human-readable database type name
 */
export function getDatabaseTypeName(dbType: DatabaseType): string {
    const names: Record<DatabaseType, string> = {
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        unknown: 'Unknown',
    };
    return names[dbType];
}

/**
 * Returns the driver class name for DBeaver/JDBC
 */
export function getDriverClassName(dbType: DatabaseType): string {
    const drivers: Record<DatabaseType, string> = {
        postgresql: 'org.postgresql.Driver',
        mysql: 'com.mysql.cj.jdbc.Driver',
        mongodb: 'mongodb.jdbc.MongoDriver',
        unknown: '',
    };
    return drivers[dbType];
}
