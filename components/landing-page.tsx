'use client'

import { ChatInput } from '@/components/chat-input'
import { ChatPicker } from '@/components/chat-picker'
import { ChatSettings } from '@/components/chat-settings'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { ArrowRight, Code, Palette, Zap, Shield, Sparkles } from 'lucide-react'

interface LandingPageProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFileChange: (change: React.SetStateAction<File[]>) => void
  chatInput: string
  files: File[]
  isLoading: boolean
  isErrored: boolean
  errorMessage: string
  isRateLimited: boolean
  retry: () => void
  stop: () => void
  currentModel: any
  languageModel: any
  onLanguageModelChange: (config: any) => void
  templates: any
  selectedTemplate: any
  onSelectedTemplateChange: (template: any) => void
  filteredModels: any[]
  onShowAuth: () => void
  session: any
}

export function LandingPage({
  onSubmit,
  onInputChange,
  onFileChange,
  chatInput,
  files,
  isLoading,
  isErrored,
  errorMessage,
  isRateLimited,
  retry,
  stop,
  currentModel,
  languageModel,
  onLanguageModelChange,
  templates,
  selectedTemplate,
  onSelectedTemplateChange,
  filteredModels,
  onShowAuth,
  session
}: LandingPageProps) {
  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "AI Code Generation",
      description: "Generate complete applications, components, and scripts with advanced AI models"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Preview",
      description: "See your code come to life instantly with live preview and execution"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Beautiful Design",
      description: "Modern, responsive interfaces with stunning animations and effects"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Reliable",
      description: "Bulletproof error handling and robust retry mechanisms"
    }
  ]

  const templateOptions = [
    { id: 'nextjs-developer', name: 'Next.js App', description: 'Full-stack React applications' },
    { id: 'code-interpreter-v1', name: 'Python Data', description: 'Data analysis & visualization' },
    { id: 'vue-developer', name: 'Vue.js App', description: 'Vue 3 applications' },
    { id: 'streamlit-developer', name: 'Streamlit', description: 'Data science apps' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-16 pb-8">
            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Generate Code with
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Create stunning applications, analyze data, and build beautiful interfaces 
              with our enterprise-grade AI coding assistant. No setup required.
            </p>

            {/* Chat Input Hero */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="p-6 bg-background/80 backdrop-blur-sm border-2 border-muted shadow-2xl">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">What would you like to build?</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe your project and watch AI bring it to life
                  </p>
                </div>
                
                <ChatInput
                  retry={retry}
                  isErrored={isErrored}
                  errorMessage={errorMessage}
                  isLoading={isLoading}
                  isRateLimited={isRateLimited}
                  stop={stop}
                  input={chatInput}
                  handleInputChange={onInputChange}
                  handleSubmit={onSubmit}
                  isMultiModal={currentModel?.multiModal || false}
                  files={files}
                  handleFileChange={onFileChange}
                  placeholder="Create a beautiful dashboard for analyzing sales data..."
                >
                  <div className="flex flex-wrap gap-2 mt-4">
                    <ChatPicker
                      templates={templates}
                      selectedTemplate={selectedTemplate}
                      onSelectedTemplateChange={onSelectedTemplateChange}
                      models={filteredModels}
                      languageModel={languageModel}
                      onLanguageModelChange={onLanguageModelChange}
                    />
                    <ChatSettings
                      languageModel={languageModel}
                      onLanguageModelChange={onLanguageModelChange}
                      apiKeyConfigurable={!process.env.NEXT_PUBLIC_NO_API_KEY_INPUT}
                      baseURLConfigurable={!process.env.NEXT_PUBLIC_NO_BASE_URL_INPUT}
                    />
                  </div>
                </ChatInput>

                {!session && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground text-center">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
                        onClick={onShowAuth}
                      >
                        Sign in
                      </Button>
                      {' '}to start generating code or try with example prompts below
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Example Prompts */}
            <div className="max-w-4xl mx-auto mb-16">
              <h4 className="text-lg font-semibold mb-4">Try these example prompts:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Create a todo app with dark mode",
                  "Build a weather dashboard with charts", 
                  "Generate a contact form with validation",
                  "Make a portfolio website with animations"
                ].map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start bg-background/50 hover:bg-background/80 transition-all duration-200"
                    onClick={() => onInputChange({ target: { value: prompt } } as any)}
                  >
                    <div className="flex items-center gap-2">
                      <CodeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{prompt}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our AI Coder?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers, designed for reliability, optimized for results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-background/50 backdrop-blur-sm border-muted hover:border-foreground/20 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Specialized Templates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of optimized templates for different use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templateOptions.map((template, index) => (
              <Card key={index} className="p-6 bg-background/50 backdrop-blur-sm border-muted hover:border-foreground/20 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => onSelectedTemplateChange(template.id)}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CodeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers using AI to accelerate their coding workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onShowAuth} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/LTSITHOLE/Coder" target="_blank" rel="noopener noreferrer">
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
