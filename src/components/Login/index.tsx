import React from "react";
import { useTranslation } from "react-i18next";

import "./style.css";

const config = require(`../../../${ process.env.CONFIG_FILE }`);

export const Login = () => {
    const { t } = useTranslation();

    const getTwitchToken = () => {
        window.location.assign(`https://id.twitch.tv/oauth2/authorize?client_id=${ config.twitch.clientId }&redirect_uri=${ encodeURIComponent(window.location.origin + window.location.pathname) }&response_type=token`);
    }

    return (
        <div className="login">
            <div className="login--container">
                <div className="login--container__title"><img className="login--container__logo" src="./assets/TwitchGlitchPurple.svg" />{ t("login.title") }</div>

                <button onClick={ getTwitchToken }>{ t("login.action") }</button><br/>
            </div>
        </div>
    )
}
