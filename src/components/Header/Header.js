import React from "react";
import * as Sentry from "@sentry/browser";
import { Button } from "reactstrap";

import "./Header.css";

function triggerSentry() {
  Sentry.captureException("Manual Feedback");
  Sentry.showReportDialog({
    title: "Feedback",
    subtitle: "Please describe your bug or your thoughts on how we can improve the app.",
    subtitle2: "",
    labelSubmit: "Submit"
  });
}

function Header() {
  return (
    <div className="Header">
      <div className="centered Navigation">
        <div>
          <h1><a href="https://brightbuildings.tumblr.com/">Bright Buildings</a></h1>
          <h3>Simple Energy Model</h3>
        </div>
        <div>
          <Button onClick={triggerSentry} className="FeedbackButton">Feedback</Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
