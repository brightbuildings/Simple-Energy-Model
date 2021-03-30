import React from 'react';
import * as Sentry from "@sentry/browser";
import { Button } from "reactstrap";

import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  triggerSentry() {
    Sentry.captureException("Manual Feedback");
    Sentry.showReportDialog({
      title: "Feedback",
      subtitle: "Please describe your bug or your thoughts on how we can improve the app.",
      subtitle2: "",
      labelSubmit: "Submit"
    });
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="centered-narrow">
          <div className="Content Error">
            <h1>Error</h1>
            <p>
              There's been an error with the application. Please let
              us know by submitting feedback.
            </p>
            <Button onClick={this.triggerSentry} className="FeedbackButton">Feedback</Button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
