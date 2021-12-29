import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Client } from "@components/Client";
import { Finished } from "@components/Finished";
import { LoadAssets } from "@components/LoadAssets";
import { Lobby } from "@components/Lobby";
import { Login } from "@components/Login";
import { Scene } from "@components/Scene";

import { getFirestorePath } from "@helpers/client";
import { getRoundState } from "@helpers/round";
import { getTwitchToken } from "@helpers/token";

import "@i18n/config";

import "./style.css";

export const App = () => {
    const token = useRecoilValue(getTwitchToken);

    const { t } = useTranslation();

    if (token === "") {
        return <Login />;
    }

    return (
        <Suspense fallback={<div className="app--loading">{ t("app.loading") }</div>}>
            <Client />
            <Game />
            <LoadAssets />
        </Suspense>
    );
}

const Game = () => {
    const path = useRecoilValue(getFirestorePath);

    const roundState = useRecoilValue(getRoundState(path.room));

    switch(roundState) {
        case "not-started":
            return <Lobby />

        case "running":
            return <Scene />

        case "finished":
            return <Finished />
    }
}
