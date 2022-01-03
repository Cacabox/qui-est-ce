import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import type { CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";

import { getCharacterSecretForPlayer, getCharactersForPlayer } from "@helpers/character";
import { getOpponent } from "@helpers/players";

import "./style.css";

export const ChooseCharacter = () => {
    const opponent = useRecoilValue(getOpponent);

    const setCharacterSecret = useSetRecoilState(getCharacterSecretForPlayer(opponent));

    const opponentCharacters = useRecoilValue(getCharactersForPlayer(opponent));

    const choose = (character: CharacterProps) => {
        setCharacterSecret(character);
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
