import React from "react";

import "./style.css";

export const Logo = ({
    top,
}: {
    top ?: boolean,
}) => {
    const classList = ["logo", "logo--scale"];

    if (top) {
        classList.push("logo--top");
    }

    return (
        <div className={ classList.join(" ") }>
            <img src="assets/logo-ccb.webp" alt="Cacabox" className="logo--rotate" />
        </div>
    )
}
