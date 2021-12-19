import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { CharacterProps } from "@components/Character";

import { getChannel, getChannelId } from "@helpers/client";
import { getPlayers } from "@helpers/players";
import { getRoundPossibleCharacters, getRoundOpponentCharacters, publishRoundCharacters, publishRoundState, RoundState, roundStateAtom } from "@helpers/round";
import { getSettings } from "@helpers/settings";

import "./style.css";

export const Lobby = () => {
    const channel   = useRecoilValue(getChannel);
    const channelId = useRecoilValue(getChannelId);
    const settings  = useRecoilValue(getSettings);

    const players = useRecoilValue(getPlayers);

    const roundPossibleCharacters = useRecoilValue(getRoundPossibleCharacters);

    const [roundCharacters, setPublishRoundCharacters] = useRecoilState(publishRoundCharacters);

    const setPublishRoundState       = useSetRecoilState(publishRoundState);
    const setRoundOpponentCharacters = useSetRecoilState(getRoundOpponentCharacters);
    const setRoundState              = useSetRecoilState(roundStateAtom);

    const [roomLinkClicked, setRoomLinkClicked] = useState(false);

    const generateCharacters = () => shuffle([ ...roundPossibleCharacters ]).slice(0, 8 * 3);

    const startRound = () => {
        setPublishRoundCharacters(generateCharacters());
    }

    const copyLinkRoom = () => {
        setRoomLinkClicked(true);

        window.navigator.clipboard.writeText(`${ window.origin }/?channel=${ channelId }`);
    }

    const { t } = useTranslation();

    useEffect(() => {
        channel.subscribe("roundState", ({ data: roundState }: { data: RoundState }) => {
            setRoundState(roundState);
        });
    }, [channel]);

    useEffect(() => {
        const listener = ({ data, clientId }: { data: CharacterProps[], clientId: string }) => {
            if (clientId !== settings.clientId) {
                setRoundOpponentCharacters(data);

                if (roundCharacters.length === 0) {
                    setPublishRoundCharacters(generateCharacters());

                    setPublishRoundState("choose-character");
                }
            }
        };

        channel.subscribe("roundCharacters", listener);

        return () => channel.unsubscribe("roundCharacters", listener);
    }, [channel, roundCharacters]);

    useEffect(() => {
        if (roomLinkClicked) {
            setTimeout(() => {
                setRoomLinkClicked(false);
            }, 2000);
        }
    }, [roomLinkClicked]);

    if (players.length < 2) {
        return (
            <div className="lobby">
                { t("lobby.waiting") }

                <button className="lobby--link" onClick={ () => copyLinkRoom() }>{ roomLinkClicked ? t("lobby.link-clicked") : t("lobby.link") }</button>
            </div>
        );
    }

    return (
        <div className="lobby">
            <button className="lobby--start" onClick={ () => startRound() }>{ t("lobby.start") }</button>

            { players.length > 2 &&
                <div className="lobby--toomanyplayers">{ t("lobby.toomanyplayers") }</div>
            }
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
