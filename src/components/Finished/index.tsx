import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { getCharacterGuessForUser, getCharacterSecretForUser } from "@helpers/character";
import { getFirestorePath } from "@helpers/client";
import { getRoundState } from "@helpers/round";

import "./style.css";

export const Finished = () => {
    const path = useRecoilValue(getFirestorePath);

    const setRoundState              = useSetRecoilState(getRoundState(path.room));
    const setMyCharacterSecret       = useSetRecoilState(getCharacterSecretForUser(path.me));
    const setMyGuessed               = useSetRecoilState(getCharacterGuessForUser(path.me));
    const setOpponentCharacterSecret = useSetRecoilState(getCharacterSecretForUser(path.opponent));
    const setOpponentGuessed         = useSetRecoilState(getCharacterGuessForUser(path.opponent));

    useEffect(() => {
        setMyCharacterSecret(undefined);
        setMyGuessed(undefined);
        setOpponentCharacterSecret(undefined);
        setOpponentGuessed(undefined);
    }, []);

    const { t } = useTranslation();

    return (
        <div className="finished">
            <button className="finished--start-again" onClick={ () => setRoundState("not-started") }>{ t("finished.start-again") }</button>
        </div>
    );
}
