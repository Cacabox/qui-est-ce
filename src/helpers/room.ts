import { selector } from "recoil";

import { getSettings } from "@helpers/settings";
import { getHashParams } from "@helpers/utils";

export const getRoomId = selector<string>({
    key: "getRoomId",
    get: ({ get }) => {
        const hashMap  = get(getHashParams);
        const settings = get(getSettings);

        const roomHash = hashMap.get("room");

        if (roomHash) {
            return roomHash;
        }

        if (settings.lastRoom) {
            return settings.lastRoom;
        }

        return crypto.getRandomValues(new Uint32Array(2)).join("");
    },
});

export const getRoomPath = selector<string>({
    key: "getRoomPath",
    get: ({ get }) => `rooms/${ get(getRoomId) }`
});
