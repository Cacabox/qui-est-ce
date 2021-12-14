import { atom, selector } from "recoil";

import { getCharacters } from "@helpers/character";
import { getChannel } from "@helpers/client";

import type { CharacterProps } from "@components/Character";

export type RoundState = "not-started" | "running" | "finished";

export const roundStateAtom = atom<RoundState>({
    key     : "roundStateAtom",
    default : "not-started",
});

export const publishRoundState = selector<RoundState>({
    key: "publishRoundState",
    get: ({ get }) => get(roundStateAtom),
    set: ({ get }, newValue) => {
        const oldValue = get(roundStateAtom);

        if (oldValue !== newValue) {
            const channel = get(getChannel);

            channel.publish("roundState", newValue);
        }
    }
});

export const getRoundOpponentSelectedCharacter = atom<CharacterProps | undefined>({
    key     : "getRoundOpponentSelectedCharacter",
    default : undefined,
});

export const getRoundOpponentCharacters = atom<CharacterProps[]>({
    key     : "getRoundOpponentCharacters",
    default : []
});

export const getRoundPossibleCharacters = selector<CharacterProps[]>({
    key: "getRoundPossibleCharacters",
    get: ({ get }) => {
        const characters = get(getCharacters);
        const filtered   = get(getRoundOpponentCharacters);

        if (filtered.length === 0) {
            return characters;
        }

        return characters.filter((character) => !filtered.includes(character));
    },
});

const roundCharactersAtom = atom<CharacterProps[]>({
    key     : "roundCharactersAtom",
    default : [],
});

export const publishRoundCharacters = selector<CharacterProps[]>({
    key: "publishRoundCharacters",
    get: ({ get }) => get(roundCharactersAtom),
    set: ({ get, set }, newValue) => {
        const channel = get(getChannel);

        set(roundCharactersAtom, newValue);

        channel.publish("roundCharacters", newValue);
    }
});
