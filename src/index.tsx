import "./index.html";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import { App } from "@components/App";
import { ErrorBoundary } from "@components/ErrorBoundary";

import "../assets/favicon.png";

const config = require(`../${ process.env.CONFIG_FILE }`);

if (config.sentry) {
    Sentry.init({
        dsn          : config.sentry.dns,
        integrations : [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

ReactDOM.render((
    <RecoilRoot>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </RecoilRoot>
), document.querySelector("#app"));
