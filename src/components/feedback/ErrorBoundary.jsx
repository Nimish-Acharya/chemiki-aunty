import { Component } from "react";

// Catches crashes in child components so one bug does not blank the whole screen.
// Error boundaries must be class components; this is the only class in the project.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="banner banner-danger" role="alert">
          <div>
            <strong>This page hit an unexpected error.</strong>
            <div className="muted">Reload the page. If it keeps happening, check the browser console.</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
