import { atom, selector } from "recoil";

import { getCurrentUser } from "@helpers/user";

import { CharacterProps } from "@components/Character";

export interface Player {
    id       : string,
    name     : string,
    photoURL : string,
    online   : boolean,

    characters ?: CharacterProps[],
}

export const getPlayers = atom<Player[]>({
    key     : "getPlayers",
    default : [],
});

export const getPlayersOnline = selector<Player[]>({
    key: "getPlayersOnline",
    get: ({ get }) => get(getPlayers).filter(_ => _.online),
});

export const getMe = selector<Player | undefined>({
    key: "getMe",
    get: ({ get }) => get(getPlayers).find(_ => _.id === get(getCurrentUser).uid),
});

export const getOpponent = selector<Player | undefined>({
    key: "getOpponent",
    get: ({ get }) => get(getPlayers).find(_ => _.id !== get(getCurrentUser).uid),
});

