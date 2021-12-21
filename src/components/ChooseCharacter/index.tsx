import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import type { CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";

import { getRoundCharactersOpponent, getRoundCharacterToGuess, roundStateAtom } from "@helpers/round";

import "./style.css";

export const ChooseCharacter = () => {
    const setCharacterToGuess = useSetRecoilState(getRoundCharacterToGuess);
    const setRoundState       = useSetRecoilState(roundStateAtom);

    const opponentCharacters = useRecoilValue(getRoundCharactersOpponent);

    const choose = (character: CharacterProps) => {
        setCharacterToGuess(character);
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
