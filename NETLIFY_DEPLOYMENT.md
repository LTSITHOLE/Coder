# Netlify Deployment Guide

Your Next.js app is now configured for Netlify deployment with support for server actions and API routes.

## Build Configuration

- ✅ **Next.js config**: Updated to work with Netlify Functions
- ✅ **Netlify config**: Created `netlify.toml` with proper build settings
- ✅ **Build process**: Tested and working

## Deployment Steps

### 1. Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository (GitHub, GitLab, etc.)

### 2. Configure Build Settings

Netlify should automatically detect your settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `.next` (handled by Netlify Next.js plugin)
- **Node version**: 18

### 3. Environment Variables

You'll need to set these environment variables in your Netlify dashboard:

**Required:**
- `E2B_API_KEY` - Your E2B API key
- `OPENAI_API_KEY` - Your OpenAI API key (or other provider keys)

**Optional (depending on features you want to enable):**
- `ANTHROPIC_API_KEY`
- `GROQ_API_KEY`
- `FIREWORKS_API_KEY`
- `TOGETHER_API_KEY`
- `GOOGLE_AI_API_KEY`
- `GOOGLE_VERTEX_CREDENTIALS`
- `MISTRAL_API_KEY`
- `XAI_API_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SITE_URL` - Your Netlify domain (e.g., `your-app.netlify.app`)
- `RATE_LIMIT_MAX_REQUESTS`
- `RATE_LIMIT_WINDOW`
- `KV_REST_API_URL` - For Vercel KV (or use Netlify KV)
- `KV_REST_API_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `ZEROBOUNCE_API_KEY`

### 4. Deploy

1. Push your code to your Git repository
2. Netlify will automatically build and deploy
3. Your app will be available at `https://[your-site-name].netlify.app`

## Important Notes

- **Server Actions**: Your app uses Next.js Server Actions, which work with Netlify Functions
- **API Routes**: Your `/api/chat` and `/api/sandbox` routes will work as Netlify Functions
- **Environment Variables**: Make sure to set all required API keys in Netlify's dashboard
- **Domain**: Update `NEXT_PUBLIC_SITE_URL` to your actual Netlify domain once deployed

## Troubleshooting

If you encounter issues:

1. **Build failures**: Check the Netlify build logs for specific errors
2. **Runtime errors**: Ensure all required environment variables are set
3. **Function timeouts**: API routes have a 10-second timeout on Netlify (can be extended with paid plans)

## Local Development

To continue local development:
```bash
npm run dev
```

The app will run on `http://localhost:3000`
