import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";

import { Character, CharacterPositionProps, CharacterProps, CharacterState } from "@components/Character";

import { getMe, getOpponent } from "@helpers/players";
import { getRoomPath } from "@helpers/room";
import { getRoomWinnerForRoom } from "@helpers/round";

import "./style.css";

interface Bounds {
    x        : number,
    y        : number,
    width    : number,
    height   : number,
    padding ?: [number, number, number, number],
}

export interface ComputedBounds {
    left   : string,
    top    : string,
    width  : string,
    height : string,
}

export type PlateauAnimation = undefined | "win" | "loose";

const imageSize = {
    width  : 2400,
    height : 1840,
}

export const Plateau = ({
    characters,
    charactersHidden,
    onClick,
    opponent,
}: {
    characters        : CharacterProps[],
    charactersHidden ?: CharacterProps[],
    onClick          ?: (character: CharacterProps, state ?: CharacterState) => void,
    opponent         ?: CharacterProps,
}) => {
    const rowPosition: Bounds[] = [{
        y       : 173,
        x       : 364,
        width   : 1670,
        height  : 340,
        padding : [32, 32, 0, 32],
    }, {
        y       : 444,
        x       : 320,
        width   : 1777,
        height  : 354,
        padding : [32, 32, 0, 32],
    }, {
        y       : 800,
        x       : 236,
        width   : 1946,
        height  : 430,
        padding : [32, 32, 0, 32],
    }, {
        y       : 1155,
        x       : 877,
        width   : 650,
        height  : 430,
        padding : [32, 32, 0, 32],
    }];

    const rowSpacing = [32, 21, 11, 0];

    const [clicked] = useState(new Map<CharacterProps, boolean>());

    const [disabled, setDisabled]           = useState(false);
    const [overrideState, setOverrideState] = useState<CharacterState | undefined>(undefined);

    const room = useRecoilValue(getRoomPath);

    const opponentPlayer = useRecoilValue(getOpponent);
    const winner         = useRecoilValue(getRoomWinnerForRoom(room));
    const me             = useRecoilValue(getMe);

    const computeBounds = (bounds: Bounds, relative: Pick<Bounds, "width" | "height" | "padding">): ComputedBounds => {
        let tempBounds = { ...bounds };

        if (tempBounds.padding) {
            const [padTop, padRight, padBottom, padLeft] = tempBounds.padding;

            tempBounds.x -= padLeft;
            tempBounds.y -= padTop;

            tempBounds.width  = tempBounds.width  + padLeft + padRight;
            tempBounds.height = tempBounds.height + padTop  + padBottom;
        }

        let tempRelative = { ...relative };

        if (tempRelative.padding) {
            const [padTop, padRight, padBottom, padLeft] = tempRelative.padding;

            tempRelative.width  = tempRelative.width  + padLeft + padRight;
            tempRelative.height = tempRelative.height + padTop  + padBottom;

            tempBounds.x += padLeft;
            tempBounds.y += padTop;
        }

        const { x, y, width, height } = tempBounds;

        return {
            height : `${ (height / tempRelative.height) * 100 }%`,
            left   : `${ (x      / tempRelative.width)  * 100 }%`,
            top    : `${ (y      / tempRelative.height) * 100 }%`,
            width  : `${ (width  / tempRelative.width)  * 100 }%`,
        }
    }

    const getPosition = (row: number, column: number, character ?: CharacterProps): CharacterPositionProps => {
        const width = (rowPosition[row].width - (rowSpacing[row] * 7)) / (row > 2 ? 3 : 8);

        const bounds: Bounds = {
            x: (width * column) + (rowSpacing[row] * column),
            y: 0,
            width,
            height: rowPosition[row].height,
        };

        const isHidden = charactersHidden && character && charactersHidden.includes(character);

        return {
            ...computeBounds(bounds, rowPosition[row]),
            zIndex : !overrideState && isHidden
                ? characters.length - (row * 10) + column
                : 100 + (row * 10) + column,
        }
    }

    const getDelay = (row: number, column: number, character: CharacterProps) => {
        const isRowOdd = (row % 2) === 1;

        if (overrideState === "win") {
            return column + (isRowOdd ? 1.8 : 1);
        }

        if (clicked.get(character)) {
            return 1;
        }

        if (!isRowOdd) {
            return (row * 8) + column;
        }

        return (row * 8) + (7 - column);
    }

    const getState = (character: CharacterProps): CharacterState => {
        if (overrideState) {
            return overrideState;
        }

        if (charactersHidden && charactersHidden.includes(character)) {
            return "hidden";
        }

        return "visible";
    }

    const charactersPerRow = characters.reduce<CharacterProps[][]>((previous, current, index) => {
        const row = Math.floor(index / 8);

        previous[row] = previous[row] || [];

        previous[row].push(current);

        return previous;
    }, []);

    const wait = (time: number) => new Promise(resolve => setTimeout(_ => resolve(true), time));

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
                zIndex        : 0,
            }

            setDisabled(true);
            setOverrideState("extrahidden");

            await wait(150);
            if (isCancelled) { return }

            setOverrideState("win");

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

            setOverrideState("hidden");
            setOverrideState(undefined);
            setDisabled(false);
        })();

        return () => {
            isCancelled = true;

            clearInterval(confettiInterval);

            setOverrideState("hidden");
            setOverrideState(undefined);
            setDisabled(false);
        }
    }, [winner, me]);

    useEffect(() => {
        if (!winner || !me || winner.id === me.id) {
            return;
        }

        let isCancelled = false;

        (async() => {
            setOverrideState("extrahidden");
            setDisabled(true);

            await wait(10_150);
            if (isCancelled) { return }

            setOverrideState(undefined);
            setDisabled(false);
        })();

        return () => {
            isCancelled = true;

            setOverrideState("hidden");
            setOverrideState(undefined);
            setDisabled(false);
        }
    }, [winner, me]);

    const { t } = useTranslation();

    return (
        <div className="plateau">
            <img src="assets/plateau-front.webp" alt="Plateau" />

            { charactersPerRow.map((row, rowIndex) =>
                <div className="plateau--row" key={ rowIndex } style={{ ...computeBounds(rowPosition[rowIndex], imageSize) }}>
                    { row.map((character, index) =>
                        <Character
                            key={ index }
                            animateDelay={ getDelay(rowIndex, index, character) }
                            character={ character }
                            disabled={ disabled }
                            onClick={ clicked.set(character, true) && onClick }
                            position={ getPosition(rowIndex, index, character) }
                            state={ getState(character)  }
                        />
                    )}
                </div>
            )}

            { opponent && opponentPlayer &&
                <div className="plateau--opponent" style={{ ...computeBounds(rowPosition[3], imageSize) }}>
                    <div className="plateau--opponent__row">
                        <Character
                            character={ opponent }
                            disabled={ true }
                            position={ getPosition(3, 0) }
                            state={ "visible" }
                        />
                    </div>

                    <div className="plateau--opponent__info">
                        <div className="plateau--opponent__name">{ opponentPlayer.name }</div>
                        <div>{ t("scene.must-guess") }</div>
                        <div className="plateau--opponent__arrow">
                            <svg viewBox="0 0 500 500" width="500" height="500">
                                <path style={{ fill: "none", strokeWidth: "8px", stroke: "rgb(247, 17, 94)", strokeLinejoin: "round", strokeLinecap: "round" }} d="M 5.127 74.702 C 53.948 79.023 65.32 43.175 64.995 18.138"/>
                                <path style={{ fill: "none", strokeWidth: "8px", stroke: "rgb(247, 17, 94)", strokeLinejoin: "round", strokeLinecap: "round" }} d="M 52.224 21.27 C 52.224 21.27 55.74 7.044 64.61 4.754 C 73.499 2.459 76.584 22.509 76.584 22.509"/>
                            </svg>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};
