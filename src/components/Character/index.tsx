import React from "react";

import "./style.css";

export interface CharacterProps {
    name  : string,
    image : string,
}

export const Character = ({
    character,
    hide,
    onClick,
}: {
    character : CharacterProps,
    hide     ?: boolean,
    onClick  ?: (character: CharacterProps) => void,
}) => {
    const { name } = character;

    const className = ["character"];

    if (hide) {
        className.push("character_hide");
    }

    return (
        <div className={ className.join(" ") } onClick={ () => onClick && onClick(character) }>
            <div className="character--box">
                <div className="character--name">{ name }</div>
            </div>

            <img src={ character.image } alt={ name } className="character--image" />
        </div>
    );
}
