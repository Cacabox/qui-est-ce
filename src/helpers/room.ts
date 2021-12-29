import { selector } from "recoil";

import { getHashParams } from "@helpers/utils";

export const getRoomId = selector<string>({
    key: "getRoomId",
    get: ({ get }) => {
        const hashMap = get(getHashParams);

        const roomHash = hashMap.get("room");

        if (roomHash) {
            return roomHash;
        }

        return crypto.getRandomValues(new Uint32Array(2)).join("");
    },
});
