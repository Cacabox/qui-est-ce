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

export const getChannel = selector({
    key: "getChannel",
    get: ({ get }) => {
        const client = get(getAblyClient);

        return client.channels.get("qui-est-ce");
    },
    dangerouslyAllowMutability: true,
});
