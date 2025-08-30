# PilotFinder - AI Customer Discovery Platform

## Project Overview
A Next.js-based customer discovery platform that uses AI agents to find potential pilot customers by analyzing complaints across various platforms. This tool provides brutal honesty about market validation - either finding real customers or recommending pivots.

## Bash Commands
- `bun dev` - Start development server (Next.js)
- `bun run build` - Build the project for production
- `bun run start` - Start production server
- `bun install` - Install dependencies (always use bun, not npm)
- `bun add <package>` - Add new dependency
- `bun add --dev <package>` - Add development dependency
- `biome check` - Run linter and formatter (Biome)
- `biome check --write` - Fix linting and formatting issues

## Project Structure
```
pilot-finder-app/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage (landing page)
│   │   └── globals.css        # Global styles and theme
│   ├── components/
│   │   ├── blocks/            # Large page sections (e.g., hero)
│   │   └── ui/                # Reusable UI components (shadcn/ui based)
│   └── lib/
│       └── utils.ts           # Utility functions (cn helper)
├── components.json            # shadcn/ui configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Code Style Guidelines

### TypeScript
- Always use TypeScript (`.ts`/`.tsx` files)
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible: `import { useState } from 'react'`
- Use explicit types for props and function parameters
- Follow Next.js 13+ App Router patterns

### React Components
- Use functional components with hooks
- Add `'use client'` directive for client-side features (useState, useEffect, browser APIs)
- Import React hooks directly: `import { useState, useEffect } from 'react'`
- Use proper TypeScript interfaces for props

### Styling
- Use TailwindCSS classes exclusively for styling
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Reference theme colors using CSS custom properties (e.g., `text-foreground`, `bg-primary`)
- DO NOT use hardcoded color values - always use theme colors from globals.css
- Use semantic color names: `primary`, `secondary`, `muted`, `accent`, `destructive`, `chart-1` through `chart-5`

### Component Patterns
- Follow shadcn/ui component patterns and structure
- Use `forwardRef` for components that need DOM refs
- Employ `cva` (class-variance-authority) for component variants
- Use Framer Motion for animations (`framer-motion` library)
- Icons: Use `lucide-react` icon library

### File Organization
- UI components go in `src/components/ui/`
- Page sections/blocks go in `src/components/blocks/`
- Utilities go in `src/lib/`
- Use kebab-case for file names (e.g., `bento-grid.tsx`, `call-to-action.tsx`)

## Development Workflow

### Package Management
- **IMPORTANT**: Always use `bun` as the package manager, never npm or yarn
- Lock file is `bun.lockb`
- Scripts are defined in `package.json`

### Component Development
- When creating new UI components, follow existing patterns in `src/components/ui/`
- Look at existing components like `button.tsx`, `bento-grid.tsx` for reference
- Use the `cn()` utility for className merging
- Maintain consistent prop interfaces and TypeScript typing

### Styling
- Check `src/app/globals.css` for theme colors and custom properties
- Use theme-aware colors that work in both light and dark modes
- Follow existing gradient and background patterns from other components

### Testing
- Currently no testing framework is set up
- When adding tests, ensure they work with the bun runtime
- Consider using a framework compatible with Next.js and TypeScript

## Project-Specific Information

### Theme System
- Uses CSS custom properties for theming (check `globals.css`)
- Supports light/dark modes automatically
- Colors defined in OKLCH format for better color accuracy
- Custom animations including `shiny-text` keyframes

### Key Features
- Landing page with hero section, bento grid features, and CTA
- Animated text effects using custom shiny text component
- Responsive design with mobile-first approach
- Modern UI with shadcn/ui components and TailwindCSS

### External Dependencies
- **Next.js 15**: Latest version with App Router
- **React 19**: Latest React version
- **Framer Motion**: For animations
- **Radix UI**: Base components for accessibility
- **Lucide React**: Icon library
- **TailwindCSS 4**: For styling
- **Biome**: For linting and formatting

## Important Notes
- The project focuses on customer discovery for startups
- Landing page emphasizes "brutal honesty" and "no sugarcoating" messaging
- Components should reflect the professional, no-nonsense tone
- Always run build and type checking before committing changes
- Keep the CLAUDE.md file updated as the project evolves

## Updating This File
When making significant changes to the project structure, dependencies, or development workflow, please update this CLAUDE.md file to reflect the changes. This ensures the development context remains accurate and helpful.