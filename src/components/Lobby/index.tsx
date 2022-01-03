import React, { useEffect, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { logEvent } from "firebase/analytics";
import { useTranslation } from "react-i18next";

import { Categories } from "@components/Categories";
import { Player } from "@components/Player";

import { getCategoriesBanned } from "@helpers/categories";
import { getAllCharacters, getCharacterGuessForPlayer, getCharacterSecretForPlayer, getCharactersForPlayer } from "@helpers/character";
import { analyticsClient } from "@helpers/client";
import { getMe, getOpponent, getPlayersForRoom, getPlayersOnline } from "@helpers/players";
import { getRoomId, getRoomPath } from "@helpers/room";
import { getRoomWinner, getRoundState, isRoomSameBoard } from "@helpers/round";
import { getSettings } from "@helpers/settings";
import { getHashParams } from "@helpers/utils";

import "./style.css";

export const Lobby = () => {
    const room = useRecoilValue(getRoomPath);

    const categoriesBanned = useRecoilValue(getCategoriesBanned);
    const characters       = useRecoilValue(getAllCharacters);
    const me               = useRecoilValue(getMe);
    const opponent         = useRecoilValue(getOpponent);
    const players          = useRecoilValue(getPlayersForRoom(room));
    const playersOnline    = useRecoilValue(getPlayersOnline);
    const roomId           = useRecoilValue(getRoomId);

    const [roomLinkClicked, setRoomLinkClicked] = useState(false);

    const setMyCharacters            = useSetRecoilState(getCharactersForPlayer(me));
    const setMyCharacterGuess        = useSetRecoilState(getCharacterGuessForPlayer(me));
    const setMyCharacterSecret       = useSetRecoilState(getCharacterSecretForPlayer(me));
    const setOpponentCharacters      = useSetRecoilState(getCharactersForPlayer(opponent));
    const setOpponentCharacterGuess  = useSetRecoilState(getCharacterGuessForPlayer(opponent));
    const setOpponentCharacterSecret = useSetRecoilState(getCharacterSecretForPlayer(opponent));
    const setWinner                  = useSetRecoilState(getRoomWinner);
    const setRoundState              = useSetRecoilState(getRoundState);
    const setHashParams              = useSetRecoilState(getHashParams);


    const [settings, setSettings]     = useRecoilState(getSettings);
    const [isSameBoard, setSameBoard] = useRecoilState(isRoomSameBoard);

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
        setMyCharacterGuess(undefined);
        setOpponentCharacterSecret(undefined);
        setOpponentCharacterGuess(undefined);
        setWinner(undefined);

        const allowedCharacters = shuffle(characters.filter(character => {
            for (let categorie of character.categories) {
                if (categoriesBanned.includes(categorie)) {
                    return false;
                }
            }

            return true;
        }));

        const maxLength = isSameBoard ? allowedCharacters.length : allowedCharacters.length / 2;

        const myCharacters       = allowedCharacters.slice(0, Math.min(numberOfCharacters, maxLength));
        const opponentCharacters = isSameBoard ? myCharacters : allowedCharacters.slice(myCharacters.length, myCharacters.length + numberOfCharacters);

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

            { playersOnline.length === 2 && me && opponent &&
                <div className="lobby--info lobby--versus">
                    <div className="lobby--versus__me">
                        <Player { ...me } />
                    </div>

                    <div>vs</div>

                    <div className="lobby--versus__opponent">
                        <Player { ...opponent } />
                    </div>
                </div>
            }

            { playersOnline.length > 2 &&
                <div className="lobby--info lobby--toomanyplayers">
                    { t("lobby.too-many-players") }

                    <div className="lobby--toomanyplayers__list">
                        { players.map((player) => <Player key={ player.id } { ...player } />) }
                    </div>
                </div>
            }

            <button className="lobby--start" onClick={ startRound }>{ t("lobby.start") }</button>

            <div className="lobby--same-board">
                <label htmlFor="same-board">{ t("lobby.use-same-board") }</label>
                <input type="checkbox" id="same-board" checked={ isSameBoard } onChange={ () => setSameBoard(!isSameBoard) } />
            </div>

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
