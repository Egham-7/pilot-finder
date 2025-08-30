# PilotFinder - AI Customer Discovery Platform

![PilotFinder Logo](https://img.shields.io/badge/PilotFinder-AI%20Customer%20Discovery-blue?style=for-the-badge)

> Stop guessing who your customers are. AI agents that find people complaining about your problem across the internet—or tell you the hard truth about why you need to pivot.

## 🎯 Overview

PilotFinder is an AI-powered customer discovery platform that provides brutal honesty about market validation. Unlike traditional tools that validate your assumptions, we challenge them by using AI agents to scour the internet for real customer complaints and pain points.

### Key Features

- **🤖 AI Problem Hunters**: Continuously scan Reddit, Twitter, forums, and review sites to find real people actively complaining about problems your startup claims to solve
- **⚠️ Brutal Honesty Mode**: No sugarcoating - if we can't find customers complaining about your problem, we'll tell you exactly why and where to pivot
- **📱 Real-Time Complaints**: Live feed of people expressing pain points across 50+ platforms, updated every hour
- **🎯 Pain Point Mapping**: Visual maps showing where complaints cluster geographically and demographically
- **📈 Pivot Recommendations**: AI-driven analysis of adjacent problems with more vocal complainers
- **⚡ Competitor Reality Check**: Unfiltered complaints about your competitors to reveal market gaps
- **👥 Early Adopter Profiles**: Detailed profiles of potential pilot customers who are desperate for solutions

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- Node.js 18+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pilot-finder.git
   cd pilot-finder
   ```

2. **Navigate to the app directory**
   ```bash
   cd pilot-finder-app
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Start the development server**
   ```bash
   bun dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Development

### Available Commands

```bash
# Development
bun dev                 # Start development server
bun run build          # Build for production
bun run start          # Start production server

# Code Quality
biome check            # Run linter and formatter
biome check --write    # Fix linting and formatting issues
bun run typecheck      # Run TypeScript type checking

# Package Management
bun add <package>      # Add new dependency
bun add --dev <package> # Add development dependency
```

### Project Structure

```
pilot-finder-app/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage (landing page)
│   │   └── globals.css        # Global styles and theme
│   ├── components/
│   │   ├── blocks/            # Large page sections (hero, etc.)
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   └── lib/
│       └── utils.ts           # Utility functions
├── components.json            # shadcn/ui configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🎨 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Integration**: [Mastra](https://mastra.ai/) + OpenAI SDK
- **Package Manager**: [Bun](https://bun.sh/)
- **Code Quality**: [Biome](https://biomejs.dev/)

## 🎯 Core Philosophy

PilotFinder believes in **brutal honesty** over comfortable lies:

- We don't validate your assumptions - we challenge them
- We find real complaints or tell you to pivot
- We provide unfiltered market feedback
- We focus on actual customer pain, not imagined problems

## 🔧 Configuration

### Environment Setup

Create a `.env.local` file in the `pilot-finder-app` directory:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key

# Database (if applicable)
DATABASE_URL=your_database_url
```

### Component Development Guidelines

- Use TypeScript for all components
- Follow shadcn/ui patterns and structure
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Prefer theme colors over hardcoded values
- Use semantic color names: `primary`, `secondary`, `muted`, `accent`, etc.

## 🚢 Deployment

### Build for Production

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pilot-finder)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run code quality checks (`biome check --write`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Always use `bun` as the package manager
- Follow existing TypeScript patterns
- Use functional components with hooks
- Add `'use client'` directive for client-side features
- Maintain consistent file naming (kebab-case)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [CLAUDE.md](CLAUDE.md) file for detailed development instructions
- **Issues**: [GitHub Issues](https://github.com/yourusername/pilot-finder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pilot-finder/discussions)

---

**Ready to find your real customers?** [Get Started →](https://pilot-finder.com)

*Built with ❤️ and brutal honesty*