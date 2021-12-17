import { atom, selector } from "recoil";
import { gql } from "@apollo/client";

import { getApolloClient } from "@helpers/client";

import type { CharacterProps } from "@components/Character";

export type CharacterStatus = "show" | "hide";

interface getPersonnagesQuery {
    data: {
        personages: [{
            nom   : string,
            image : { url: string }
        }]
    }
}

export const getCharacters = selector<CharacterProps[]>({
    key: "getCharacters",
    get: async({ get }) => {
        const client = get(getApolloClient);

        console.log("QUERY");

        const { data: { personages } }: getPersonnagesQuery = await client.query({
            query: gql`
                query getPersonnages {
                    personages {
                        nom
                        image {
                        url
                        }
                    }
                }
            `
        });

        return personages.map((personage):CharacterProps => {
            return {
                name  : personage.nom,
                image : personage.image.url,
            }
        });
    },
});
