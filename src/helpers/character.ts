import { atom, DefaultValue, selectorFamily } from "recoil";
import { gql } from "@apollo/client";

import { apolloClient, getDataFromPath } from "@helpers/client";
import { getRoomPath } from "@helpers/room";
import { Player } from "@helpers/players";

import type { CharacterProps } from "@components/Character";

export interface CharacterGuess extends CharacterProps {
    reason: "right" | "wrong" | "asking";
}

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
                setSelf(characters);
            })();
        }
    ]
});

export const getCharactersForPlayer = selectorFamily<CharacterProps[], Player | undefined>({
    key: "getCharactersForPlayer",
    get: player => ({ get }) => {
        if (!player) {
            return [];
        }

        const characters = get(getAllCharacters);

        const room = get(getRoomPath);

        const path = `${ room }/characters/${ player.id }`;

        const charactersId = get(getDataFromPath(path)) || [];

        // @ts-expect-error
        const result: CharacterProps[] = charactersId.map(id => characters.find(character => character.id === id)).filter(_ => _ != undefined);

        return result;
    },
    set: player => ({ set, get }, newValue) => {
        if (!player || newValue instanceof DefaultValue) {
            return;
        }

        const room = get(getRoomPath);

        const path = `${ room }/characters/${ player.id }`

        set(getDataFromPath(path), newValue.map(_ => _.id));
    }
});

export const getCharacterSecretForPlayer = selectorFamily<CharacterProps | undefined, Player | undefined>({
    key: "getCharacterSecretForPlayer",
    get: player => ({ get }) => {
        if (!player) {
            return;
        }

        const characters = get(getAllCharacters);

        const room = get(getRoomPath);

        const path = `${ room }/secret/${ player.id }`;

        const charactersId = get(getDataFromPath(path));

        return characters.find(character => character.id === charactersId);
    },
    set: player => ({ set, get }, newValue) => {
        if (!player || newValue instanceof DefaultValue) {
            return;
        }

        const room = get(getRoomPath);

        const path = `${ room }/secret/${ player.id }`;

        set(getDataFromPath(path), newValue?.id);
    },
});

export const getCharacterGuessForPlayer = selectorFamily<CharacterGuess | undefined, Player | undefined>({
    key: "getCharacterGuessForPlayer",
    get: player => ({ get }) => {
        if (!player) {
            return;
        }

        const characters = get(getAllCharacters);

        const room = get(getRoomPath);

        const path = `${ room }/guess/${ player.id }`;

        const guess: { id: string, reason: CharacterGuess["reason"] } | undefined = get(getDataFromPath(path));

        if (!guess) {
            return;
        }

        const character = characters.find(character => character.id === guess.id);

        if (!character) {
            throw new Error("No character found");
        }

        const result: CharacterGuess = { ...character, reason: guess.reason }

        return result;
    },
    set: player => ({ set, get }, newValue) => {
        if (!player || newValue instanceof DefaultValue) {
            return;
        }

        const room = get(getRoomPath);

        const path = `${ room }/guess/${ player.id }`;

        set(getDataFromPath(path), newValue);
    },
});
