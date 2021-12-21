import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";

import { ChooseCharacter } from "@components/ChooseCharacter";
import { Client } from "@components/Client";
import { Finished } from "@components/Finished";
import { LoadAssets } from "@components/LoadAssets";
import { Lobby } from "@components/Lobby";
import { Scene } from "@components/Scene";

import { publishRoundState } from "@helpers/round";

import "@i18n/config";

import "./style.css";

export const App = () => {
    return (
        <Suspense fallback={<></>}>
            <Client />
            <Game />
            <LoadAssets />
        </Suspense>
    );
}

const Game = () => {
    const roundState = useRecoilValue(publishRoundState);

    switch(roundState) {
        case "not-started":
            return <Lobby />

        case "choose-character":
            return <ChooseCharacter />

        case "running":
            return <Scene />

        case "finished":
            return <Finished />
    }
}
