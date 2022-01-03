import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { getCharacterGuessForPlayer, getCharacterSecretForPlayer } from "@helpers/character";
import { getMe } from "@helpers/players";
import { getRoomPath } from "@helpers/room";
import { getRoomWinnerForRoom, getRoundStateForRoom } from "@helpers/round";

import "./style.css";

export const Finished = () => {
    const me = useRecoilValue(getMe);
    const room = useRecoilValue(getRoomPath);

    const setRoundState        = useSetRecoilState(getRoundStateForRoom(room));
    const setMyCharacterSecret = useSetRecoilState(getCharacterSecretForPlayer(me));
    const setMyGuessed         = useSetRecoilState(getCharacterGuessForPlayer(me));
    const setWinner            = useSetRecoilState(getRoomWinnerForRoom(room));

    const newGame = () => {
        setMyCharacterSecret(undefined);
        setMyGuessed(undefined);
        setWinner(undefined);

        setRoundState("not-started");
    }

    const { t } = useTranslation();

    return (
        <div className="finished">
            <button className="finished--start-again" onClick={ newGame }>{ t("finished.start-again") }</button>
        </div>
    );
}
