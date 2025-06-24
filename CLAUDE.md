# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `bun run dev` - Start development server (runs prettier first, then Next.js dev)
- `bun run build` - Build production application
- `bun run prettier` - Format code with Prettier
- `next-sitemap` - Generate sitemap (runs post-build)

### Deployment
- `bun run permaweb-deploy` - Deploy to Permaweb (Arweave network)

### Package Management
- `bun link liquidops` - Link local liquidops package for development

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router and static export
- **Runtime**: Bun (preferred package manager)
- **Styling**: Tailwind CSS with CSS Modules
- **State Management**: React Query (TanStack Query) with custom cache utilities
- **Blockchain**: Arweave/AO ecosystem with custom LiquidOps SDK
- **UI Components**: Custom components with shadcn/ui configuration

### Key Integrations
- **LiquidOps SDK**: Core DeFi protocol integration (`liquidops` package)
- **AO Connect**: Arweave blockchain interaction via `@permaweb/aoconnect`
- **AOSync**: Wallet management via `@vela-ventures/aosync-sdk-react`
- **AO Profile**: User profile management via `@permaweb/aoprofile`
- **AO Tokens**: Token utilities via `ao-tokens`

### Project Structure

#### Core Application (`src/app/`)
- **App Router structure** with page-based routing
- **providers.tsx**: Global providers (React Query, AOSync, Notifications)
- **layout.tsx**: Root layout with SEO metadata and font configuration
- **Page components**: home, markets, strategies, [ticker] (dynamic routes)

#### Component Architecture (`src/components/`)
- **Modular components** with co-located CSS modules
- **Activity tracking**: ActivityList with transaction history
- **Wallet integration**: Connect component with wallet modal
- **Notifications**: Custom notification system
- **UI primitives**: InputBox, DropDown, Tooltip, etc.

#### Data Layer (`src/hooks/`)
- **LiquidOpsData/**: Protocol-specific data hooks (positions, balances, APR)
- **actions/**: Transaction hooks (useLend, useBorrow)
- **data/**: General data hooks (wallet, tokens, prices)
- **strategies/**: DeFi strategy-related hooks

#### Utilities (`src/utils/`)
- **LiquidOps/**: Protocol client and token formatting
- **caches/**: Custom caching system for blockchain data
- **AO/**: Arweave blockchain utilities
- **exports/**: CSV/JSON export functionality

### Configuration Details

#### Build Configuration
- **Static export** configured in next.config.mjs
- **Asset optimization disabled** for static deployment
- **Webpack fallbacks** for Node.js modules
- **Git hash injection** for build versioning

#### TypeScript Setup
- **Strict mode enabled** with ES2020 target
- **Path aliases**: `@/*` maps to `src/*`
- **Module resolution**: bundler mode for optimal tree-shaking

#### Blockchain Integration
- **Arweave wallet** integration via window.arweaveWallet
- **AO testnet** connection (mu.ao-testnet.xyz)
- **Custom signer** creation for transaction signing

### Development Patterns

#### State Management
- **React Query** for server state with 60s stale time
- **Custom cache utilities** for blockchain data persistence
- **Context providers** for wallet state and notifications

#### Error Handling
- **Transaction tracking** with success/failure states
- **Custom error messages** from blockchain responses
- **Notification system** for user feedback

#### Data Fetching
- **Optimistic updates** for transaction states
- **Cache invalidation** on successful transactions
- **Parallel query execution** for improved performance

### Key Dependencies to Note
- Uses **Bun** as package manager (not npm/yarn)
- **LiquidOps SDK** is core dependency - check version compatibility
- **AO ecosystem** packages for Arweave blockchain interaction
- **Recharts** for data visualization components
- **Framer Motion** for animations (version 11+)

### Deployment Notes
- **Static export** to `dist/` directory
- **Permaweb deployment** via custom script
- **SEO optimization** with Next.js metadata API
- **Sitemap generation** for search engines