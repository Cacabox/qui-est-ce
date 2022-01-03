import { atomFamily, selector } from "recoil";
import { get as getInDb, getDatabase, onValue, ref } from "firebase/database";

import { getCurrentUser } from "@helpers/user";
import { getRoomPath } from "@helpers/room";

export type Player = {
    id       : string;
    name     : string;
    photoURL : string;
    online   : boolean;
}

export const getPlayersForRoom = atomFamily<Player[], string>({
    key              : "getPlayers",
    default          : [],
    effects_UNSTABLE : room => [
        ({ setSelf }) => {
            const db = getDatabase();

            const roomUsersDoc = ref(db, `${ room }/users`);

            let players = new Map<string, Player>();

            const unsubscribe = onValue(roomUsersDoc, (doc) => {
                const data = new Map<string, boolean>(Object.entries(doc.val()));

                data.forEach(async(online, id) => {
                    const player = players.get(id);

                    if (player) {
                        const updatedPlayer = {
                            ...player,
                            online,
                        }

                        players.set(id, updatedPlayer);

                        setSelf([...players.values()]);

                        return;
                    }

                    const userRef = ref(db, `users/${ id }`);

                    const user = await getInDb(userRef);

                    players.set(id, user.val() as Player);

                    setSelf([...players.values()]);
                });
            });

            return () => unsubscribe();
        },
    ]
});

export const getPlayersOnline = selector<Player[]>({
    key: "getPlayersOnline",
    get: ({ get }) => get(getPlayersForRoom(get(getRoomPath))).filter(_ => _.online),
});

export const getMe = selector<Player | undefined>({
    key: "getMe",
    get: ({ get }) => {
        const players = get(getPlayersForRoom(get(getRoomPath)));

        return players.find(_ => _.id === get(getCurrentUser).uid);
    },
});

export const getOpponent = selector<Player | undefined>({
    key: "getOpponent",
    get: ({ get }) => {
        const players = get(getPlayersForRoom(get(getRoomPath)));

        return players.find(_ => _.id !== get(getCurrentUser).uid);
    },
});
