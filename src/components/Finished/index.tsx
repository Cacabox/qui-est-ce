import React, { useEffect } from "react";
import { useRecoilRefresher_UNSTABLE, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { getCharacters } from "@helpers/character";
import { getRoundCharactersOpponent, publishRoundCharacters, publishRoundState } from "@helpers/round";

import "./style.css";

export const Finished = () => {
    const setPublishRoundState = useSetRecoilState(publishRoundState);

    const setCharactersPlayer   = useSetRecoilState(publishRoundCharacters);
    const setCharactersOpponent = useSetRecoilState(getRoundCharactersOpponent);

    const refreshCharacters = useRecoilRefresher_UNSTABLE(getCharacters);

    useEffect(() => {
        refreshCharacters();

        setCharactersPlayer([]);
        setCharactersOpponent([]);
    });

    const { t } = useTranslation();

    return (
        <div className="finished">
            <button className="finished--start-again" onClick={ () => setPublishRoundState("not-started") }>{ t("finished.start-again") }</button>
        </div>
    );
}
