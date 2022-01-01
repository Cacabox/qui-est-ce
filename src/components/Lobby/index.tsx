import React, { useEffect, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import { useTranslation } from "react-i18next";

import { Categories } from "@components/Categories";

import { getCategoriesBanned } from "@helpers/categories";
import { getAllCharacters, getCharacterSecretForUser, getCharactersForUser } from "@helpers/character";
import { analyticsClient, getDatabasePath } from "@helpers/client";
import { getMe, getOpponent, getPlayers, getPlayersOnline } from "@helpers/players";
import { getRoomId } from "@helpers/room";
import { getRoundState } from "@helpers/round";
import { getSettings } from "@helpers/settings";
import { getHashParams } from "@helpers/utils";

import "./style.css";

export const Lobby = () => {
    const path = useRecoilValue(getDatabasePath);

    const categoriesBanned = useRecoilValue(getCategoriesBanned(path.room));
    const characters       = useRecoilValue(getAllCharacters);
    const me               = useRecoilValue(getMe);
    const opponent         = useRecoilValue(getOpponent);
    const players          = useRecoilValue(getPlayers);
    const playersOnline    = useRecoilValue(getPlayersOnline);
    const roomId           = useRecoilValue(getRoomId);

    const [roomLinkClicked, setRoomLinkClicked] = useState(false);

    const setMyCharacters            = useSetRecoilState(getCharactersForUser(path.me));
    const setMyCharacterSecret       = useSetRecoilState(getCharacterSecretForUser(path.me));
    const setOpponentCharacters      = useSetRecoilState(getCharactersForUser(path.opponent));
    const setOpponentCharacterSecret = useSetRecoilState(getCharacterSecretForUser(path.opponent));
    const setRoundState              = useSetRecoilState(getRoundState(path.room));
    const setHashParams              = useSetRecoilState(getHashParams);

    const [settings, setSettings] = useRecoilState(getSettings);

    const refreshRoomId = useRecoilRefresher_UNSTABLE(getRoomId);

    const { t } = useTranslation();

    const copyLinkRoom = () => {
        setRoomLinkClicked(true);

        window.navigator.clipboard.writeText(`${ window.location.origin }${ window.location.pathname }#room=${ roomId }`);
    }

    const getRoomIdMasked = () => {
        const tmp = roomId.split("");

        return tmp.map((char, index) => index < tmp.length - 3 ? "⁕" : char);
    }

    const newRoom = () => {
        setSettings({
            ...settings,
            lastRoom: undefined,
        });

        setHashParams(new Map());

        refreshRoomId();

        logEvent(analyticsClient, "newRoom", { players });
    }

    const startRound = async() => {
        const numberOfCharacters = 8 * 3;

        setMyCharacterSecret(undefined);
        setOpponentCharacterSecret(undefined);

        const allowedCharacters = shuffle(characters.filter(character => {
            for (let categorie of character.categories) {
                if (categoriesBanned.includes(categorie)) {
                    return false;
                }
            }

            return true;
        }));

        const myCharacters       = allowedCharacters.slice(0, Math.min(numberOfCharacters, allowedCharacters.length / 2));
        const opponentCharacters = allowedCharacters.slice(myCharacters.length, myCharacters.length + numberOfCharacters);

        setMyCharacters(myCharacters);
        setOpponentCharacters(opponentCharacters);

        setRoundState("running");

        logEvent(analyticsClient, "startRound", { players, categoriesBanned });
    }

    useEffect(() => {
        if (roomLinkClicked) {
            setTimeout(() => {
                setRoomLinkClicked(false);
            }, 2000);
        }
    }, [roomLinkClicked]);

    if (playersOnline.length < 2) {
        return (
            <div className="lobby">
                <div className="lobby--room-id">
                    <div>
                        { t("lobby.room") } <span className="lobby--room-id__value">{ getRoomIdMasked() }</span>
                    </div>

                    <button className="lobby--new-room" onClick={ newRoom }>{ t("lobby.new-room") }</button>
                </div>

                { t("lobby.waiting") }

                <button className="lobby--link" onClick={ copyLinkRoom }>{ roomLinkClicked ? t("lobby.link-clicked") : t("lobby.link") }</button>
            </div>
        );
    }

    return (
        <div className="lobby">
            <div className="lobby--room-id">
                <div>
                    { t("lobby.room") } <span className="lobby--room-id__value">{ getRoomIdMasked() }</span>
                </div>

                <button className="lobby--new-room" onClick={ newRoom }>{ t("lobby.new-room") }</button>
            </div>

            { me && opponent &&
                <div className="lobby--versus">
                    <div className="lobby--versus__me">
                        <img src={ me.photoURL } alt={ me.name } />

                        <span>{ me.name }</span>
                    </div>

                    <div>vs</div>

                    <div className="lobby--versus__opponent">
                        <img src={ opponent.photoURL } alt={ opponent.name } />

                        <span>{ opponent.name }</span>
                    </div>
                </div>
            }

            <button className="lobby--start" onClick={ startRound }>{ t("lobby.start") }</button>

            { playersOnline.length > 2 &&
                <div className="lobby--toomanyplayers">{ t("lobby.too-many-players") }</div>
            }

            <Categories />
        </div>
    );
}

// From : https://github.com/d3/d3-array/blob/main/src/shuffle.js
function shuffle(array: any[], i0 = 0, i1 = array.length) {
    let m = i1 - (i0 = +i0);

    while (m) {
        const i = Math.random() * m-- | 0, t = array[m + i0];
        array[m + i0] = array[i + i0];
        array[i + i0] = t;
    }

    return array;
}
