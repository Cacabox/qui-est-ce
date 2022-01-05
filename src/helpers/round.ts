import { atomFamily } from "recoil";
import { get as getInDb, getDatabase, onValue, ref, remove, update } from "firebase/database";

import { Player } from "@helpers/players";

export type RoundState = "not-started" | "running" | "finished";

export const getRoundStateForRoom = atomFamily<RoundState, string>({
    key     : "getRoundStateForRoom",
    default : room => {
        const db = getDatabase();

        const doc = ref(db, `${ room }/roundState`);

        return getInDb(doc).then(data => data.val() || "not-started");
    },
    effects_UNSTABLE: room => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const parentDoc = ref(db, room);
            const childDoc  = ref(db, `${ room }/roundState`);

            onSet((newValue) => {
                update(parentDoc, {
                    roundState: newValue,
                });
            });

            const unsubscribe = onValue(childDoc, data => setSelf(data.val() || "not-started"));

            return () => unsubscribe();
        },
    ]
});

export const isRoomSameBoardForRoom = atomFamily<boolean, string>({
    key     : "isRoomSameBoardForRoom",
    default : room => {
        const db = getDatabase();

        const doc = ref(db, `${ room }/sameBoard`);

        return getInDb(doc).then(data => data.val() || false);
    },
    effects_UNSTABLE: room => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const parentDoc = ref(db, room);
            const childDoc  = ref(db, `${ room }/sameBoard`);

            onSet((newValue) => {
                update(parentDoc, {
                    sameBoard: newValue,
                });
            });

            const unsubscribe = onValue(childDoc, data => setSelf(data.val() || false));

            return () => unsubscribe();
        },
    ]
});

export const getRoomWinnerForRoom = atomFamily<Player | undefined, string>({
    key     : "isRoomWinner",
    default : room => {
        const db = getDatabase();

        const doc = ref(db, `${ room }/roomWinner`);

        return getInDb(doc).then(data => data.val() || undefined);
    },
    effects_UNSTABLE: room => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const parentDoc = ref(db, room);
            const childDoc  = ref(db, `${ room }/roomWinner`);

            onSet((newValue) => {
                if (newValue == undefined) {
                    remove(childDoc);
                } else {
                    update(parentDoc, { roomWinner: newValue });
                }
            });

            const unsubscribe = onValue(childDoc, data => setSelf(data.val() || undefined));

            return () => unsubscribe();
        },
    ]
});
