import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import type { CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";

import { getCharacterSecretForUser, getCharactersForUser } from "@helpers/character";
import { getDatabasePath } from "@helpers/client";

import "./style.css";

export const ChooseCharacter = () => {
    const path = useRecoilValue(getDatabasePath);

    const setCharacterSecret = useSetRecoilState(getCharacterSecretForUser(path.opponent));

    const opponentCharacters = useRecoilValue(getCharactersForUser(path.opponent));

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
