import { atomFamily } from "recoil";
import { getDatabase, onValue, ref, remove, update } from "firebase/database";

import { Player } from "@helpers/players";

export type RoundState = "not-started" | "running" | "finished";

export const getRoundStateForRoom = atomFamily<RoundState, string>({
    key              : "getRoundStateForRoom",
    default          : "not-started",
    effects_UNSTABLE : room => [
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
    key              : "isRoomSameBoardForRoom",
    default          : false,
    effects_UNSTABLE : room => [
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
    default : undefined,
    effects_UNSTABLE : room => [
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
