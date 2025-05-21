# Multilingual Navigation Site Deployment Guide

This document provides instructions for deploying the Multilingual Navigation Site.

## Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher
- SQLite (included in the project)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

The project includes end-to-end tests using Playwright:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in headed mode
pnpm test:headed

# Debug tests
pnpm test:debug
```

## Production Deployment

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Deployment Options

#### Option 1: Static Export

For static site hosting platforms (Netlify, Vercel, etc.):

```bash
pnpm build
```

The static files will be generated in the `out` directory.

#### Option 2: Server Deployment

For server environments:

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

#### Option 3: Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
# Build the Docker image
docker build -t multilingual-nav .

# Run the container
docker run -p 3000:3000 multilingual-nav
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Database
DATABASE_URL=file:./data.db

# Authentication
JWT_SECRET=your-secret-key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Database Migrations

To apply database migrations:

```bash
pnpm drizzle-kit push:sqlite
```

## Troubleshooting

If you encounter any issues during deployment, check the following:

1. Node.js and pnpm versions are compatible
2. All environment variables are correctly set
3. Database migrations have been applied
4. Port 3000 is available (or configure a different port)

For more detailed information, refer to the project documentation.
