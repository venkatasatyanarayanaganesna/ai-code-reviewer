# AI Code Reviewer - Setup & Run Guide

## Step 1: Get Free Groq API Key ✅

1. Visit: https://console.groq.com
2. Sign up (free account)
3. Go to API Keys section
4. Copy your key (looks like: `gsk_xxxxxxxxxxxx`)

## Step 2: Add API Key to .env

Open this file: `server/.env`

Replace this line:
```
GROQ_API_KEY=gsk_your_api_key_here_replace_this
```

With your actual key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

Save the file.

## Step 3: Run the Project

Open PowerShell in the project folder and run:

```bash
npm run dev
```

You'll see:
```
╔═══════════════════════════════════════════╗
║     AI Code Reviewer API                  ║
║     Running on http://localhost:3001      ║
║     Provider: groq                        ║
╚═══════════════════════════════════════════╝
```

Frontend starts at: http://localhost:3000

## Step 4: Test It Out

1. Open http://localhost:3000 in your browser
2. Paste some code (JavaScript, Python, etc.)
3. Click "Analyze Code"
4. See instant AI analysis!

## Troubleshooting

**"Backend is not running"**
- Make sure you ran `npm run dev`
- Check that port 3001 is not in use

**"Failed to analyze code"**
- Check your API key in `server/.env`
- Make sure it starts with `gsk_`

**"GROQ_API_KEY not set"**
- Edit `server/.env` and add your key
- Restart the dev server

## What's Running

- **Frontend**: Next.js (http://localhost:3000)
- **Backend**: Express API (http://localhost:3001)
- **AI**: Groq API (free tier)

Stop the server anytime with: `Ctrl + C`

---

Need help? Check the main README.md for deployment options.
