interface ApiClientOptions {
  retries?: number
  retryDelay?: number
  timeout?: number
  headers?: Record<string, string>
}

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
  success: boolean
}

class ApiClient {
  private baseUrl: string
  private defaultOptions: ApiClientOptions

  constructor(baseUrl: string = '', options: ApiClientOptions = {}) {
    this.baseUrl = baseUrl
    this.defaultOptions = {
      retries: 3,
      retryDelay: 1000,
      timeout: 30000,
      ...options
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  }

  private shouldRetry(error: any, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false
    
    // Retry on network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) return true
    
    // Retry on timeout
    if (error.name === 'AbortError') return true
    
    // Don't retry on 4xx errors (client errors)
    if (error.status >= 400 && error.status < 500) return false
    
    // Retry on 5xx errors (server errors)
    if (error.status >= 500) return true
    
    return false
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      retries = this.defaultOptions.retries!,
      retryDelay = this.defaultOptions.retryDelay!,
      timeout = this.defaultOptions.timeout!,
      ...fetchOptions
    } = options

    const url = this.baseUrl + endpoint
    let lastError: any

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`API Request attempt ${attempt + 1}/${retries + 1}: ${endpoint}`)

        const response = await this.fetchWithTimeout(url, fetchOptions, timeout)
        
        let data: T | undefined
        let errorMessage: string | undefined

        // Try to parse response
        try {
          const text = await response.text()
          if (text) {
            data = JSON.parse(text)
          }
        } catch (parseError) {
          console.warn('Failed to parse response as JSON:', parseError)
        }

        if (!response.ok) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
          
          // Extract error message from response if available
          if (data && typeof data === 'object' && 'error' in data) {
            errorMessage = (data as any).error
          }

          const error = new Error(errorMessage)
          ;(error as any).status = response.status

          if (!this.shouldRetry(error, attempt, retries)) {
            return {
              status: response.status,
              success: false,
              error: errorMessage
            }
          }

          lastError = error
        } else {
          return {
            data,
            status: response.status,
            success: true
          }
        }
      } catch (error: any) {
        console.error(`API Request failed (attempt ${attempt + 1}):`, error)
        lastError = error

        if (!this.shouldRetry(error, attempt, retries)) {
          break
        }
      }

      // Wait before retrying (with exponential backoff)
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt)
        console.log(`Retrying in ${delay}ms...`)
        await this.sleep(delay)
      }
    }

    // All retries failed
    return {
      status: lastError?.status || 0,
      success: false,
      error: lastError?.message || 'Request failed after all retries'
    }
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(
    endpoint: string, 
    body?: any, 
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async put<T>(
    endpoint: string, 
    body?: any, 
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Create singleton instance
export const apiClient = new ApiClient('', {
  retries: 3,
  retryDelay: 1000,
  timeout: 30000
})

// Specialized methods for this app
export const chatApi = {
  async generateCode(payload: any): Promise<ApiResponse<any>> {
    return apiClient.post('/api/chat', payload, {
      timeout: 60000, // Longer timeout for code generation
      retries: 2
    })
  },

  async createSandbox(payload: any): Promise<ApiResponse<any>> {
    return apiClient.post('/api/sandbox', payload, {
      timeout: 45000, // Longer timeout for sandbox creation
      retries: 2
    })
  }
}

export default apiClient
