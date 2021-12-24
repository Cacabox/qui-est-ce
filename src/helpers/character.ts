import { selector } from "recoil";
import { gql } from "@apollo/client";

import { getApolloClient } from "@helpers/client";

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

export const getCharacters = selector<CharacterProps[]>({
    key: "getCharacters",
    get: async({ get }) => {
        const client = get(getApolloClient);

        const { data: { personages } }: getPersonnagesQuery = await client.query({
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

            return {
                id         : personage.id,
                name       : personage.nom,
                categories : personage.categories.map(_ => _.nom),
                image      : personage.image,
            }
        }).filter(_ => _ !== undefined);

        return shuffle([...characters]);
    },
});

// From : https://github.com/d3/d3-array/blob/main/src/shuffle.js
function shuffle(array: any[], i0 = 0, i1 = array.length) {
    let m = i1 - (i0 = +i0);

    while (m) {
        const i = Math.random() * m-- | 0, t = array[m + i0];
        array[m + i0] = array[i + i0];
        array[i + i0] = t;
    }

    return array;
}
