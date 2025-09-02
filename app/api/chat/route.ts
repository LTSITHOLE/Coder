import { Duration } from '@/lib/duration'
import {
  getModelClient,
  LLMModel,
  LLMModelConfig,
} from '@/lib/models'
import { toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
import { streamObject, LanguageModel, CoreMessage } from 'ai'

export const maxDuration = 300

const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 10
const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
  ? (process.env.RATE_LIMIT_WINDOW as Duration)
  : '1d'

export async function POST(req: Request) {
  const {
    messages,
    userID,
    teamID,
    template,
    model,
    config,
  }: {
    messages: CoreMessage[]
    userID: string | undefined
    teamID: string | undefined
    template: Templates
    model: LLMModel
    config: LLMModelConfig
  } = await req.json()

  const limit = !config.apiKey
    ? await ratelimit(
        req.headers.get('x-forwarded-for'),
        rateLimitMaxRequests,
        ratelimitWindow,
      )
    : false

  if (limit) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }

  console.log('userID', userID)
  console.log('teamID', teamID)
  console.log('template', template)
  console.log('model', model)
  console.log('config', config)

  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
  
  console.log('Creating model client for:', model.providerId, 'with model:', model.id)
  
  try {
    const modelClient = getModelClient(model, config)
    console.log('Model client created successfully')
  } catch (clientError: any) {
    console.error('Error creating model client:', clientError)
    return new Response(
      `Failed to create model client: ${clientError.message}`,
      { status: 500 }
    )
  }
  
  const modelClient = getModelClient(model, config)

  try {
    const stream = await streamObject({
      model: modelClient as LanguageModel,
      schema,
      system: toPrompt(template),
      messages,
      maxRetries: 0, // do not retry on errors
      ...modelParams,
    })

    return stream.toTextStreamResponse()
  } catch (error: any) {
    const isRateLimitError =
      error && (error.statusCode === 429 || error.message.includes('limit'))
    const isOverloadedError =
      error && (error.statusCode === 529 || error.statusCode === 503)
    const isAccessDeniedError =
      error && (error.statusCode === 403 || error.statusCode === 401)

    if (isRateLimitError) {
      return new Response(
        'The provider is currently unavailable due to request limit. Try using your own API key.',
        {
          status: 429,
        },
      )
    }

    if (isOverloadedError) {
      return new Response(
        'The provider is currently unavailable. Please try again later.',
        {
          status: 529,
        },
      )
    }

    if (isAccessDeniedError) {
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required. Please sign in to continue.', 
          code: 'AUTH_REQUIRED',
          details: 'You need to be signed in to generate code. Please click the sign in button.' 
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    })

    // Provide specific error messages based on error type
    let errorMessage = 'An unexpected error has occurred. Please try again later.'
    let errorCode = 'UNKNOWN_ERROR'
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your API key configuration.'
      errorCode = 'INVALID_API_KEY'
    } else if (error.message?.includes('model')) {
      errorMessage = 'Model error. Please try selecting a different model.'
      errorCode = 'MODEL_ERROR'
    } else if (error.statusCode === 500) {
      errorMessage = 'Server error. Please try again in a moment.'
      errorCode = 'SERVER_ERROR'
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        code: errorCode,
        details: error.message || 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
