import { atomFamily } from "recoil";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { firestoreClient } from "@helpers/client";

export type RoundState = "not-started" | "running" | "finished";

export const getRoundState = atomFamily<RoundState, string>({
    key              : "getRoundState",
    default          : "not-started",
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            const roomDoc = doc(firestoreClient, path);

            onSet((newValue) => {
                setDoc(roomDoc, {
                    roundState: newValue,
                }, { merge: true });
            });

            const unsubscribe = onSnapshot(roomDoc, (doc) => {
                const data = doc.data();

                if(data?.roundState) {
                    setSelf(data.roundState);
                } else {
                    setSelf("not-started");
                }
            });

            return () => unsubscribe();
        },
    ]
});
