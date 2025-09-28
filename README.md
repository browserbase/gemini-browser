# Google CUA Browser

A powerful browser automation playground powered by Google's new Computer Use Agent and Browserbase. This free demo showcases the capabilities of AI-driven browser automation using Stagehand and Google's computer-use capabilities.

## Features

- 🤖 **AI-Powered Browser Control**: Uses Google's Computer Use model to interact with web pages naturally
- 🌐 **Real Browser Environment**: Runs on actual Chrome browsers via Browserbase
- 🎯 **Natural Language Commands**: Simply describe what you want to do in plain English
- 📊 **Real-time Feedback**: Watch the AI navigate, click, type, and interact with websites
- 📝 **Rich Markdown Support**: AI responses rendered with proper formatting, code blocks, and typography
- 🔄 **Session Management**: Persistent browser sessions with tab management
- 🖼️ **Non-Interactive Preview**: View-only browser iframe prevents accidental user interference

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, React 19, and Tailwind CSS
- **AI Model**: Google Computer Use
- **Browser Automation**: Browserbase + Stagehand
- **Streaming**: Server-Sent Events (SSE) for real-time updates
- **UI Components**: Framer Motion animations, Lucide React icons
- **Markdown Rendering**: ReactMarkdown with GitHub Flavored Markdown support
- **Analytics**: PostHog for user tracking

## Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm
- API keys for Google AI Studio and Browserbase

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/browserbase/google-cua-browser.git
   cd -browser
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
   # Google API Configuration
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
   - Google API: [Google AI Studio](https://aistudio.google.com/apikey)
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
4. **View Results**: See real-time updates with rich markdown formatting including code blocks, lists, and formatted text

## Key Components

- **Stream API** (`/api/agent/stream`): Handles real-time agent execution with SSE
- **Session Management** (`/api/session`): Creates and manages Browserbase sessions
- **Agent Integration**: Uses Stagehand with Google's Computer Use for browser automation
- **Markdown Chat**: AI responses support rich text formatting with code syntax highlighting
- **Browser Preview**: Non-interactive iframe for viewing agent actions without user interference
- **UI Components**: Modern, animated interface with real-time updates

## Codebase Optimization

This project has been optimized for production deployment:

- **Clean Dependencies**: Removed all unused npm packages and dev dependencies
- **Asset Optimization**: Eliminated unused images, fonts, and static files
- **Type Safety**: Cleaned up unused TypeScript types and interfaces with proper ReactMarkdown component typing
- **Bundle Size**: Reduced bundle size by removing dead code and unused imports
- **UI Components**: Modular markdown rendering components for consistent styling
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
- **Agent not responding**: Verify your Google API key has access to Google Computer Use
- **Timeout errors**: Complex tasks may exceed the 10-minute limit
- **Connection issues**: Ensure stable internet connection for browser streaming

## Contributing

This is a demo playground project. Feel free to fork and experiment!

## License

MIT

## Acknowledgments

- [Browserbase](https://browserbase.com) for browser infrastructure
- [Stagehand](https://github.com/browserbasehq/stagehand) for automation framework
- [Google AI Studio](https://aistudio.google.com/) for AI capabilities
- [Vercel](https://vercel.com) for hosting and edge functions