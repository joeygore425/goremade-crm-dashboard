'use client'

import { ReactNode, Component, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">
              Error loading component. Please refresh the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <p className="text-red-300 text-xs mt-2 font-mono">
                {this.state.error.message}
              </p>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}
