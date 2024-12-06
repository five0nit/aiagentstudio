# AI Agent Studio

A TypeScript React application for creating, managing, and deploying AI agents with various capabilities.

## Features

- Create and manage AI agents with different capabilities
- Configure AI models from various providers (OpenAI, Anthropic, Google AI, Mistral)
- Marketplace for pre-configured agents
- Multiple interface types (Chat, Voice, Email, API)
- Tool integration system
- Rate limiting and error handling

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and fill in your environment variables:
```bash
cp .env.example .env
```
4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Required environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key

# AI Model Providers
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key
VITE_MISTRAL_API_KEY=your-mistral-api-key

# External Service Integration
VITE_SLACK_CLIENT_ID=your-slack-client-id
VITE_TEAMS_CLIENT_ID=your-teams-client-id

# Analytics and Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
```

## Deployment to Vercel

### Pre-deployment Checklist

1. Environment Variables:
   - [ ] Copy all variables from `.env.example` to Vercel project settings
   - [ ] Ensure all API keys are properly set
   - [ ] Configure proper API URL for production

2. Build Settings:
   - [ ] Verify build command in `vercel.json`
   - [ ] Check output directory configuration
   - [ ] Ensure all dependencies are properly listed in `package.json`

3. Security:
   - [ ] Review Content Security Policy in `vercel.json`
   - [ ] Check API route configurations
   - [ ] Verify CORS settings

### Deployment Steps

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## Project Structure

```
src/
├── components/        # Reusable components
│   └── ErrorBoundary.tsx
├── hooks/            # Custom React hooks
│   ├── useAgents.ts
│   └── useMarketplace.ts
├── pages/            # Route components
│   ├── CreateAgent.tsx
│   ├── Marketplace.tsx
│   └── MyAgents.tsx
├── types/            # TypeScript type definitions
│   └── api.ts
├── utils/            # Utility functions
│   └── api.ts
├── App.tsx           # Root component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

## Error Handling

The application implements multiple layers of error handling:

1. Global Error Boundary
2. Route-level error handling
3. API error handling with retry logic
4. Form validation errors
5. Network error handling

## Rate Limiting

API requests are automatically rate-limited to prevent overloading:

- 10 requests per second by default
- Configurable through the RateLimiter class
- Automatic queue management
- Error handling for rate limit exceeded

## Security

- Content Security Policy (CSP) headers
- CORS configuration
- API route protection
- Secure header configurations
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
