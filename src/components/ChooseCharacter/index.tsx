import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { Character, CharacterProps } from "@components/Character";

import { getRoundOpponentCharacters, getRoundOpponentSelectedCharacter } from "@helpers/round";

import "./style.css";

export const ChooseCharacter = () => {
    const setOpponentCharacter = useSetRecoilState(getRoundOpponentSelectedCharacter);

    const opponentCharacters = useRecoilValue(getRoundOpponentCharacters);

    const choose = (character: CharacterProps) => {
        setOpponentCharacter(character);
    };

    return (
        <div className="choosecharacter">
            <div className="choosecharacter--title">Choisi le personnage que ton adversaire doit découvrir</div>

            <div className="choosecharacter--container">
                <div className="choosecharacter--list">
                    { opponentCharacters.map((character, index) => <Character key={ index } character={ character } onClick={ choose } />) }
                </div>
            </div>
        </div>
    );
}
