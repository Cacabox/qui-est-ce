import { selector } from "recoil";

import { getHashParams } from "@helpers/utils";

const config = require(`../../${ process.env.CONFIG_FILE }`);

export const getTwitchToken = selector<string>({
    key: "getTwitchToken",
    get: ({ get }) => {
        const hashMap = get(getHashParams);

        const tokenHash  = hashMap.get("access_token");
        const tokenLocal = window.localStorage.getItem(config.token.key);

        if (tokenHash) {
            if (tokenHash !== tokenLocal) {
                window.localStorage.setItem(config.token.key, tokenHash);
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
            window.localStorage.removeItem(config.token.key);

            return;
        }

        window.localStorage.setItem(config.token.key, newValue);
    }
});

export const getFirebaseToken = selector<string>({
    key: "getFirebaseToken",
    get: async({ get }) => {
        const twitchToken = get(getTwitchToken);

        const url = new URL(config.token.url);

        url.searchParams.append("twitch", twitchToken);

        const request = await fetch(url.toString());

        if (request.status < 200 || request.status > 299) {
            throw new Error("Unable to getFirebaseToken");
        }

        return request.text();
    }
});
