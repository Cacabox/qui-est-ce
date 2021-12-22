import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import type { CharacterProps } from "@components/Character";

import { getChannel } from "@helpers/client";
import { getPlayers, PlayerProps } from "@helpers/players";
import { getSettings } from "@helpers/settings";
import { getRoundCharactersOpponent, getRoundCharacterGuessed, RoundState, roundStateAtom } from "@helpers/round";

export const enum ClientEvent {
    characters = "characters",
    guess      = "guess",
    state      = "state",
}

export const Client = () => {
    const channel  = useRecoilValue(getChannel);
    const settings = useRecoilValue(getSettings)

    const setPlayers = useSetRecoilState(getPlayers);

    const setRoundCharacterGuessed   = useSetRecoilState(getRoundCharacterGuessed);
    const setRoundCharactersOpponent = useSetRecoilState(getRoundCharactersOpponent);
    const setRoundState              = useSetRecoilState(roundStateAtom);

    // Login | Logout
    useEffect(() => {
        (async() => {
            let players: PlayerProps[] = [];

            const presence = channel.presence;

            const clients = await presence.get();

            clients.map((client) => {
                players.push({
                    name      : client.clientId,
                    timestamp : client.timestamp,
                });
            });

                    console.log(players);
            setPlayers(players);

            presence.subscribe("enter", (client) => {
                if (!players.find((player) => player.name === client.clientId)) {
                    players = [
                        ...players,
                        {
                            name      : client.clientId,
                            timestamp : client.timestamp,
                        }
                    ];

                    console.log(players);
                    setPlayers(players);
                }
            });

            presence.subscribe("leave", (client) => {
                players = players.filter(player => player.name !== client.clientId);

                    console.log(players);
                setPlayers(players);
            });

            await presence.enter();
        })();
    }, [channel]);

    // roundState
    useEffect(() => {
        const listener = ({ data: roundState }: { data: RoundState }) => {
            setRoundState(roundState);
        }

        channel.subscribe(ClientEvent.state, listener);

        return () => channel.unsubscribe(ClientEvent.state, listener);
    }, [channel]);

    // roundCharacters
    useEffect(() => {
        const listener = ({ data, clientId }: { data: CharacterProps[], clientId: string }) => {
            if (clientId !== settings.clientId) {
                setRoundCharactersOpponent(data);
            }
        }

        channel.subscribe(ClientEvent.characters, listener);

        return () => channel.unsubscribe(ClientEvent.characters, listener);
    }, [channel]);

    // guess
    useEffect(() => {
        const listener = ({ data: guess, clientId }: { data: CharacterProps, clientId: string }) => {
            if (clientId !== settings.clientId) {
                setRoundCharacterGuessed(guess);
            }
        }

        channel.subscribe(ClientEvent.guess, listener);

        return () => channel.unsubscribe(ClientEvent.guess, listener);
    }, [channel]);

    return null;
}
