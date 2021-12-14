import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";

import { Client } from "@components/Client";
import { Lobby } from "@components/Lobby";
import { Plateau } from "@components/Plateau";

import { publishRoundState } from "@helpers/round";

import "@i18n/config";

import "./style.css";

export const App = () => {
    return (
        <Suspense fallback={<></>}>
            <Client />
            <Game />
        </Suspense>
    );
}

const Game = () => {
    const roundState = useRecoilValue(publishRoundState);

    switch(roundState) {
        case "not-started":
        case "finished":
            return <Lobby />

        case "running":
            return <Plateau />
    }
}
