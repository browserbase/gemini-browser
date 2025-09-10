# Gemini Browser

A powerful browser automation playground powered by Google's Gemini new Computer Use Agent and Browserbase. This free demo showcases the capabilities of AI-driven browser automation using Stagehand and Gemini's computer-use capabilities.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fgemini-browser&env=GOOGLE_API_KEY,BROWSERBASE_API_KEY,BROWSERBASE_PROJECT_ID&envDescription=API%20keys%20needed%20to%20run%20Gemini%20Browser&envLink=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fgemini-browser%23environment-variables)

## Features

- 🤖 **AI-Powered Browser Control**: Uses Google's Gemini Computer Use model to interact with web pages naturally
- 🌐 **Real Browser Environment**: Runs on actual Chrome browsers via Browserbase
- 🎯 **Natural Language Commands**: Simply describe what you want to do in plain English
- 📊 **Real-time Feedback**: Watch the AI navigate, click, type, and interact with websites
- 🔄 **Session Management**: Persistent browser sessions with tab management

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, React 19, and Tailwind CSS
- **AI Model**: Google Gemini Computer Use (computer-use-exp-07-16)
- **Browser Automation**: Browserbase + Stagehand
- **Streaming**: Server-Sent Events (SSE) for real-time updates
- **UI Components**: Framer Motion animations, Lucide React icons
- **Analytics**: PostHog for user tracking

## Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm
- API keys for Google AI Studio and Browserbase

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/browserbase/gemini-browser.git
   cd gemini-browser
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your API keys:
   ```env
   # Google Gemini API Configuration
   GOOGLE_API_KEY=your_google_api_key_here

   # Browserbase Configuration
   BROWSERBASE_API_KEY=your_browserbase_api_key_here
   BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here

   # Optional: Analytics and monitoring
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   
   # Site URL (for local development)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   **Get your API keys:**
   - Google Gemini API: [Google AI Studio](https://aistudio.google.com/apikey)
   - Browserbase: [Browserbase Dashboard](https://www.browserbase.com)

4. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Start a Session**: Click "New Session" to initialize a browser instance
2. **Enter Commands**: Type natural language instructions like:
   - "Go to google.com and search for AI news"
   - "Navigate to GitHub and explore trending repositories"
   - "Fill out the contact form on this page"
3. **Watch the Magic**: The AI will interpret your request and perform the actions
4. **View Results**: See real-time updates and screenshots as the agent works

## Key Components

- **Stream API** (`/api/agent/stream`): Handles real-time agent execution with SSE
- **Session Management** (`/api/session`): Creates and manages Browserbase sessions
- **Agent Integration**: Uses Stagehand with Gemini for browser automation
- **UI Components**: Modern, animated interface with real-time updates

## Codebase Optimization

This project has been optimized for production deployment:

- **Clean Dependencies**: Removed all unused npm packages and dev dependencies
- **Asset Optimization**: Eliminated unused images, fonts, and static files
- **Type Safety**: Cleaned up unused TypeScript types and interfaces
- **Bundle Size**: Reduced bundle size by removing dead code and unused imports
- **Performance**: Optimized for Vercel deployment with proper runtime configuration

## Available Scripts

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Configuration

The agent is configured with specific behaviors:
- Works in atomic steps (one action at a time)
- Prefers direct navigation over search
- Avoids risky actions unless necessary
- Fixed viewport at 1024x768 pixels
- Automatic screenshot capture after actions

## Limitations

- Maximum session duration: 10 minutes (Vercel timeout)
- Viewport locked at 1024x768 pixels
- No keyboard shortcuts support (uses click + type instead)
- Browser sessions are temporary and will expire

## Troubleshooting

- **Session fails to start**: Check your Browserbase API credentials
- **Agent not responding**: Verify your Google API key has access to Gemini Computer Use
- **Timeout errors**: Complex tasks may exceed the 10-minute limit
- **Connection issues**: Ensure stable internet connection for browser streaming

## Contributing

This is a demo playground project. Feel free to fork and experiment!

## License

MIT

## Acknowledgments

- [Browserbase](https://browserbase.com) for browser infrastructure
- [Stagehand](https://github.com/browserbasehq/stagehand) for automation framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [Vercel](https://vercel.com) for hosting and edge functions