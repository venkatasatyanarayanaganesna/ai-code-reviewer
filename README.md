# AI Code Reviewer

A production-ready AI-powered code review platform. **100% Free** to run and deploy.

## Features

- Upload code files and get instant AI-powered analysis
- Detects bugs, security issues, and performance problems
- Generates documentation automatically
- Real-time streaming analysis
- Beautiful, responsive UI
- **Completely free** - uses Groq API (free tier) or local Ollama

## Quick Start

### Prerequisites
- Node.js 18+ installed
- (Optional) Free Groq API key from https://console.groq.com

### Installation

```bash
# Install all dependencies
npm run install:all

# Create .env file (copy from .env.example)
cp server/.env.example server/.env
```

### Configure AI Provider

**Option 1: Groq (Recommended - Free API)**
1. Get free API key: https://console.groq.com
2. Add to `server/.env`:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=your_key_here
   ```

**Option 2: Ollama (100% Local - No Internet Required)**
1. Install: https://ollama.ai
2. Run: `ollama pull llama3.1`
3. Add to `server/.env`:
   ```
   AI_PROVIDER=ollama
   OLLAMA_MODEL=llama3.1
   ```

### Run Development Server

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Build for Production

```bash
npm run build
npm run start
```

## Deployment (Free Options)

### Frontend - Vercel (Free)
1. Push to GitHub
2. Connect to Vercel
3. Set root directory to `client`
4. Deploy

### Backend - Render (Free)
1. Push to GitHub
2. Create new Web Service on Render
3. Set root directory to `server`
4. Add environment variables
5. Deploy

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **AI**: Groq API (free tier) or Ollama (local)
- **Database**: SQLite (optional, for history)

## Project Structure

```
ai-code-reviewer/
├── server/           # Node.js backend
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── routes/           # API routes
│   │   ├── services/         # AI integration
│   │   └── utils/            # Helpers
│   └── package.json
├── client/           # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   └── package.json
└── package.json      # Root workspace config
```

## License

MIT
