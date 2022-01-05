import React from "react";

import "./style.css";

export const Player = ({
    name,
    inline,
    photoURL,
}: {
    name      : string,
    inline   ?: boolean,
    photoURL  : string,
}) => {
    const className = ["player"];

    if (inline) {
        className.push("player--inline");
    }

    return (
        <div className={ className.join(" ") }>
            <img className="player--img" src={ photoURL } alt={ name } />

            <span className="player--name">{ name }</span>
        </div>
    );
}
