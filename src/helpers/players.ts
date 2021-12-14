import { atom } from "recoil";

export interface PlayerProps {
    name      : string,
    timestamp : number,
}

export const getPlayers = atom<PlayerProps[]>({
    key     : "getPlayers",
    default : [],
});

