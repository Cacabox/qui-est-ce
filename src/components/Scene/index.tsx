import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Character, CharacterProps } from "@components/Character";
import { Plateau } from "@components/Plateau";

import { getChannel } from "@helpers/client";
import { getRoundOpponentSelectedCharacter, publishRoundCharacters } from "@helpers/round";
import { getSettings } from "@helpers/settings";

import "./style.css";

export const Scene = () => {
    const channel = useRecoilValue(getChannel);

    const settings = useRecoilValue(getSettings);

    const characters = useRecoilValue(publishRoundCharacters);

    const opponentCharacter  = useRecoilValue(getRoundOpponentSelectedCharacter);

    const [charactersHidden, setCharactersHidden] = useState<CharacterProps[]>([]);
    const [isGuessing, setGuess]                  = useState<boolean>(false);

    const [characterGuessed, setCharacterGuess] = useState<CharacterProps | undefined>(undefined);

    const characterGuess = (character: CharacterProps, isHidden?: boolean) => {
        if (isHidden) {
            return;
        }

        channel.publish("guess", character);

        setGuess(false);
    }

    const characterSelect = (character: CharacterProps) => {
        if (charactersHidden.includes(character)) {
            return setCharactersHidden(charactersHidden.filter((_) => _ !== character));
        }

        setCharactersHidden([ ...charactersHidden, character ]);
    }

    useEffect(() => {
        channel.subscribe("guess", ({ data: guess, clientId }: { data: CharacterProps, clientId: string }) => {
            if (clientId !== settings.clientId) {
                setCharacterGuess(guess);
            }
        });
    }, [channel]);

    const className = ["scene--plateau"];

    if (isGuessing) {
        className.push("scene--guessing");
    }

    const variants = {
        hidden  : { y: "-100%" },
        visible : { y: 0 },
    }

    const { t } = useTranslation();

    return (
        <div className="scene">
            <div className={ className.join(" ") }>
                <Plateau characters={ characters } charactersHidden={ charactersHidden } onClick={ isGuessing ? characterGuess : characterSelect } />

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

            { opponentCharacter &&
                <div className="scene--opponent">
                    <Character character={ opponentCharacter } />
                </div>
            }

            <AnimatePresence>
                { characterGuessed &&
                    <div className="scene--characterguessed">
                        <motion.div
                            className="scene--characterguessed__content"
                            transition={{ duration: 0.3 }}
                            initial="hidden"
                            animate="visible"
                            variants={ variants }
                            exit={ variants.hidden }
                        >
                            <div>{ t("plateau.guess") } <span className="scene--characterguessed__name">{ characterGuessed.name }</span> ?</div>

                            { characterGuessed.id === opponentCharacter?.id &&
                                <button onClick={ () => setCharacterGuess(undefined) }>{ t("plateau.yes") }</button>
                            }

                            { characterGuessed.id !== opponentCharacter?.id &&
                                <button onClick={ () => setCharacterGuess(undefined) }>{ t("plateau.no") }</button>
                            }
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
        </div>
    );
}
