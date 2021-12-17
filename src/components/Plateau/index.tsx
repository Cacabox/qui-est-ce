import React from "react";

import { Character, CharacterPositionProps, CharacterProps } from "@components/Character";

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
    characters,
    onClick,
}: {
    characters : CharacterProps[]
    onClick   ?: (character: CharacterProps) => void,
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
    }];

    const rowSpacing = [32, 21, 11];

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

    const getPosition = (row: number, column: number): CharacterPositionProps => {
        const width = (rowPosition[row].width - (rowSpacing[row] * 7)) / 8;

        const bounds: Bounds = {
            x: (width * column) + (rowSpacing[row] * column),
            y: 0,
            width,
            height: rowPosition[row].height,
        };

        return {
            ...computeBounds(bounds, rowPosition[row]),
            zIndex : column,
        }
    }

    // const getDelay = (position: number) => {
    const getDelay = (row: number, column: number) => {
        const isRowOdd = (row % 2) === 1;

        if (!isRowOdd) {
            return (row * 8) + column;
        }

        return (row * 8) + (7 - column);
    }

    const charactersPerRow = characters.reduce<CharacterProps[][]>((previous, current, index) => {
        const row = Math.floor(index / 8);

        previous[row] = previous[row] || [];

        previous[row].push(current);

        return previous;
    }, []);

    return (
        <div className="plateau">
            <img src="../../../assets/plateau-front.webp" alt="Plateau" />

            { charactersPerRow.map((row, rowIndex) =>
                <div className="plateau--row" key={ rowIndex } style={{ ...computeBounds(rowPosition[rowIndex], imageSize), zIndex: 500 + (rowIndex * 100) }}>
                    { row.map((character, index) =>
                        <Character
                            key={ index }
                            animate={ true }
                            animateDelay={ getDelay(rowIndex, index) }
                            character={ character }
                            position={ getPosition(rowIndex, index) }
                            onClick={ onClick }
                        />
                    )}
                </div>
            )}
        </div>
    );
};
