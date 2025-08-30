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
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Chat API with file support
│   │   │   └── transcribe/    # Voice transcription API (ElevenLabs)
│   │   ├── chat/              # Chat interface page
│   │   ├── layout.tsx         # Root layout with Clerk auth
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

## Key Features

### 🎙️ Voice Mode
- **Real-time audio recording** using Web Audio API
- **ElevenLabs transcription** via Vercel AI SDK v5
- **Seamless integration** with chat interface
- **Microphone permission handling** with visual feedback
- **Processing indicators** and error handling
- **Toggle between text and voice input**

### 💬 Advanced Chat Interface
- **File upload support** (images, documents, PDFs)
- **Message actions**: Copy, edit, delete, regenerate
- **AI reasoning display** (for models like Deepseek R1)
- **Tool call visualization** with status indicators
- **Real-time streaming** with stop functionality
- **Message persistence** and conversation management

### 🔧 AI Elements Integration
- **Complete AI SDK v5 support** for all message types
- **Reasoning component** for transparent AI thinking
- **Tool component** for function calls and results
- **Response streaming** with proper error handling
- **File attachments** with inline image display

## Environment Variables
```
OPENAI_API_KEY=your-api-key                    # OpenAI API for GPT-4o
ELEVENLABS_API_KEY=your-elevenlabs-api-key     # ElevenLabs for voice transcription
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Clerk authentication
CLERK_SECRET_KEY=sk_test_...                   # Clerk secret key
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

## Voice Mode Implementation Details

### Components
- **AIVoiceInput**: Main voice recording component with Web Audio API
- **ChatInterface**: Integrated voice/text toggle with seamless UX
- **Transcription API**: ElevenLabs integration using AI SDK v5

### Audio Processing
- **Format**: WebM with Opus codec for optimal compression
- **Settings**: Echo cancellation, noise suppression, auto gain control
- **Streaming**: Real-time audio capture with proper cleanup
- **Error Handling**: Permission requests, fallback messages

### API Integration
- **Route**: `/api/transcribe` - Handles audio file upload and transcription
- **Provider**: ElevenLabs `scribe_v1` model via AI SDK
- **Security**: Proper error handling and validation
- **Performance**: Optimized for real-time transcription

## Project-Specific Information

### Theme System
- Uses CSS custom properties for theming (check `globals.css`)
- Supports light/dark modes automatically
- Colors defined in OKLCH format for better color accuracy
- Custom animations including `shiny-text` keyframes

### Key Features
- Landing page with hero section, bento grid features, and CTA
- Advanced chat interface with voice mode
- Animated text effects using custom shiny text component
- Responsive design with mobile-first approach
- Modern UI with shadcn/ui components and TailwindCSS

### External Dependencies
- **Next.js 15**: Latest version with App Router
- **React 19**: Latest React version
- **AI SDK 5**: Complete Vercel AI SDK integration
- **ElevenLabs SDK**: Voice transcription capabilities
- **Clerk**: Authentication and user management
- **Framer Motion**: For animations
- **Radix UI**: Base components for accessibility
- **Lucide React**: Icon library
- **TailwindCSS 4**: For styling
- **Biome**: For linting and formatting
- **Sonner**: Toast notifications

## Important Notes
- The project focuses on customer discovery for startups
- Landing page emphasizes "brutal honesty" and "no sugarcoating" messaging
- Components should reflect the professional, no-nonsense tone
- Voice mode requires microphone permissions
- Always run build and type checking before committing changes
- Keep the CLAUDE.md file updated as the project evolves

## Recent Updates
- ✅ **Voice Mode Implementation**: Complete voice-to-text functionality
- ✅ **ElevenLabs Integration**: Professional-grade transcription
- ✅ **AI Elements**: Full support for reasoning, tools, and file handling
- ✅ **Enhanced Chat**: Message actions, file uploads, streaming
- ✅ **Toast Notifications**: User feedback for all interactions

## Updating This File
When making significant changes to the project structure, dependencies, or development workflow, please update this CLAUDE.md file to reflect the changes. This ensures the development context remains accurate and helpful.