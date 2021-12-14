import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { Character, CharacterProps } from "@components/Character";

import { getRoundOpponentCharacters, getRoundOpponentSelectedCharacter } from "@helpers/round";

import "./style.css";

export const ChooseCharacter = () => {
    const setOpponentCharacter = useSetRecoilState(getRoundOpponentSelectedCharacter);

    const opponentCharacters = useRecoilValue(getRoundOpponentCharacters);

    const choose = (character: CharacterProps) => {
        setOpponentCharacter(character);
    };

    const { t } = useTranslation();

    return (
        <div className="choosecharacter">
            <div className="choosecharacter--title">{ t("choosecharacter.title") }</div>

            <div className="choosecharacter--container">
                <div className="choosecharacter--list">
                    { opponentCharacters.map((character, index) => <Character key={ index } character={ character } onClick={ choose } />) }
                </div>
            </div>
        </div>
    );
}
