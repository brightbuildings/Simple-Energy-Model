import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

Sentry.init({
  dsn: "https://31d03d5e9c34401d91341b969218e03f@o533245.ingest.sentry.io/5699226",
  integrations: [new Integrations.BrowserTracing()],
  release: "bb@0.x",
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
