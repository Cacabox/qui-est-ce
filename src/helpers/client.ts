import { selector } from "recoil";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getRoomId } from "@helpers/room";
import { getOpponent } from "@helpers/players";
import { getCurrentUser } from "@helpers/user";

const config = require(`../../${ process.env.CONFIG_FILE }`);

export const apolloClient = new ApolloClient({
    uri   : config.apollo.url,
    cache : new InMemoryCache(),
});

export const firebaseClient = initializeApp(config.firebase);

export const analyticsClient = getAnalytics(firebaseClient);

export interface Path {
    me        : string,
    opponent ?: string,
    room      : string,
    users     : string,
}

export const getDatabasePath = selector<Path>({
    key: "getDatabasePath",
    get: ({ get }) => {
        const roomId   = get(getRoomId);
        const me       = get(getCurrentUser);
        const opponent = get(getOpponent);

        const paths: Path = {
            room  : `rooms/${ roomId }`,
            users : `rooms/${ roomId }/users`,
            me    : `rooms/${ roomId }/users/${ me.uid }`,
        }

        if (opponent) {
            paths.opponent = `rooms/${ roomId }/users/${ opponent.id }`;
        }

        return paths;
    },
});
