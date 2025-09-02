# OpenRouter Integration

OpenRouter has been successfully integrated into your Next.js app! 🎉

## What is OpenRouter?

OpenRouter is an API gateway that provides unified access to multiple AI models from different providers through a single API endpoint. This gives you:

- **Access to 100+ models** from OpenAI, Anthropic, Google, Meta, and more
- **Competitive pricing** with transparent per-token costs
- **Single API key** for multiple providers
- **Unified interface** - same API format for all models

## What's Been Added

### ✅ Provider Configuration
- Added OpenRouter support to `lib/models.ts`
- Uses OpenAI-compatible API with OpenRouter's endpoint
- Supports custom API keys and base URLs

### ✅ Model Selection
Added popular OpenRouter models to your app:

**GPT Models (via OpenRouter):**
- GPT-4o (OpenRouter)
- GPT-4o Mini (OpenRouter)

**Claude Models (via OpenRouter):**
- Claude 3.5 Sonnet (OpenRouter)
- Claude 3.5 Haiku (OpenRouter)

**Llama Models (via OpenRouter):**
- Llama 3.3 70B (OpenRouter)
- Llama 3.1 405B (OpenRouter)

**Other Models:**
- Gemini 2.0 Flash (OpenRouter)
- DeepSeek R1 (OpenRouter)
- Qwen 2.5 Coder 32B (OpenRouter)
- Mistral Large (OpenRouter)

### ✅ Environment Configuration
- Added `OPENROUTER_API_KEY` to `.env.template`
- Updated deployment documentation

### ✅ Build Compatibility
- Tested and confirmed working with Netlify deployment
- All builds pass successfully

## How to Use

### 1. Get OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Get your API key from the dashboard

### 2. Add to Environment
Add your OpenRouter API key to your environment:

```bash
# In .env.local
OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Use in Your App
OpenRouter models will now appear in your model selection dropdown alongside other providers. Users can:

- Select any OpenRouter model from the dropdown
- Use their own OpenRouter API key if desired
- Access models that might be cheaper or faster than direct provider APIs

## Benefits

### 🔄 **Redundancy**
If one provider is down, switch to the same model via OpenRouter

### 💰 **Cost Optimization**
Compare prices across providers and choose the most cost-effective option

### 🌍 **Global Access**
OpenRouter often has better global availability than individual providers

### 🔧 **Unified API**
Single API format for all models - no need to learn different APIs

### 📊 **Usage Analytics**
OpenRouter provides detailed usage analytics and cost tracking

## Popular Use Cases

- **Development/Testing**: Use cheaper models for development, premium for production
- **Fallback**: If OpenAI is rate-limited, fall back to Claude via OpenRouter
- **A/B Testing**: Compare model performance across different providers
- **Cost Management**: Monitor and optimize AI spending across all models

## Next Steps

Your app is now ready for deployment with OpenRouter support! The models will be available in the UI once you:

1. Set your `OPENROUTER_API_KEY` environment variable
2. Deploy to Netlify
3. Select OpenRouter models from the dropdown

Happy coding! 🚀
