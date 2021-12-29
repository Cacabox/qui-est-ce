import { atomFamily, selector } from "recoil";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { getAllCharacters } from "@helpers/character";
import { firestoreClient } from "@helpers/client";

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
            const roomDoc = doc(firestoreClient, path);

            onSet((newValue) => {
                setDoc(roomDoc, {
                    categoriesBanned: newValue,
                }, { merge: true });
            });

            const unsubscribe = onSnapshot(roomDoc, (doc) => {
                const data = doc.data();

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
