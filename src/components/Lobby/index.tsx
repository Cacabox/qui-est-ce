import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { CharacterProps } from "@components/Character";

import { getChannel } from "@helpers/client";
import { getPlayers } from "@helpers/players";
import { getRoundPossibleCharacters, getRoundOpponentCharacters, publishRoundCharacters, publishRoundState, RoundState, roundStateAtom } from "@helpers/round";
import { getSettings } from "@helpers/settings";

import "./style.css";

export const Lobby = () => {
    const channel  = useRecoilValue(getChannel);
    const settings = useRecoilValue(getSettings);

    const players = useRecoilValue(getPlayers);

    const roundPossibleCharacters = useRecoilValue(getRoundPossibleCharacters);

    const [roundCharacters, setPublishRoundCharacters] = useRecoilState(publishRoundCharacters);

    const setPublishRoundState       = useSetRecoilState(publishRoundState);
    const setRoundOpponentCharacters = useSetRecoilState(getRoundOpponentCharacters);
    const setRoundState              = useSetRecoilState(roundStateAtom);

    const generateCharacters = () => shuffle([ ...roundPossibleCharacters ]).slice(0, 8 * 3);

    const startRound = () => {
        setPublishRoundCharacters(generateCharacters());
    }

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
                } else {
                    setPublishRoundState("running");
                }
            }
        };

        channel.subscribe("roundCharacters", listener);

        return () => channel.unsubscribe("roundCharacters", listener);
    }, [channel, roundCharacters]);

    if (players.length < 2) {
        return (
            <div className="lobby">
                En attente de l'adversaire
            </div>
        );
    }

    return (
        <div className="lobby">
            <button onClick={ () => startRound() }>Commencer une partie</button>
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
