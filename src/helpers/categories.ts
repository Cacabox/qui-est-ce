import { atomFamily, selector } from "recoil";
import { getDatabase, onValue, ref, update } from "firebase/database";

import { getAllCharacters } from "@helpers/character";
import { getInDb } from "@helpers/client";

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
    default : async(room) => {
        const db = getDatabase();

        const roomCategoriesDoc = ref(db, `${ room }/categoriesBanned`);

        const data = await getInDb(roomCategoriesDoc);

        return data || [];
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
