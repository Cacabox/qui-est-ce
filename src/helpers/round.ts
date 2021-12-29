import { atomFamily } from "recoil";
import { getDatabase, onValue, ref, update } from "firebase/database";

export type RoundState = "not-started" | "running" | "finished";

export const getRoundState = atomFamily<RoundState, string>({
    key              : "getRoundState",
    default          : "not-started",
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const roomDoc = ref(db, path);

            onSet((newValue) => {
                update(roomDoc, {
                    roundState: newValue,
                });
            });

            const unsubscribe = onValue(roomDoc, (doc) => {
                const data = doc.val();

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
