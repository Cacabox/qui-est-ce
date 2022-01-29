import React from "react";
import { Translation } from "react-i18next";

const config = require(`../../../${ process.env.CONFIG_FILE }`);

import "./style.css";

export const ErrorBoundary = () => {
    const reset = () => {
        window.localStorage.removeItem(config.token.key);

        window.location.reload();
    }

    return (
        <div className="error">
            <Translation>{ t => (
                <>
                    <div>{ t("error-boundary.error") }</div>

                    <button onClick={ reset }>{ t("error-boundary.reset") }</button>
                </>
            )}</Translation>
        </div>
    )
}
