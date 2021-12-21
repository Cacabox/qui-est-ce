import { atom, selector } from "recoil";

import { getChannel } from "@helpers/client";

import type { CharacterProps } from "@components/Character";
import { ClientEvent } from "@components/Client";

export type RoundState = "not-started" | "choose-character" | "running" | "finished";

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

            channel.publish(ClientEvent.state, newValue);
        }
    }
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

        channel.publish(ClientEvent.characters, newValue);
    }
});

export const getRoundCharactersOpponent = atom<CharacterProps[]>({
    key     : "getRoundCharactersOpponent",
    default : []
});

export const getRoundCharacterToGuess = atom<CharacterProps | undefined>({
    key     : "getRoundCharacterToGuess",
    default : undefined,
});

export const getRoundCharacterGuessed = atom<CharacterProps | undefined>({
    key     : "roundCharacterGuessedAtom",
    default : undefined,
});
