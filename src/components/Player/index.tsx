import React from "react";

import "./style.css";

export const Player = ({
    name,
    photoURL,
}: {
    name     : string,
    photoURL : string,
}) => {
    return (
        <div className="player">
            <img className="player--img" src={ photoURL } alt={ name } />

            <span className="player--name">{ name }</span>
        </div>
    );
}
