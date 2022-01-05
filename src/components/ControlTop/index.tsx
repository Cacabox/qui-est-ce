import React from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import { useTranslation } from "react-i18next";

import { getCharacterGuessForPlayer, getCharacterSecretForPlayer } from "@helpers/character";
import { analyticsClient } from "@helpers/client";
import { getMe } from "@helpers/players";
import { getRoomId, getRoomPath } from "@helpers/room";
import { getRoomWinnerForRoom, getRoundStateForRoom } from "@helpers/round";
import { getSettings } from "@helpers/settings";
import { getHashParams } from "@helpers/utils";

import "./style.css";

export const ControlTop = () => {
    const me = useRecoilValue(getMe);
    const room = useRecoilValue(getRoomPath);

    const [roundState, setRoundState] = useRecoilState(getRoundStateForRoom(room));
    const [settings, setSettings]     = useRecoilState(getSettings);

    const roomId = useRecoilValue(getRoomId);

    const setHashParams        = useSetRecoilState(getHashParams);
    const setMyCharacterSecret = useSetRecoilState(getCharacterSecretForPlayer(me));
    const setMyGuessed         = useSetRecoilState(getCharacterGuessForPlayer(me));
    const setWinner            = useSetRecoilState(getRoomWinnerForRoom(room));

    const refreshRoomId = useRecoilRefresher_UNSTABLE(getRoomId);

    const getRoomIdMasked = () => {
        const tmp = roomId.split("");

        return tmp.map((char, index) => index < tmp.length - 3 ? "⁕" : char);
    }

    const newRoom = () => {
        setRoundState("not-started");

        setSettings({
            ...settings,
            lastRoom: undefined,
        });

        setHashParams(new Map());

        refreshRoomId();

        logEvent(analyticsClient, "newRoom");
    }

    const exit = () => {
        setRoundState("not-started");

        logEvent(analyticsClient, "exit");
    }

    const newGame = () => {
        setMyCharacterSecret(undefined);
        setMyGuessed(undefined);
        setWinner(undefined);

        setRoundState("not-started");
    }

    const { t } = useTranslation();

    switch (roundState) {
        case "not-started":
            return (
                <div className="control-top control-top--not-started">
                    <div>
                        { t("lobby.room") } <span className="control-top--not-started__room-id">{ getRoomIdMasked() }</span>
                    </div>

                    <button className="control-top--not-started__new-room" onClick={ () => newRoom() }>{ t("control-top.new-room") }</button>
                </div>
            );

        case "running":
            return (
                <div className="control-top control-top--running">
                    <button className="control-top--running__quit" onClick={ () => exit() }>{ t("control-top.quit") }</button>
                </div>
            );

        case "finished":
            return (
                <div className="control-top control-top--finished">
                    <button className="finished--start-again" onClick={ newGame }>{ t("control-top.start-again") }</button>
                </div>
            );
    }
}
