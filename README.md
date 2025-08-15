# 📦 MOVED TO MONOREPO

This project has been consolidated into a monorepo for better code sharing and development experience.

## 🔗 New Location
**👉 [my-many-books](https://github.com/d-caruso/my-many-books)**

### What moved where:
- **API code**: `apps/api/`
- **Web app code**: `apps/web-app/`
- **Shared code**: `libs/`

### For Contributors:
```bash
# Old way
git clone https://github.com/d-caruso/my-many-books-api.git
git clone https://github.com/d-caruso/my-many-books-web.git

# New way
git clone https://github.com/d-caruso/my-many-books.git
cd my-many-books
nx serve api      # Start API
nx serve web-app  # Start web app
```

### Benefits:
- 🔄 Easier dependency management
- 🔧 Shared tooling and configs
- 🚀 Atomic commits across frontend/backend
- 📱 Ready for mobile app addition

---

## Legacy Documentation

**Note**: This repository is now in maintenance mode and will not receive new updates.

### My Many Books - Web Frontend

A React-based Progressive Web Application for managing personal book collections.

## Features

- Personal book library management
- Progressive Web App (PWA) capabilities
- ISBN barcode scanning
- Book search and filtering
- Configurable themes and responsive design
- Integration with My Many Books API

## Tech Stack

- **React 18** with TypeScript
- **Progressive Web App** (PWA) support
- **Responsive Design** with mobile-first approach
- **Configurable Theming** system
- **ISBN Scanner** integration
- **REST API** integration

## Development Roadmap

- React setup with TypeScript
- PWA configuration
- ISBN scanner component
- Book search functionality
- Book management components
- API integration
- Frontend testing suite
- Responsive design implementation
- Configurable color palette system

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Branch Structure

- `main` - Production-ready releases
- `develop` - Integration branch
- `feature/*` - Feature development branches

## API Integration

This frontend integrates with the [My Many Books API](../my-many-books-api) for:
- User authentication
- Book CRUD operations
- ISBN lookup services
- User library management

## License

MIT