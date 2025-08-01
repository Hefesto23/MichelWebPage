# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 psychology clinic website for "Michel de Camargo" using TypeScript, Tailwind CSS, and Prisma ORM with PostgreSQL. The application features both a public website and an admin panel for content management, appointment scheduling, and analytics.

## Development Commands

### Core Development
- `npm run dev` - Start development server (default port: 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking

### Database Management
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:migrate:reset` - Reset database and run all migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio GUI

### Docker Operations
- `npm run docker:up` - Start PostgreSQL database container
- `npm run docker:down` - Stop database container
- `npm run docker:restart` - Restart database container
- `npm run docker:logs` - View database logs
- `npm run docker:clean` - Clean up Docker resources

### Setup Commands
- `npm run setup` - Full setup (Docker + DB push + seed)
- `npm run setup:dev` - Development setup (Docker + migrations + seed)
- `npm run setup:fresh` - Fresh database setup (reset everything)
- `npm run dev:full` - Start Docker and development server together

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom animations and themes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with middleware protection
- **Email**: SendGrid integration
- **Upload**: Multer for file handling
- **UI Components**: Radix UI primitives with custom styling

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes (protected)
│   ├── api/               # API routes
│   ├── agendamento/       # Appointment booking page
│   └── [other-pages]/     # Public pages
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── pages/            # Page-specific components
│   ├── shared/           # Reusable components
│   └── templates/        # Layout templates
├── hooks/                # Custom React hooks
├── lib/                  # External service integrations
├── types/                # TypeScript type definitions
└── utils/                # Utility functions and constants
```

### Database Schema
Key models in `prisma/schema.prisma`:
- `Admin` - Admin user authentication
- `Appointment` - Appointment bookings with Google Calendar integration
- `Content` - CMS content for dynamic page management
- `Upload` - Media file management
- `Analytics` - Event tracking data

### Authentication & Security
- JWT-based authentication with middleware protection
- Admin routes protected by `/admin/*` middleware
- API routes protected by `/api/admin/*` middleware
- Token verification and automatic redirect to login

### Path Aliases (tsconfig.json)
- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@lib/*` → `./src/lib/*`
- `@utils/*` → `./src/utils/*`
- `@types/*` → `./src/types/*`
- `@styles/*` → `./src/styles/*`

## Key Features

### Public Website
- Homepage with hero section, services, and clinic info
- About page, services/therapies page, evaluations page
- Appointment booking system with multi-step form
- Contact page with clinic information and map
- Dark mode support with theme switching
- Responsive design with mobile-first approach

### Admin Panel
- Dashboard with appointment statistics and analytics
- Appointment management (view, confirm, cancel)
- Content management system (CMS) for page content
- Media upload and management
- Settings configuration
- Analytics tracking and reporting

### Appointment System
- Multi-step booking form (date/time → contact info → confirmation)
- Google Calendar integration for scheduling
- Email notifications via SendGrid
- Appointment lookup and cancellation
- Time slot management with availability checking

## Constants and Configuration

The application uses a centralized constants system in `src/utils/constants.ts`:
- `ROUTES` - All application routes
- `APPOINTMENT` - Appointment-related constants (status, time slots, modalities)
- `CLINIC_INFO` - Clinic and psychologist information
- `MESSAGES` - All user-facing messages
- `MEDIA` - Media upload configurations and placeholders
- `PAGE_CONTENT` - Static page content
- `ADMIN` - Admin panel configurations

## Development Guidelines

### Component Organization
- Page-specific components in `components/pages/[page-name]/`
- Shared components in `components/shared/`
- Layout components in `components/layout/`
- Export components through index files for clean imports

### Type Safety
- All components use TypeScript with strict typing
- Centralized type definitions in `src/types/`
- Prisma-generated types for database models

### Styling Approach
- Tailwind CSS with custom CSS variables for theming
- Dark mode implementation using CSS variables
- Custom animations defined in tailwind.config.ts
- Responsive design with mobile-first approach

### API Structure
- Public APIs in `/api/[endpoint]/`
- Protected admin APIs in `/api/admin/[endpoint]/`
- Authentication required for admin endpoints
- Consistent error handling and response formats

## Testing Database Changes

Always test database changes with:
1. `npm run type-check` - Ensure TypeScript compatibility
2. `npm run db:generate` - Generate new Prisma client
3. `npm run lint` - Check for code style issues
4. Test the application locally with `npm run dev`

## Common Workflows

### Adding New Admin Features
1. Create database schema changes in `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Update types in `src/types/admin.ts`
4. Create API endpoints in `src/app/api/admin/`
5. Build admin components in `src/components/pages/admin/`
6. Add routes to admin sidebar navigation

### Content Management
- Use the CMS system for dynamic content through admin panel
- Static content can be updated in `src/utils/constants.ts`
- Media files managed through admin upload system

### Environment Setup
The application requires:
- PostgreSQL database (can be started with `npm run docker:up`)
- Environment variables for database connection, SendGrid, and Google APIs
- Initial database seeding with `npm run db:seed`