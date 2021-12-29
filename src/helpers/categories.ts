import { atomFamily, selector } from "recoil";
import { getDatabase, onValue, ref, update } from "firebase/database";

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

export const getCategoriesBanned = atomFamily<string[], string>({
    key              : "getCategoriesBanned",
    default          : [],
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const roomDoc = ref(db, path);

            onSet((newValue) => {
                update(roomDoc, {
                    categoriesBanned: newValue,
                });
            });

            const unsubscribe = onValue(roomDoc, (doc) => {
                const data = doc.val();

                if(data?.categoriesBanned) {
                    setSelf(data.categoriesBanned);
                } else {
                    setSelf([]);
                }
            });

            return () => unsubscribe();
        },
    ]
});
