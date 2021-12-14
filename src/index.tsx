import "./index.html";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import { App } from "@components/App";

import "../assets/favicon.png";
import "../assets/default.jpeg";
import "../assets/TwitchGlitchPurple.svg";

ReactDOM.render((
    <RecoilRoot>
        <App />
    </RecoilRoot>
), document.querySelector("#app"));
