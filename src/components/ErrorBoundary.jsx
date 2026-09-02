import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 font-sans">
          <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-glass max-w-lg w-full">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 font-semibold mb-6">
              An unexpected UI error occurred while rendering this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-gradient text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
