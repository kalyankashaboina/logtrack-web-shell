# LogTrack Host - Micro-Frontend Shell Application

A modern, scalable micro-frontend host application built with **React 19**, **Vite**, and **Module Federation**. This application serves as the container shell for multiple federated micro-frontends, providing a unified navigation and routing experience.

## Overview

LogTrack Host is the orchestrator application that:

- Loads and manages multiple micro-frontend applications
- Provides a unified navigation experience
- Handles client-side routing across federated modules
- Shares common dependencies (React, React DOM) to reduce bundle size
- Supports both local development and production deployments

### Architecture

```
┌─────────────────────────────────────────────┐
│         LogTrack Host (Shell)                │
│  • Navigation & Routing                      │
│  • Module Federation Container               │
│  • Shared Dependencies Management            │
└──────────┬──────────────────┬────────────────┘
           │                  │
    ┌──────▼──────┐    ┌──────▼──────┐
    │  Users MFE   │    │  Audit MFE   │
    │ (localhost   │    │ (localhost   │
    │   :5001)     │    │   :5002)     │
    └──────────────┘    └──────────────┘
```

## Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Latest stable version
- Git

### Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

### Development

Run the host application in local development mode:

```bash
npm run dev
```

This command:

- Starts the development server on `http://localhost:3000`
- Connects to micro-frontends running on `localhost:5001` (Users) and `localhost:5002` (Audit)
- Enables hot module replacement (HMR)
- Auto-opens the application in your default browser

**Note**: Ensure micro-frontend applications are running on their respective ports for full functionality.

### Building

#### Production Build

```bash
npm run build
```

Generates optimized production bundle with:

- Code splitting enabled
- CSS code splitting
- ESBuild minification
- Source maps disabled for security

#### Local Build

```bash
npm run build:local
```

Creates a build using local development configuration for testing.

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Script                | Description                        |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Start development server with HMR  |
| `npm run build`       | Create production-optimized bundle |
| `npm run build:local` | Build with local configuration     |
| `npm run preview`     | Preview production build locally   |
| `npm run lint`        | Run ESLint to check code quality   |
| `npm run lint:fix`    | Automatically fix ESLint issues    |
| `npm run format`      | Format code with Prettier          |

## Project Structure

```
host/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.scss             # Application styles
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── assets/              # Static assets
│   └── types/
│       └── federation.d.ts   # Type definitions for federated modules
├── public/                  # Static files
├── vite.config.base.ts      # Base Vite configuration
├── vite.config.local.ts     # Local development configuration
├── vite.config.prod.ts      # Production configuration with federation
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
└── package.json             # Project dependencies
```

## Module Federation Setup

### Remotes Configuration

The host application loads micro-frontends through Module Federation:

#### Production (`vite.config.prod.ts`)

```typescript
remotes: {
  users_app: 'https://logtrack-users-microfrontend.vercel.app/assets/remoteEntry.js',
  audit_app: 'https://logtrack-audit-microfrontend.vercel.app/assets/remoteEntry.js'
}
```

#### Local Development (`vite.config.local.ts`)

```typescript
remotes: {
  users_app: 'http://localhost:5001/assets/remoteEntry.js',
  audit_app: 'http://localhost:5002/assets/remoteEntry.js'
}
```

### Shared Dependencies

Dependencies are configured to be shared across all federated applications to minimize bundle duplication:

```typescript
shared: {
  react: { singleton: true, requiredVersion: '^19.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.2.0' }
}
```

**Singleton Mode**: Ensures only one instance of React and React DOM is loaded across all applications, reducing memory usage and potential bugs.

### Loading Federated Components

Micro-frontend modules are loaded using dynamic imports with React Suspense:

```typescript
const Users = React.lazy(() => import('users_app/UsersWidget') as any)
const Audit = React.lazy(() => import('audit_app/AuditWidget') as any)

// Usage in routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/users" element={<Users />} />
    <Route path="/audit" element={<Audit />} />
  </Routes>
</Suspense>
```

## Technologies

| Technology        | Version | Purpose                      |
| ----------------- | ------- | ---------------------------- |
| React             | 19.2.0  | UI framework                 |
| React Router DOM  | 6.30.2  | Client-side routing          |
| Vite              | 7.2.4   | Build tool & dev server      |
| Module Federation | 1.4.1   | Micro-frontend orchestration |
| TypeScript        | 5.9.3   | Type safety                  |
| SASS              | 1.94.2  | Styling                      |
| ESLint            | 9.39.1  | Code quality                 |
| Prettier          | Latest  | Code formatting              |

## Configuration Details

### TypeScript

The project uses a modular TypeScript configuration:

- `tsconfig.json` - Base configuration with project references
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Build tool configuration

### Build Optimization

The production build configuration includes:

- **Target**: ESNext for modern browsers
- **Minification**: ESBuild for faster builds
- **CSS Code Splitting**: Enabled for better caching
- **Source Maps**: Disabled in production for security
- **Tree Shaking**: Enabled by default with Vite

## Environment Variables

Define environment variables for different deployment environments:

```bash
# .env.local (local development)
VITE_USERS_REMOTE=http://localhost:5001/assets/remoteEntry.js
VITE_AUDIT_REMOTE=http://localhost:5002/assets/remoteEntry.js

# .env.production (production)
VITE_USERS_REMOTE=https://logtrack-users-microfrontend.vercel.app/assets/remoteEntry.js
VITE_AUDIT_REMOTE=https://logtrack-audit-microfrontend.vercel.app/assets/remoteEntry.js
```

## Code Quality

### Linting

Enforce code standards with ESLint:

```bash
# Check for issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**ESLint Rules**:

- React hooks rules
- React refresh rules
- TypeScript-specific rules
- Global variables configuration

### Code Formatting

Format code consistently with Prettier:

```bash
npm run format
```

## Deployment

### Production Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy the `dist/` directory** to your hosting service:

   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting provider

3. **Ensure remote applications** are deployed and accessible at the configured URLs

### Key Considerations

- **CORS**: Ensure micro-frontend applications are accessible from the host domain
- **HTTPS**: Use HTTPS in production for security
- **Versioning**: Implement versioning strategy for micro-frontend updates
- **Health Checks**: Monitor remote entry points for availability

## Development Workflow

### Local Development with All Micro-Frontends

1. **Terminal 1** - Start Host:

   ```bash
   npm run dev
   ```

2. **Terminal 2** - Start Users Micro-Frontend:

   ```bash
   cd ../users-app
   npm run dev
   ```

3. **Terminal 3** - Start Audit Micro-Frontend:
   ```bash
   cd ../audit-app
   npm run dev
   ```

The host will automatically load modules from the local development servers.

### Troubleshooting

| Issue                       | Solution                                          |
| --------------------------- | ------------------------------------------------- |
| Remote entry not loading    | Verify micro-frontend is running on correct port  |
| Module not found            | Check federation config in `vite.config.local.ts` |
| Shared dependency conflicts | Ensure all apps use compatible versions           |
| CORS errors                 | Enable CORS on micro-frontend servers             |
| Blank page on route         | Check Suspense boundary in App.tsx                |

## Performance Best Practices

1. **Lazy Loading**: Micro-frontends are loaded only when their routes are accessed
2. **Code Splitting**: CSS and JavaScript are split for optimal caching
3. **Shared Dependencies**: React and React DOM are shared to reduce bundle size
4. **Production Optimization**: ESBuild minification for smaller output

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Requires ES2020+ support (ESNext target)

## Contributing

1. Follow the ESLint and Prettier configuration
2. Run `npm run lint:fix` and `npm run format` before committing
3. Test changes with `npm run dev`
4. Build locally with `npm run build:local` to verify production compatibility

## License

Proprietary - LogTrack Web Shell

## Support & Documentation

- **Module Federation Docs**: [originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **React Router**: [reactrouter.com](https://reactrouter.com)
- **Module Federation Concepts**: [webpack.js.org/concepts/module-federation](https://webpack.js.org/concepts/module-federation/)

---

**Last Updated**: November 2025  
**Repository**: logtrack-web-shell  
**Branch**: master
