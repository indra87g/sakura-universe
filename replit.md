# Sakura Universe Minecraft Server

## Overview

Sakura Universe is a full-stack web application for a Minecraft server featuring a modern React frontend with server status display, blog system, contact forms, and comprehensive server information. The application showcases a gaming-themed design with cherry blossom aesthetics and provides essential functionality for a Minecraft community website.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive component system using Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes with persistent storage

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper error handling and request logging
- **Development Setup**: Hot module replacement with Vite integration for seamless development experience
- **Static Assets**: Serves React build artifacts in production

### Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database integration
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Development Storage**: In-memory storage implementation for development/testing
- **Migration System**: Drizzle Kit for database migrations and schema updates

### Key Features Implementation
- **Server Status Monitoring**: Real-time server status with auto-refresh functionality
- **Blog System**: Full-featured blog with markdown content support and slug-based routing
- **Contact Forms**: Form handling with validation using react-hook-form and Zod schemas
- **Responsive Design**: Mobile-first design with comprehensive breakpoint coverage
- **Gaming Aesthetics**: Custom pixel-art inspired styling with cherry blossom theme colors

### Development Architecture
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: Comprehensive TypeScript configuration with strict type checking
- **Development Tools**: Hot reload, error overlay, and development banner integration
- **Asset Management**: Optimized asset handling with path resolution aliases

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for React
- **react-hook-form** + **@hookform/resolvers**: Form handling with validation
- **date-fns**: Date manipulation and formatting utilities

### UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx** + **tailwind-merge**: Conditional className utilities

### Database and Validation
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@neondatabase/serverless**: Neon database serverless driver
- **drizzle-zod**: Schema validation integration
- **zod**: Runtime type validation and schema definition

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Markdown and Content
- Custom markdown parser implementation for blog content rendering
- **cmdk**: Command palette component for enhanced user experience

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user state persistence