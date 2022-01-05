import { atomFamily, selector } from "recoil";
import { get as getInDb, getDatabase, onValue, ref, update } from "firebase/database";

import { getAllCharacters } from "@helpers/character";

interface Categorie {
    name  : string,
    count : number,
}

export const getCategories = selector<Categorie[]>({
    key: "getCategories",
    get: ({ get }) => {
        const characters = get(getAllCharacters);

        return characters.reduce<Categorie[]>((previous, current) => {
            current.categories.map((categorie) => {
                const found = previous.find(_ => _.name === categorie);

                if (!found) {
                    previous.push({ name: categorie, count: 1 });
                } else {
                    found.count++;
                }
            });

            return previous;
        }, []).sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
    },
});

export const getCategoriesBannedForRoom = atomFamily<string[], string>({
    key     : "getCategoriesBannedForRoom",
    default : room => {
        const db = getDatabase();

        const roomCategoriesDoc = ref(db, `${ room }/categoriesBanned`);

        return getInDb(roomCategoriesDoc).then(data => data.val() || []);
    },
    effects_UNSTABLE: room => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const roomDoc           = ref(db, room);
            const roomCategoriesDoc = ref(db, `${ room }/categoriesBanned`);

            onSet((newValue) => {
                update(roomDoc, { categoriesBanned: newValue });
            });

            const unsubscribe = onValue(roomCategoriesDoc, data => setSelf(data.val() || []));

            return () => unsubscribe();
        },
    ]
});
