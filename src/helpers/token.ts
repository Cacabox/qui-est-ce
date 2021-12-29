import { selector } from "recoil";

import { getHashParams } from "@helpers/utils";

const TWITCH_TOKEN_KEY = "twitch-token";

export const getTwitchToken = selector<string>({
    key: "getTwitchToken",
    get: ({ get }) => {
        const hashMap = get(getHashParams);

        const tokenHash  = hashMap.get("access_token");
        const tokenLocal = window.localStorage.getItem(TWITCH_TOKEN_KEY);

        if (tokenHash) {
            if (tokenHash !== tokenLocal) {
                window.localStorage.setItem(TWITCH_TOKEN_KEY, tokenHash);
            }

            return tokenHash;
        }

        if (tokenLocal != null) {
            return tokenLocal;
        }

        return "";
    },
    set: ({}, newValue) => {
        if (typeof newValue !== "string") {
            window.localStorage.removeItem(TWITCH_TOKEN_KEY);

            return;
        }

        window.localStorage.setItem(TWITCH_TOKEN_KEY, newValue);
    }
});

export const getFirebaseToken = selector<string>({
    key: "getFirebaseToken",
    get: async({ get }) => {
        const twitchToken = get(getTwitchToken);

        const url = new URL("https://europe-west1-qui-est-ce-3621d.cloudfunctions.net/generateToken");

        url.searchParams.append("twitch", twitchToken);

        const request = await fetch(url.toString());

        if (request.status < 200 || request.status > 299) {
            throw new Error();
        }

        return request.text();
    }
});
