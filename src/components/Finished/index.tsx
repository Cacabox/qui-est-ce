import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { getCharacterGuessForPlayer, getCharacterSecretForPlayer } from "@helpers/character";
import { getMe } from "@helpers/players";
import { getRoomWinner, getRoundState } from "@helpers/round";

import "./style.css";

export const Finished = () => {
    const me = useRecoilValue(getMe);

    const setRoundState        = useSetRecoilState(getRoundState);
    const setMyCharacterSecret = useSetRecoilState(getCharacterSecretForPlayer(me));
    const setMyGuessed         = useSetRecoilState(getCharacterGuessForPlayer(me));
    const setWinner            = useSetRecoilState(getRoomWinner);

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
