import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Character, CharacterProps } from "@components/Character";
import { ChooseCharacter } from "@components/ChooseCharacter";
import { Plateau } from "@components/Plateau";

import { getCharacterGuessForUser, getCharacterSecretForUser, getCharactersForUser } from "@helpers/character";
import { analyticsClient, getDatabasePath } from "@helpers/client";
import { getOpponent, getPlayers } from "@helpers/players";
import { getRoundState } from "@helpers/round";

import "./style.css";

export const Scene = () => {
    const path = useRecoilValue(getDatabasePath);

    const myCharacters     = useRecoilValue(getCharactersForUser(path.me));
    const characterSecret  = useRecoilValue(getCharacterSecretForUser(path.opponent));
    const opponent         = useRecoilValue(getOpponent);
    const players          = useRecoilValue(getPlayers);

    const setOpponentGuessed    = useSetRecoilState(getCharacterGuessForUser(path.opponent));
    const [myGuess, setMyGuess] = useRecoilState(getCharacterGuessForUser(path.me));

    const setRoundState = useSetRecoilState(getRoundState(path.room));

    const [charactersHidden, setCharactersHidden] = useState<CharacterProps[]>([]);
    const [isGuessing, setGuess]                  = useState<boolean>(false);

    let numberOfGuess = 0;

    useEffect(() => {
        if (myGuess !== undefined) {
            numberOfGuess++;
        }
    }, [myGuess]);

    const characterGuess = (character: CharacterProps, isHidden?: boolean) => {
        if (isHidden) {
            return;
        }

        setOpponentGuessed(character);

        setGuess(false);
    }

    const characterSelect = (character: CharacterProps) => {
        if (charactersHidden.includes(character)) {
            return setCharactersHidden(charactersHidden.filter((_) => _ !== character));
        }

        setCharactersHidden([ ...charactersHidden, character ]);
    }

    const loose = () => {
        setMyGuess(undefined);

        setRoundState("finished");

        logEvent(analyticsClient, "endRound", { players, numberOfGuess });
    }

    const className = ["scene--plateau"];

    if (isGuessing) {
        className.push("scene--guessing");
    }

    const variants = {
        hidden  : { y: "-100%" },
        visible : { y: 0 },
    }

    const { t } = useTranslation();

    if (!characterSecret) {
        return <ChooseCharacter />;
    }

    return (
        <div className="scene">
            <div className={ className.join(" ") }>
                <Plateau characters={ myCharacters } charactersHidden={ charactersHidden } onClick={ isGuessing ? characterGuess : characterSelect } />

                <AnimatePresence>
                    <motion.button
                        className="scene--guessing__button"
                        onClick={ () => setGuess(!isGuessing) }
                    >
                        { isGuessing
                            ? <svg height="48" width="48" viewBox="0 0 24 24"><path d="M13.427 3.021h-7.427v-3.021l-6 5.39 6 5.61v-3h7.427c3.071 0 5.561 2.356 5.561 5.427 0 3.071-2.489 5.573-5.561 5.573h-7.427v5h7.427c5.84 0 10.573-4.734 10.573-10.573s-4.733-10.406-10.573-10.406z"/></svg>
                            : "?"
                        }
                    </motion.button>
                </AnimatePresence>
            </div>

            { characterSecret &&
                <div className="scene--opponent">
                    { opponent &&
                        <div className="scene--opponent__info">
                            <div className="scene--opponent__name">{ opponent.name }</div>
                            <div>{ t("scene.must-guess") }</div>
                        </div>
                    }

                    <div className="scene--opponent__character">
                        <Character character={ characterSecret } />
                    </div>
                </div>
            }

            <AnimatePresence>
                { myGuess &&
                    <div className="scene--characterguessed">
                        <motion.div
                            className="scene--characterguessed__content"
                            transition={{ duration: 0.3 }}
                            initial="hidden"
                            animate="visible"
                            variants={ variants }
                            exit={ variants.hidden }
                        >
                            <div>{ t("plateau.guess") } <span className="scene--characterguessed__name">{ myGuess.name }</span> ?</div>

                            { myGuess.id === characterSecret.id &&
                                <button onClick={ loose }>{ t("plateau.yes") }</button>
                            }

                            { myGuess.id !== characterSecret.id &&
                                <button onClick={ () => setMyGuess(undefined) }>{ t("plateau.no") }</button>
                            }
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
        </div>
    );
}
