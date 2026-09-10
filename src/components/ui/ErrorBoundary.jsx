import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — catches React errors that would otherwise crash the app.
 * 
 * Shows a friendly error page instead of a blank white screen, allows
 * the user to report the error, and provides a reload button.
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send this to an error logging service
    // Example: Sentry, LogRocket, etc.
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-50 p-4">
                <AlertCircle size={40} className="text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="mb-2 text-center font-display text-2xl font-bold text-navy-900">
              Something went wrong
            </h1>
            <p className="mb-6 text-center font-body text-sm text-navy-500">
              We're sorry, but the application encountered an unexpected error. Please try reloading the page.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 rounded-lg bg-red-50 p-3">
                <summary className="cursor-pointer font-body text-xs font-semibold text-red-700 hover:text-red-800">
                  Error details (development only)
                </summary>
                <pre className="mt-2 overflow-auto bg-navy-900 p-3 font-mono text-xs text-red-300">
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 font-body text-sm font-bold text-white transition hover:bg-navy-800"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-navy-200 px-4 py-3 font-body text-sm font-bold text-navy-900 transition hover:bg-navy-50"
              >
                Go to Home
              </a>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-center font-body text-xs text-navy-400">
              If this problem continues, please{' '}
              <a
                href="/contact"
                className="font-semibold text-gold-700 hover:text-gold-600 underline"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
