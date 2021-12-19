import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getChannel } from "@helpers/client";
import { getPlayers, PlayerProps } from "@helpers/players";

export const Client = () => {
    const channel = useRecoilValue(getChannel);

    const setPlayers = useSetRecoilState(getPlayers);

    let players: PlayerProps[] = [];

    useEffect(() => {
        (async() => {
            const presence = channel.presence;

            const clients = await presence.get();

            clients.map((client) => {
                players.push({
                    name      : client.clientId,
                    timestamp : client.timestamp,
                });
            });

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

                    setPlayers(players);
                }
            });

            presence.subscribe("leave", (client) => {
                players = players.filter(player => player.name !== client.clientId);

                setPlayers(players);
            });

            await presence.enter();
        })();
    }, [channel]);

    return null;
}
