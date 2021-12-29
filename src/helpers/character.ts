import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { gql } from "@apollo/client";
import { child, getDatabase, onValue, ref, remove, update } from "firebase/database";

import { apolloClient } from "@helpers/client";

import type { CharacterProps } from "@components/Character";

export type CharacterStatus = "show" | "hide";

interface getPersonnagesQuery {
    data: {
        personages: [{
            id         : string,
            nom        : string,
            categories : { nom: string }[],
            image      : { url: string, offsetX: number | null } | null,
        }]
    }
}

export const getAllCharacters = atom<CharacterProps[]>({
    key              : "getAllCharacters",
    default          : [],
    effects_UNSTABLE : [
        ({ setSelf }) => {
            (async() => {
                const { data: { personages } }: getPersonnagesQuery = await apolloClient.query({
                    query: gql`
                        query getPersonnages {
                            personages(first: 1000) {
                                id
                                nom
                                categories {
                                    nom
                                }
                                image {
                                    url(transformation: {image: {resize: {height: 200}}})
                                    offsetX
                                }
                            }
                        }
                    `
                });

                const characters = personages.map((personage): CharacterProps | undefined => {
                    if (!personage.image) {
                        return;
                    }

                    const categories = personage.categories.map(_ => _.nom);

                    return {
                        id         : personage.id,
                        name       : personage.nom,
                        categories : categories.length > 0 ? categories : ["Autre"],
                        image      : personage.image,
                    }
                }).filter(_ => _ !== undefined);

                // @ts-expect-error
                setSelf(characters)
            })();
        }
    ]
});

const charactersForUserAtom = atomFamily<string[], string | undefined>({
    key              : "charactersForUserAtom",
    default          : [],
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            if (!path) {
                return;
            }

            const db = getDatabase();

            const userDoc = ref(db, path);

            onSet((newValue) => {
                if (newValue == undefined) {
                    remove(child(userDoc, "characters"));
                } else {
                    update(userDoc, {
                        characters: newValue,
                    });
                }
            });

            const unsubscribe = onValue(userDoc, (doc) => {
                const data = doc.val() as { characters: string[] };

                if(data?.characters) {
                    setSelf(data.characters);
                } else {
                    setSelf([]);
                }
            });

            return () => unsubscribe();
        },
    ],
});

export const getCharactersForUser = selectorFamily<CharacterProps[], string | undefined>({
    key: "getCharactersForUser",
    get: path => ({ get }) => {
        if (!path) {
            return [];
        }

        const characters = get(getAllCharacters);

        const charactersId = get(charactersForUserAtom(path));

        // @ts-expect-error
        const result: CharacterProps[] = charactersId.map(id => characters.find(character => character.id === id)).filter(_ => _ != undefined);

        return result;
    },
    set: path => ({ set }, newValue) => {
        if (!path || newValue instanceof DefaultValue) {
            return;
        }

        set(charactersForUserAtom(path), newValue.map(_ => _.id));
    }
});

const characterSecretForUserAtom = atomFamily<string | undefined, string | undefined>({
    key              : "characterSecretForUserAtom",
    default          : undefined,
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            if (!path) {
                return;
            }

            const db = getDatabase();

            const userDoc = ref(db, path);

            onSet((newValue) => {
                if (newValue == undefined) {
                    remove(child(userDoc, "characterSecret"));
                } else {
                    update(userDoc, {
                        characterSecret: newValue,
                    });
                }
            });

            const unsubscribe = onValue(userDoc, (doc) => {
                const data = doc.val();

                if(data?.characterSecret) {
                    setSelf(data.characterSecret);
                } else {
                    setSelf(undefined);
                }
            });

            return () => unsubscribe();
        },
    ],
});

export const getCharacterSecretForUser = selectorFamily<CharacterProps | undefined, string | undefined>({
    key: "getCharacterSecretForUser",
    get: path => ({ get }) => {
        if (!path) {
            return;
        }

        const characters = get(getAllCharacters);

        const charactersId = get(characterSecretForUserAtom(path));

        return characters.find(character => character.id === charactersId);
    },
    set: path => ({ set }, newValue) => {
        if (!path || newValue instanceof DefaultValue) {
            return;
        }

        set(characterSecretForUserAtom(path), newValue?.id);
    },
});

const characterGuessForUserAtom = atomFamily<string | undefined, string | undefined>({
    key              : "characterGuessForUserAtom",
    default          : undefined,
    effects_UNSTABLE : path => [
        ({ setSelf, onSet }) => {
            if (!path) {
                return;
            }

            const db = getDatabase();

            const userDoc = ref(db, path);

            onSet((newValue) => {
                if (newValue == undefined) {
                    remove(child(userDoc, "characterGuess"));
                } else {
                    update(userDoc, {
                        characterGuess: newValue,
                    });
                }
            });

            const unsubscribe = onValue(userDoc, (doc) => {
                const data = doc.val();

                if (data?.characterGuess) {
                    setSelf(data.characterGuess);
                } else {
                    setSelf(undefined);
                }
            });

            return () => unsubscribe();
        },
    ],
});

export const getCharacterGuessForUser = selectorFamily<CharacterProps | undefined, string | undefined>({
    key: "getCharacterGuessForUser",
    get: path => ({ get }) => {
        if (!path) {
            return;
        }

        const characters = get(getAllCharacters);

        const charactersId = get(characterGuessForUserAtom(path));

        return characters.find(character => character.id === charactersId);
    },
    set: path => ({ set }, newValue) => {
        if (!path || newValue instanceof DefaultValue) {
            return;
        }

        set(characterGuessForUserAtom(path), newValue?.id);
    },
});
