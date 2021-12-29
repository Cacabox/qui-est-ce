import React, { Suspense, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Client } from "@components/Client";
import { Finished } from "@components/Finished";
import { LoadAssets } from "@components/LoadAssets";
import { Lobby } from "@components/Lobby";
import { Login } from "@components/Login";
import { Scene } from "@components/Scene";

import { getDatabasePath } from "@helpers/client";
import { getRoundState } from "@helpers/round";
import { getRoomId } from "@helpers/room";
import { getSettings } from "@helpers/settings";
import { getTwitchToken } from "@helpers/token";

import "@i18n/config";

import "./style.css";

export const App = () => {
    const roomId = useRecoilValue(getRoomId);
    const token  = useRecoilValue(getTwitchToken);

    const [settings, setSettings] = useRecoilState(getSettings);

    const { t } = useTranslation();

    useEffect(() => {
        setSettings({
            ...settings,
            lastRoom: roomId,
        });
    }, [roomId]);

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
    const path = useRecoilValue(getDatabasePath);

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
