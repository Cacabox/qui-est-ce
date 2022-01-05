import React, { Suspense, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Client } from "@components/Client";
import { ControlTop } from "@components/ControlTop";
import { LoadAssets } from "@components/LoadAssets";
import { NotificationCenter } from "@components/NotificationCenter";
import { Lobby } from "@components/Lobby";
import { Login } from "@components/Login";
import { Logo } from "@components/Logo";
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
        return (
            <>
                <Login />;
                <Logo />;
            </>
        )
    }

    return (
        <>
            <Suspense fallback={ <div className="app--loading">{ t("app.loading") }</div> }>
                <Client />
                <ControlTop />
                <NotificationCenter />
                <Game />
            </Suspense>

            <LoadAssets />
            <Logo />
        </>
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
