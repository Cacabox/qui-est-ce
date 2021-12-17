import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Character, CharacterProps } from "@components/Character";
import { ChooseCharacter } from "@components/ChooseCharacter";

import { getChannel } from "@helpers/client";
import { getRoundOpponentSelectedCharacter, publishRoundCharacters } from "@helpers/round";
import { getSettings } from "@helpers/settings";

import "./style.css";
import { Plateau } from "@components/Plateau";

export const Scene = () => {
    const channel = useRecoilValue(getChannel);

    const settings = useRecoilValue(getSettings);

    const characters = useRecoilValue(publishRoundCharacters);

    const opponentCharacter  = useRecoilValue(getRoundOpponentSelectedCharacter);

    const [hideCharacters, setHideCharacters] = useState<CharacterProps[]>([])
    const [isGuessing, setGuess]              = useState<boolean>(false);

    const [characterGuessed, setCharacterGuess] = useState<CharacterProps | undefined>(undefined);

    const characterGuess = (character: CharacterProps) => {
        channel.publish("guess", character);

        setGuess(false);
    }

    const characterSelect = (character: CharacterProps) => {
        if (hideCharacters.includes(character)) {
            return setHideCharacters(hideCharacters.filter((hideCharacter) => hideCharacter !== character));
        }

        setHideCharacters([ ...hideCharacters, character ]);
    }

    useEffect(() => {
        channel.subscribe("guess", ({ data: guess, clientId }: { data: CharacterProps, clientId: string }) => {
            if (clientId !== settings.clientId) {
                setCharacterGuess(guess);
            }
        });
    }, [channel]);

    const className = ["scene"];

    if (isGuessing) {
        className.push("scene--guessing");
    }

    const { t } = useTranslation();

    return (
        <>
            <div className={ className.join(" ") }>
                {/* { characters.map((character, index) =>
                    <Character key={ index } character={ character } hide={ hideCharacters.includes(character) } onClick={ isGuessing ? characterGuess : characterSelect } />
                )} */}

                <Plateau characters={ characters } />
            </div>

            <div className="scene--bottom">
                { opponentCharacter &&
                    <div className="scene--opponent">
                        <Character character={ opponentCharacter } />
                    </div>
                }

                <div>
                    <button onClick={ () => setGuess(!isGuessing) }>{ isGuessing ? "Annuler" : "Je devine" }</button>

                    { characterGuessed &&
                        <div>
                            { t("plateau.guess") } { characterGuessed.name } ?

                            <button onClick={ () => setCharacterGuess(undefined) }>{ t("plateau.no") }</button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}
