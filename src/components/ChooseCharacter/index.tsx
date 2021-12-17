import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";

import { getRoundOpponentCharacters, getRoundOpponentSelectedCharacter, roundStateAtom } from "@helpers/round";

import "./style.css";

export const ChooseCharacter = () => {
    const setOpponentCharacter = useSetRecoilState(getRoundOpponentSelectedCharacter);
    const setRoundState        = useSetRecoilState(roundStateAtom);

    const opponentCharacters = useRecoilValue(getRoundOpponentCharacters);

    const choose = (character: CharacterProps) => {
        setOpponentCharacter(character);
        setRoundState("running");
    };

    const { t } = useTranslation();

    return (
        <div className="choosecharacter">
            <div className="choosecharacter--modal">
                <div className="choosecharacter--modal__title">{ t("choosecharacter.title") }</div>

                <div className="choosecharacter--modal__container">
                    <Plateau characters={ opponentCharacters } onClick={ choose } />
                </div>
            </div>
        </div>
    );
}
