import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for debugging; could be sent to a logging service
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong.</h1>
          <p style={{ marginBottom: 16 }}>An error occurred while rendering the app. Details:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fee2e2', padding: 12, borderRadius: 8, color: '#991b1b' }}>
            {this.state.error?.message}
          </pre>
          <p style={{ marginTop: 16 }}>Check the browser console for a full stack trace.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
