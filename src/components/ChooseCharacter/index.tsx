import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";
import { Player } from "@components/Player";

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

    const variants = {
        hidden  : { scale: 0 },
        visible : { scale: 1 },
    }

    return (
        <div className="choosecharacter">
            <div className="choosecharacter--modal">
                <div className="choosecharacter--modal__title">
                    <span>{ t("choosecharacter.title") }</span>
                    { opponent && <Player { ...opponent } inline /> }
                </div>

                <AnimatePresence>
                    <motion.div
                        className="choosecharacter--modal__container"
                        animate={ "visible" }
                        initial={ "hidden" }
                        exit={ "hidden" }
                        variants={ variants }
                    >
                        <Plateau characters={ opponentCharacters } onClick={ choose } />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
