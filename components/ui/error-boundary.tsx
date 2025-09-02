'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            An unexpected error occurred. This has been logged and we&apos;re working to fix it.
          </p>

          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="outline">
              Try Again
            </Button>
            <Button onClick={this.handleReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-muted rounded-lg text-left w-full max-w-2xl">
              <summary className="cursor-pointer font-medium">
                Error Details (Development Only)
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <strong>Error:</strong>
                  <pre className="mt-1 text-sm bg-background p-2 rounded border overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-sm bg-background p-2 rounded border overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You can add additional error reporting here
    // e.g., send to analytics service
  }

  return handleError
}
