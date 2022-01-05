import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Character, CharacterPositionProps, CharacterProps, CharacterState } from "@components/Character";

import type { Player } from "@helpers/players";

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

const imageSize = {
    width  : 2400,
    height : 1840,
}

export const Plateau = ({
    animation,
    characters,
    charactersHidden,
    disabled,
    onClick,
    opponent,
}: {
    animation        ?: CharacterState,
    characters        : CharacterProps[],
    charactersHidden ?: CharacterProps[],
    disabled         ?: boolean,
    onClick          ?: (character: CharacterProps, state: CharacterState) => void,
    opponent         ?: {
        player: Player,
        secret: CharacterProps,
    }
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
            zIndex : !animation && isHidden
                ? characters.length - (row * 10) + column
                : 100 + (row * 10) + column,
        }
    }

    const getDelay = (row: number, column: number, character: CharacterProps) => {
        const isRowOdd = (row % 2) === 1;

        if (animation === "win") {
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
        if (animation) {
            return animation;
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

            { opponent &&
                <div className="plateau--opponent" style={{ ...computeBounds(rowPosition[3], imageSize) }}>
                    <div className="plateau--opponent__row">
                        <Character
                            character={ opponent.secret }
                            disabled={ true }
                            position={ getPosition(3, 0) }
                            state={ "visible" }
                        />
                    </div>

                    <div className="plateau--opponent__info">
                        <div className="plateau--opponent__name">{ opponent.player.name }</div>
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
