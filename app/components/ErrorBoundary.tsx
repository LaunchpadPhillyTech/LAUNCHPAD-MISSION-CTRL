// components/ErrorBoundary.tsx - Error boundary for catching component errors
'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You could send this to an error logging service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
          <div
            className="rounded-lg border p-6 max-w-md w-full"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle
                size={24}
                style={{ color: 'var(--destructive)' }}
                className="flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <h1
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Oops! Something went wrong
                </h1>
                <p
                  className="text-sm mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-4">
                    <summary
                      className="text-sm font-medium cursor-pointer"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Error Details (Development Only)
                    </summary>
                    <pre
                      className="mt-2 p-2 text-xs overflow-auto max-h-48 rounded"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {this.state.error?.toString()}
                    </pre>
                  </details>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all active:scale-95"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
