import React from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { CLIENTID } from "@helpers/api";
import { getRoomId } from "@helpers/room";

import "./style.css";

export const Login = () => {
    const roomId = useRecoilValue(getRoomId);

    const { t } = useTranslation();

    const getTwitchToken = () => {
        window.location.assign(`https://id.twitch.tv/oauth2/authorize?client_id=${ CLIENTID }&redirect_uri=${ encodeURIComponent(returnURL()) }&response_type=token`);
    }

    const returnURL = () => {
        return `${ window.location.origin }${ window.location.pathname }#room=${ roomId }`;
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
