import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { Character, CharacterProps } from "@components/Character";
import { ChooseCharacter } from "@components/ChooseCharacter";

import { getChannel } from "@helpers/client";
import { getRoundOpponentSelectedCharacter, publishRoundCharacters } from "@helpers/round";
import { getSettings } from "@helpers/settings";

import "./style.css";

export const Plateau = () => {
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

    const className = ["plateau"];

    if (isGuessing) {
        className.push("plateau--guessing");
    }

    const { t } = useTranslation();

    return (
        <>
            <div className={ className.join(" ") }>
                { characters.map((character, index) =>
                    <Character key={ index } character={ character } hide={ hideCharacters.includes(character) } onClick={ isGuessing ? characterGuess : characterSelect } />
                )}

            </div>

            <div className="plateau--bottom">
                { !opponentCharacter &&
                    <ChooseCharacter />
                }

                { opponentCharacter &&
                    <div className="plateau--opponent">
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
