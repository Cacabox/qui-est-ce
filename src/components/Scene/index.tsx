import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";

import { CharacterProps, CharacterState } from "@components/Character";
import { ChooseCharacter } from "@components/ChooseCharacter";
import { Plateau } from "@components/Plateau";
import { Logo } from "@components/Logo";

import { getCharacterGuessForPlayer, getCharacterSecretForPlayer, getCharactersForPlayer } from "@helpers/character";
import { analyticsClient } from "@helpers/client";
import { addNotificationProxy } from "@helpers/notification";
import { getMe, getOpponent, getPlayersForRoom } from "@helpers/players";
import { getRoomPath } from "@helpers/room";
import { getRoomWinnerForRoom, getRoundStateForRoom } from "@helpers/round";

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
    const [winner, setWinner]               = useRecoilState(getRoomWinnerForRoom(room));

    const addNotification = useSetRecoilState(addNotificationProxy);

    const [charactersHidden, setCharactersHidden] = useState<CharacterProps[]>([]);
    const [isGuessing, setGuess]                  = useState<boolean>(false);
    const [disablePlateau, setDisablePlateau]     = useState<boolean>(false);
    const [plateauAnimation, setPlateauAnimation] = useState<CharacterState | undefined>();

    const { t } = useTranslation();

    const wait = (time: number) => new Promise(resolve => setTimeout(_ => resolve(true), time));

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

    let numberOfGuess = 0;

    useEffect(() => {
        if (opponentGuess === undefined || characterSecret === undefined) {
            return;
        }

        if (opponentGuess.reason !== "asking") {
            return;
        }

        const actionRight = {
            text    : t("plateau.yes"),
            onClick : rightGuess,
        }

        const actionWrong = {
            text    : t("plateau.no"),
            onClick : wrongGuess,
        }

        addNotification({
            text    : `${ t("plateau.guess-asking") } <span class="scene--characterguessed__name">${ opponentGuess.name }</span> ?`,
            actions : (opponentGuess.id === characterSecret.id) ? [actionRight] : [actionWrong],
        });
    }, [opponentGuess, characterSecret]);

    useEffect(() => {
        let timeout: any;

        if (myGuess !== undefined) {
            if (myGuess.reason === "asking") {
                numberOfGuess++;

                return;
            }

            const text = (myGuess.reason === "right")
                ? `${ t("plateau.guess-right") } <span class="scene--characterguessed__name">${ myGuess.name }</span> !`
                : `${ t("plateau.guess-wrong") } <span class="scene--characterguessed__name">${ myGuess.name }</span>.`;

            addNotification({ text });

            timeout = setTimeout(() => {
                setMyGuess(undefined);
            }, 5_000);
        }

        return () => clearTimeout(timeout);
    }, [myGuess]);

    useEffect(() => {
        if (!winner || !me || winner.id !== me.id) {
            return;
        }

        let isCancelled = false;
        let confettiInterval: any;

        (async() => {
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const confettiOptions: confetti.Options = {
                particleCount : 100,
                spread        : 360,
                startVelocity : 30,
                ticks         : 100,
                zIndex        : 8999,
            }

            setDisablePlateau(true);
            setPlateauAnimation("loose");

            await wait(150);
            if (isCancelled) { return }

            setPlateauAnimation("win");

            confettiInterval = setInterval(() => {
                confetti({
                    ...confettiOptions,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });

                confetti({
                    ...confettiOptions,
                    origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 }
                });

                confetti({
                    ...confettiOptions,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 400);

            await wait(10_000);
            if (isCancelled) { return }

            clearInterval(confettiInterval);

            setPlateauAnimation("hidden");
            setPlateauAnimation(undefined);
            setDisablePlateau(false);
        })();

        return () => {
            isCancelled = true;

            clearInterval(confettiInterval);

            setPlateauAnimation("hidden");
            setPlateauAnimation(undefined);
            setDisablePlateau(false);
        }
    }, [winner, me]);

    useEffect(() => {
        if (!winner || !me || winner.id === me.id) {
            return;
        }

        let isCancelled = false;

        (async() => {
            setPlateauAnimation("loose");
            setDisablePlateau(true);

            await wait(10_150);
            if (isCancelled) { return }

            setPlateauAnimation(undefined);
            setDisablePlateau(false);
        })();

        return () => {
            isCancelled = true;

            setPlateauAnimation("hidden");
            setPlateauAnimation(undefined);
            setDisablePlateau(false);
        }
    }, [winner, me]);

    const className = ["scene--plateau"];

    if (isGuessing) {
        className.push("scene--guessing");
    }

    if (!opponent) {
        return null;
    }

    if (!characterSecret) {
        return <ChooseCharacter />;
    }

    return (
        <div className="scene">
            <Logo top />

            <div className={ className.join(" ") }>
                <Plateau
                    animation={ plateauAnimation }
                    characters={ myCharacters }
                    charactersHidden={ charactersHidden }
                    disabled={ disablePlateau }
                    opponent={{ player: opponent, secret: characterSecret }}
                    onClick={ isGuessing ? characterGuess : characterSelect }
                />

                { roundState !== "finished" &&
                    <button
                        className="scene--guessing__button"
                        onClick={ () => setGuess(!isGuessing) }
                    >
                        { isGuessing
                            ? <svg height="48" width="48" viewBox="0 0 24 24"><path d="M13.427 3.021h-7.427v-3.021l-6 5.39 6 5.61v-3h7.427c3.071 0 5.561 2.356 5.561 5.427 0 3.071-2.489 5.573-5.561 5.573h-7.427v5h7.427c5.84 0 10.573-4.734 10.573-10.573s-4.733-10.406-10.573-10.406z"/></svg>
                            : "?"
                        }
                    </button>
                }
            </div>
        </div>
    );
}
