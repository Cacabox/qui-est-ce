import "./index.html";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import { App } from "@components/App";
import { ErrorBoundary } from "@components/ErrorBoundary";

import "../assets/favicon.png";

ReactDOM.render((
    <RecoilRoot>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </RecoilRoot>
), document.querySelector("#app"));
