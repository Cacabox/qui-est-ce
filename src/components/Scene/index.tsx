import React, { useEffect, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { CharacterProps, CharacterState } from "@components/Character";
import { ChooseCharacter } from "@components/ChooseCharacter";
import { Finished } from "@components/Finished";
import { Plateau } from "@components/Plateau";

import { getCharacterGuessForPlayer, getCharacterSecretForPlayer, getCharactersForPlayer } from "@helpers/character";
import { analyticsClient } from "@helpers/client";
import { getMe, getOpponent, getPlayersForRoom } from "@helpers/players";
import { getRoomId, getRoomPath } from "@helpers/room";
import { getRoomWinnerForRoom, getRoundStateForRoom } from "@helpers/round";
import { getSettings } from "@helpers/settings";
import { getHashParams } from "@helpers/utils";

import "./style.css";

export const Scene = () => {
    const room = useRecoilValue(getRoomPath);

    const me       = useRecoilValue(getMe);
    const opponent = useRecoilValue(getOpponent);
    const players  = useRecoilValue(getPlayersForRoom(room));

    const myCharacters     = useRecoilValue(getCharactersForPlayer(me));
    const characterSecret  = useRecoilValue(getCharacterSecretForPlayer(opponent));

    const [myGuess, setMyGuess]             = useRecoilState(getCharacterGuessForPlayer(me));
    const [opponentGuess, setOpponentGuess] = useRecoilState(getCharacterGuessForPlayer(opponent));
    const [roundState, setRoundState]       = useRecoilState(getRoundStateForRoom(room));
    const [settings, setSettings]           = useRecoilState(getSettings);

    const setHashParams = useSetRecoilState(getHashParams);
    const setWinner     = useSetRecoilState(getRoomWinnerForRoom(room));

    const [charactersHidden, setCharactersHidden] = useState<CharacterProps[]>([]);
    const [isGuessing, setGuess]                  = useState<boolean>(false);

    const refreshRoomId = useRecoilRefresher_UNSTABLE(getRoomId);

    const characterGuess = (character: CharacterProps, state?: CharacterState) => {
        if (state === "hidden") {
            return;
        }

        setMyGuess({ ...character, reason: "asking" });

        setGuess(false);
    }

    const characterSelect = (character: CharacterProps) => {
        if (charactersHidden.includes(character)) {
            return setCharactersHidden(charactersHidden.filter((_) => _ !== character));
        }

        setCharactersHidden([ ...charactersHidden, character ]);
    }

    const rightGuess = () => {
        if (!opponentGuess) {
            throw new Error();
        }

        setOpponentGuess({ ...opponentGuess, reason: "right" });

        setRoundState("finished");

        setWinner(opponent);

        logEvent(analyticsClient, "endRound", { players, numberOfGuess });
    }

    const wrongGuess = () => {
        if (!opponentGuess) {
            throw new Error();
        }

        setOpponentGuess({ ...opponentGuess, reason: "wrong" });
    }

    const exit = () => {
        setRoundState("not-started");

        setSettings({
            ...settings,
            lastRoom: undefined,
        });

        setHashParams(new Map());

        refreshRoomId();

        logEvent(analyticsClient, "exit", { players });
    }

    let numberOfGuess = 0;

    useEffect(() => {
        if (myGuess !== undefined && myGuess.reason === "asking") {
            numberOfGuess++;
        }
    }, [myGuess]);

    useEffect(() => {
        let timeout: any;

        if (myGuess !== undefined && myGuess.reason !== "asking") {
            setTimeout(() => {
                setMyGuess(undefined);
            }, 5000);
        }

        return () => clearTimeout(timeout);
    }, [myGuess]);

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
            { roundState !== "finished" &&
                <div className="scene--quit">
                    <button onClick={ exit }>{ t("scene.quit") }</button>
                </div>
            }

            { roundState === "finished" &&
                <Finished />
            }

            <div className={ className.join(" ") }>
                <Plateau characters={ myCharacters } charactersHidden={ charactersHidden } opponent={ characterSecret } onClick={ isGuessing ? characterGuess : characterSelect } />

                { roundState !== "finished" &&
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
                }
            </div>

            <AnimatePresence>
                { opponentGuess && opponentGuess.reason === "asking" &&
                    <div className="scene--characterguessed">
                        <motion.div
                            className="scene--characterguessed__content"
                            transition={{ duration: 0.3 }}
                            initial="hidden"
                            animate="visible"
                            variants={ variants }
                            exit={ variants.hidden }
                        >
                            <div>{ t("plateau.guess-asking") } <span className="scene--characterguessed__name">{ opponentGuess.name }</span> ?</div>

                            { opponentGuess.id === characterSecret.id &&
                                <button onClick={ rightGuess }>{ t("plateau.yes") }</button>
                            }

                            { opponentGuess.id !== characterSecret.id &&
                                <button onClick={ wrongGuess }>{ t("plateau.no") }</button>
                            }
                        </motion.div>
                    </div>
                }
            </AnimatePresence>

            <AnimatePresence>
                { myGuess && myGuess.reason !== "asking" &&
                    <div className="scene--characterguessed">
                        <motion.div
                            className="scene--characterguessed__content"
                            transition={{ duration: 0.3 }}
                            initial="hidden"
                            animate="visible"
                            variants={ variants }
                            exit={ variants.hidden }
                        >
                            { myGuess.reason === "right" &&
                                <div>{ t("plateau.guess-right") } <span className="scene--characterguessed__name">{ myGuess.name }</span> !</div>
                            }

                            { myGuess.reason === "wrong" &&
                                <div>{ t("plateau.guess-wrong") } <span className="scene--characterguessed__name">{ myGuess.name }</span>.</div>
                            }
                        </motion.div>
                    </div>
                }
            </AnimatePresence>
        </div>
    );
}
