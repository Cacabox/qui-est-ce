import { selector } from "recoil";
import { gql } from "@apollo/client";

import { getApolloClient } from "@helpers/client";

import type { CharacterProps } from "@components/Character";

export type CharacterStatus = "show" | "hide";

interface getPersonnagesQuery {
    data: {
        personages: [{
            id    : string,
            nom   : string,
            image : { url: string }
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
                    personages {
                        id
                        nom
                        image {
                            url
                        }
                    }
                }
            `
        });

        const characters = personages.map((personage):CharacterProps => {
            return {
                id    : personage.id,
                name  : personage.nom,
                image : personage.image.url,
            }
        });

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
