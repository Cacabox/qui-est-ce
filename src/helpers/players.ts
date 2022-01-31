import { atomFamily, selector } from "recoil";
import { getDatabase, onValue, ref } from "firebase/database";

import { getInDb } from "@helpers/client";
import { getCurrentUser } from "@helpers/user";
import { getRoomPath } from "@helpers/room";

export type Player = {
    id       : string;
    name     : string;
    photoURL : string;
    online   : boolean;
}

export const getPlayersForRoom = atomFamily<Player[], string>({
    key     : "getPlayers",
    default : room => {
        const db = getDatabase();

        const roomUsersDoc = ref(db, `${ room }/users`);

        return getInDb(roomUsersDoc).then((data) => {
            if (!data) {
                return [];
            }

            return Promise.all(Object.keys(data).map(async(id) => {
                const userRef = ref(db, `users/${ id }`);

                return getInDb(userRef);
            }));
        });
    },
    effects_UNSTABLE: room => [
        ({ setSelf }) => {
            const db = getDatabase();

            const roomUsersDoc = ref(db, `${ room }/users`);

            let players = new Map<string, Player>();

            const unsubscribe = onValue(roomUsersDoc, (doc) => {
                const data = doc.val();

                if (!data) {
                    return;
                }

                const map = new Map<string, boolean>(Object.entries(data));

                map.forEach(async(online, id) => {
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

                    const user: Player = await getInDb(userRef);

                    players.set(id, user);

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
