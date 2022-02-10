import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { App } from "@components/App";
import { ErrorBoundary } from "@components/ErrorBoundary";

import "../assets/favicon.png";

import "./style.css";

const config = require(`../${ process.env.CONFIG_FILE }`);

if (config.sentry) {
    Sentry.init({
        dsn          : config.sentry.dsn,
        integrations : [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.2,
    });
}

ReactDOM.render((
    <RecoilRoot>
        <Sentry.ErrorBoundary fallback={ ErrorBoundary } showDialog={ false }>
            <App />
        </Sentry.ErrorBoundary>
    </RecoilRoot>
), document.querySelector("#app"));
