import { selector } from "recoil";
import Ably from "ably/promises";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { getSettings } from "@helpers/settings";

const getAblyClient = selector({
    key: "getAblyClient",
    get: ({ get }) => {
        const { clientId } = get(getSettings);

        return new Ably.Realtime.Promise({
            key: "eUPftg.U_9ung:j71TqC9cL_j3Z9zvhIpvXnQ98-PKooUYJ8lYO5syYzI",
            clientId,
        });
    },
    dangerouslyAllowMutability: true,
});

export const getApolloClient = selector({
    key: "getApolloClient",
    get: () => {
        return new ApolloClient({
            uri   : "https://api-eu-central-1.graphcms.com/v2/ckx8muqxk0nxy01z0amvy5bqo/master",
            cache : new InMemoryCache()
        });
    },
    dangerouslyAllowMutability: true,
});

export const getChannelId = selector<string>({
    key: "getChannelId",
    get: () => {
        const channel = getQueryParams()?.channel || crypto.getRandomValues(new Uint32Array(1))[0].toString();

        console.log(channel);

        return channel;
    },
});

export const getChannel = selector({
    key: "getChannel",
    get: ({ get }) => {
        const channelId = get(getChannelId);
        const client    = get(getAblyClient);

        return client.channels.get("qui-est-ce-" + channelId);
    },
    dangerouslyAllowMutability: true,
});

const getQueryParams = (): { channel: string } | undefined => {
    if (!window.location.search.length) {
        return;
    }

    const search = window.location.search.slice(1);

    return search.split("&").reduce((previous: any, current) => {
        const key = current.split("=")[0];
        const value = current.split("=")[1];

        previous[key] = value;

        return previous;
    }, {});
}
