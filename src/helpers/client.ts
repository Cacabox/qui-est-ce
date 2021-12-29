import { selector } from "recoil";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { initializeApp } from "firebase/app";

import { getRoomId } from "@helpers/room";
import { getOpponent } from "@helpers/players";
import { getCurrentUser } from "@helpers/user";

export const apolloClient = new ApolloClient({
    uri   : "https://api-eu-central-1.graphcms.com/v2/ckx8muqxk0nxy01z0amvy5bqo/master",
    cache : new InMemoryCache(),
});

export const firebaseClient = initializeApp({
    apiKey    : "AIzaSyA8_Ap7wETmcIjgZncUn-3mPgmSGpGMiFQ",
    appId       : "1:465604282379:web:d723f1bd0ceba84b23df0e",
    projectId   : "qui-est-ce-3621d",
    databaseURL : "https://qui-est-ce-3621d-default-rtdb.europe-west1.firebasedatabase.app/",
});

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
