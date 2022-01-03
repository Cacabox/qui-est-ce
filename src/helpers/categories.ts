import { atom, selector } from "recoil";
import { getDatabase, onValue, ref, update } from "firebase/database";

import { getAllCharacters } from "@helpers/character";
import { getRoomPath } from "@helpers/room";

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

export const getCategoriesBanned = atom<string[]>({
    key              : "getCategoriesBanned",
    default          : [],
    effects_UNSTABLE : [
        ({ setSelf, onSet, getLoadable }) => {
            const db = getDatabase();

            const path = getLoadable(getRoomPath).contents;

            const roomDoc           = ref(db, path);
            const roomCategoriesDoc = ref(db, `${ path }/categoriesBanned`);

            onSet((newValue) => {
                update(roomDoc, { categoriesBanned: newValue });
            });

            const unsubscribe = onValue(roomCategoriesDoc, data => setSelf(data.val() || []));

            return () => unsubscribe();
        },
    ]
});
