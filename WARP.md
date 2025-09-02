# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Fragments by E2B is an open-source version of AI artifact generators like Anthropic's Claude Artifacts or Vercel's v0. It's a Next.js 14 application that uses the E2B SDK to securely execute AI-generated code in isolated sandboxes.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm i

# Start development server with Turbo mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

### Environment Setup
Copy `.env.template` to `.env.local` and configure required API keys:
- `E2B_API_KEY` - Required for sandbox execution
- At least one LLM provider API key (OpenAI, Anthropic, etc.)
- Optional: Supabase for auth, Upstash KV for rate limiting, PostHog for analytics

### Testing Single Components
Since this is a Next.js app, test components in isolation by navigating to specific routes or using the development server to interact with individual features.

## Architecture Overview

### Core Application Flow
1. **Chat Interface** (`app/page.tsx`) - Main UI where users interact with AI
2. **LLM Processing** (`app/api/chat/route.ts`) - Streams AI responses using Vercel AI SDK
3. **Code Execution** (`app/api/sandbox/route.ts`) - Executes generated code in E2B sandboxes
4. **Fragment Display** - Shows both code and running applications

### Key Components Structure

#### Frontend Architecture
- **Next.js App Router** - Modern React framework with server components
- **shadcn/ui + Radix UI** - Component library with Tailwind CSS styling
- **Vercel AI SDK** - Handles streaming AI responses with structured output
- **React State Management** - Local state with `useLocalStorage` for persistence

#### Backend Integration
- **API Routes** - RESTful endpoints for chat and sandbox management
- **E2B Sandboxes** - Isolated environments for code execution
- **Rate Limiting** - Upstash-based limits for free tier users
- **Authentication** - Supabase integration for user management

### Templates System (`lib/templates.json`)
Defines supported development environments:
- **code-interpreter-v1** - Python data analysis with Jupyter-like execution
- **nextjs-developer** - Next.js applications with TypeScript
- **vue-developer** - Vue.js/Nuxt applications
- **streamlit-developer** - Streamlit data apps
- **gradio-developer** - Gradio ML interfaces

Each template includes:
- Pre-installed dependencies
- Default file structure
- Port configuration
- AI instructions for code generation

### LLM Provider System (`lib/models.ts`)
Supports multiple AI providers through unified interface:
- **OpenAI** - GPT models
- **Anthropic** - Claude models
- **Google** - Gemini models
- **Groq, Fireworks, Together AI** - Alternative providers
- **Ollama** - Local models

### Schema-Driven Code Generation (`lib/schema.ts`)
Uses Zod schema to structure AI responses:
- `commentary` - Step-by-step explanation
- `template` - Target environment
- `code` - Generated source code
- `additional_dependencies` - Runtime requirements
- `port` - Application port if applicable

## Key Development Patterns

### Adding New Templates
1. Create sandbox template in `sandbox-templates/`
2. Deploy using E2B CLI: `e2b template build --name <template-name>`
3. Add configuration to `lib/templates.json`
4. Add logo to `public/thirdparty/templates/` (optional)

### Adding New LLM Providers
1. Install AI SDK provider package
2. Add provider configuration in `lib/models.ts`
3. Update `getModelClient()` function
4. Add models to `lib/models.json`
5. Add provider logo (optional)

### Fragment Execution Flow
1. User submits prompt through `ChatInput`
2. AI generates structured response via `useObject` hook
3. Fragment schema validation ensures proper format
4. Code sent to `/api/sandbox` for E2B execution
5. Results displayed in `Preview` component with live reload

### State Management Patterns
- **Persistent State** - Chat input and model config via `useLocalStorage`
- **Session State** - Messages, fragments, and execution results in React state
- **Authentication** - Supabase session management with auto-refresh

### Error Handling Strategies
- **Rate Limiting** - Automatic fallback with clear user messaging
- **API Errors** - Provider-specific error handling and retry logic  
- **Sandbox Failures** - Runtime error display with stack traces
- **Network Issues** - Graceful degradation with retry mechanisms

## File Organization

### Core Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - React UI components with shadcn/ui
- `lib/` - Utility functions, schemas, and configuration
- `sandbox-templates/` - E2B Dockerfile templates for execution environments

### Important Files
- `app/page.tsx` - Main chat interface and application logic
- `components/chat.tsx` - Message display and interaction
- `components/preview.tsx` - Code and fragment preview pane
- `lib/schema.ts` - Zod schema for AI-generated fragments
- `lib/models.ts` - LLM provider configurations
- `lib/templates.json` - Sandbox template definitions

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `next.config.mjs` - Next.js configuration
- `components.json` - shadcn/ui component configuration
- `.env.template` - Environment variable reference

## Integration Points

### E2B Sandbox System
- **Code Interpreter** - Python execution with Jupyter-like cell results
- **Web Applications** - Full-stack apps with live preview URLs
- **Package Management** - Runtime dependency installation
- **File System** - Code file creation and management

### Vercel AI SDK Integration
- **Streaming Responses** - Real-time AI output with partial updates
- **Structured Output** - Zod schema validation for consistent format
- **Multi-modal Support** - Image input handling for supported models
- **Error Recovery** - Automatic retry and fallback mechanisms

### Authentication & Analytics
- **Supabase Auth** - User sessions with team management
- **PostHog Analytics** - Usage tracking and feature analytics
- **Rate Limiting** - KV store for request throttling

This codebase combines modern React patterns with AI-powered code generation and secure sandbox execution to create an interactive development environment.
