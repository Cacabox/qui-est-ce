import { atom } from "recoil";
import { getDatabase, onValue, ref, remove, update } from "firebase/database";

import { getRoomPath } from "@helpers/room";
import { Player } from "@helpers/players";

export type RoundState = "not-started" | "running" | "finished";

export const getRoundState = atom<RoundState>({
    key              : "getRoundState",
    default          : "not-started",
    effects_UNSTABLE : [
        ({ setSelf, onSet, getLoadable }) => {
            const db = getDatabase();

            const room = getLoadable(getRoomPath).contents;

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

export const isRoomSameBoard = atom<boolean>({
    key              : "isRoomSameBoard",
    default          : false,
    effects_UNSTABLE : [
        ({ setSelf, onSet, getLoadable }) => {
            const db = getDatabase();

            const room = getLoadable(getRoomPath).contents;

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

export const getRoomWinner = atom<Player | undefined>({
    key     : "isRoomWinner",
    default : undefined,
    effects_UNSTABLE : [
        ({ setSelf, onSet, getLoadable }) => {
            const db = getDatabase();

            const room = getLoadable(getRoomPath).contents;

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
