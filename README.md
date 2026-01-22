# dburl-parser

A modern web application that parses database connection URLs and converts them into ready-to-use connection parameters for popular database management tools like **DBeaver** and **pgAdmin**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)

## ✨ Features

- **Instant URL Parsing** - Parse database URLs in milliseconds
- **Auto-Detection** - Automatically detects database type from URL protocol
- **Multi-Database Support** - PostgreSQL, MySQL, and MariaDB
- **Tool-Specific Output** - Ready-to-use configs for DBeaver and pgAdmin
- **One-Click Copy** - Copy individual fields or entire configuration
- **Password Security** - Toggle password visibility with masking
- **Export as JSON** - Download all configurations as JSON
- **100% Private** - All processing happens locally in your browser

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

Paste a database connection URL:

```
postgresql://user:password@localhost:5432/mydb?sslmode=require
mysql://admin:secret@db.example.com:3306/production
```

The app will parse the URL and display:
- **DBeaver** configuration with JDBC URL
- **pgAdmin** server registration parameters

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main application page
│   └── globals.css      # Theme and styling
├── components/
│   ├── url-input.tsx    # URL input with validation
│   ├── results-display.tsx  # Tabbed output display
│   └── parameter-field.tsx  # Reusable field component
└── lib/
    ├── db-parser.ts     # Core URL parsing logic
    ├── dbeaver-mapper.ts    # DBeaver config generator
    └── pgadmin-mapper.ts    # pgAdmin config generator
```

## 🔧 Supported Databases

| Protocol | Database |
|----------|----------|
| `postgresql://` | PostgreSQL |
| `postgres://` | PostgreSQL |
| `mysql://` | MySQL |
| `mariadb://` | MariaDB |

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📄 License

MIT License

## 👤 Author

Built by [Ridham Patel](https://github.com/ridh21)
