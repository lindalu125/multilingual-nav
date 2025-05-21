# Multilingual Navigation Site

A comprehensive multilingual navigation website boilerplate with tool cards, blog functionality, and admin dashboard.

## Features

- **Multilingual Support**: Switch between English, Chinese, Spanish, and more
- **Tool Navigation System**: Categorized tool cards with auto-fetched favicons
- **Blog Platform**: Full-featured blog with categories, tags, and comments
- **Admin Dashboard**: Manage tools, blog posts, categories, and site settings
- **Dark/Light Theme**: Toggle between light and dark modes
- **Responsive Design**: Mobile-friendly interface
- **User Management**: User registration, login, and profile management
- **Donation System**: Support WeChat Pay and Ko-fi donation options

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT-based authentication
- **Testing**: Playwright for end-to-end testing
- **Deployment**: Docker support, static export options

## Getting Started

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup and deployment instructions.

### Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
multilingual-nav/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/        # Localized routes
│   │   ├── api/             # API routes
│   ├── components/          # React components
│   │   ├── admin/           # Admin dashboard components
│   │   ├── blog/            # Blog components
│   ├── db/                  # Database configuration
│   │   ├── schema/          # Drizzle schema definitions
│   ├── lib/                 # Utility functions
│   ├── messages/            # Translation files
├── public/                  # Static assets
├── tests/                   # Playwright tests
├── migrations/              # Database migrations
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
