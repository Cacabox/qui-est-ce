import React, { Suspense, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Client } from "@components/Client";
import { LoadAssets } from "@components/LoadAssets";
import { Lobby } from "@components/Lobby";
import { Login } from "@components/Login";
import { Scene } from "@components/Scene";

import { getRoundStateForRoom } from "@helpers/round";
import { getRoomId, getRoomPath } from "@helpers/room";
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
    const room = useRecoilValue(getRoomPath);

    const roundState = useRecoilValue(getRoundStateForRoom(room));

    switch(roundState) {
        case "not-started":
            return <Lobby />

        case "running":
        case "finished":
            return <Scene />
    }
}
